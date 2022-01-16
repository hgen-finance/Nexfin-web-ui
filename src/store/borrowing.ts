// Import Typed
import { getterTree, mutationTree, actionTree } from 'typed-vuex'

// Import Utils
import { borrowUtil } from '@/utils/borrow'
import { closeBorrowUtil } from '@/utils/closeBorrow'
import { createATA } from '@/utils/createATA';
import { payBorrowUtil } from '@/utils/payBorrow';
import { addBorrowUtil } from '@/utils/addBorrow';
import { TROVE_ACCOUNT_DATA_LAYOUT, TroveLayout, getCollateral, TOKEN_GENS } from "@/utils/layout";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

// State
export const state = () => ({
    troveId: '',
    trove: { "troveAccountPubkey": "", "amountToClose":0, "depositorFee": 0},
    debt: 0,
    loading: false,
    loadingSub: false,
    borrowOrPay: true,
    closeAmount: 0,
})

// Getters
export const getters = getterTree(state, {})

// Mutation
export const mutations = mutationTree(state, {
    setTroveId(state, newValue: any) {
        state.troveId = newValue
    },

    setTrove(state, newValue: any) {
        state.trove = newValue
        console.log({ newValue })
    },

    setDebt(state, newValue: number) {
        state.debt = newValue
    },

    setLoading(state, newValue: boolean) {
        state.loading = newValue
    },

    setLoadingSub(state, newValue: boolean) {
        state.loadingSub = newValue
    },

    setBorrowOrPay(state, newValue: boolean) {
        state.borrowOrPay = newValue
    },
    setCloseAmount(state, newValue: number) {
        state.closeAmount = newValue
    }
})

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        async setTroveById({ commit }, value) {
            const encodedTroveState = (await this.$web3.getAccountInfo(value, 'singleGossip'))!.data;
            const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(encodedTroveState) as TroveLayout;
            
            console.log({ decodedTroveState })
            commit('setTrove', {
                troveAccountPubkey: value.toBase58(),
                isInitialized: !!decodedTroveState.isInitialized,
                isLiquidated: !!decodedTroveState.isLiquidated,
                isReceived: !!decodedTroveState.isReceived,
                borrowAmount: new BN(decodedTroveState.borrowAmount, 10, 'le').toNumber(),
                lamports: new BN(decodedTroveState.lamports, 10, 'le').toString(),
                teamFee: new BN(decodedTroveState.teamFee, 10, 'le').toString(),
                depositorFee: new BN(decodedTroveState.depositorFee, 10, 'le').toString(),
                amountToClose: new BN(decodedTroveState.amountToClose, 10, 'le').toString(),
                owner: new PublicKey(decodedTroveState.owner).toBase58(),
            })
        },
        // Get Deposit
        async getTrove({ commit, dispatch }, value) {
            if (this.$wallet){
                await this.$axios.get('trove?user=' + this.$wallet.publicKey.toBase58()).then(({ data }) => {                
                    commit('setTroveId',  data.model.trove || '')
                    if (data.model && data.model.trove) {
                        dispatch('setTroveById', new PublicKey(data.model.trove))
                        this.$accessor.dashboard.setBorrow(true)
                    }
                })
            }
        },
        // Claim
        async confirmBorrow({ state, commit, dispatch }, value) {

            // calculate team fee and depositor fee
            let team_fee = 0.1 * value.to/100
            team_fee = team_fee < 1 ? 1: team_fee;

            let borrower_fee = 0.4 * value.to/100
            borrower_fee = borrower_fee < 4 ? 4: borrower_fee;
            
            let total_fee = team_fee + borrower_fee
            let mintAmount = value.to - total_fee;

            console.log(mintAmount, "mintAmount")
            let totalColl = 0;
            if (this.$accessor.borrowing.trove.amountToClose > 0) {
                totalColl = getCollateral(
                (
                    Number(this.$accessor.borrowing.trove.amountToClose) +
                    parseInt(value.to)
                ).toString(),
                (
                    Number(this.$accessor.borrowing.trove.lamports) +
                    parseInt(value.from) * 1000000000
                ).toString(),
                parseInt(this.$accessor.usd).toString()
                ).toNumber();
            } else {
                totalColl = this.$accessor.borrowing.debt || 0;
            }
            // dispatch('getTrove').then(res => console.log("dispatching trove..."), err => console.log(err))

            console.log(state.troveId, "troveId")

            // check if there already previous trove opened under this wallet pub key
            if(state.troveId && Number(value.from > 0) && totalColl > 109){
                console.log("this is read")
                try{
                    commit('setLoading', true)
                    const data = await addBorrowUtil(this.$wallet, state.troveId, Number(value.to), Number(value.from) * 1000000000, this.$web3);
                    console.log(data, 'updated trove');
                    await this.$axios.post('trove/addBorrow', { trove: data.troveAccountPubkey, amount: Number(value.to), user: value.mint, dest:this.$wallet.publicKey.toBase58() }).then((res) => {
                        console.log(res, 'newTrove Backend')
                    })
                    dispatch('setTroveById', new PublicKey(data.troveAccountPubkey))
                    commit('setLoading', false)
                    this.$accessor.wallet.getBalance()
                    this.$accessor.wallet.getGENSBalance()
                } catch {
                    commit('setLoading', false)
                } 
                return;     
            }

            // check if the collateral ratio is not higher than the 109
            const cr = getCollateral(value.to.toString(), (Number(value.from) * 1000000000).toString(), parseInt(this.$accessor.usd).toString()).toNumber();
            
            if (!state.troveId && Number(value.from > 0) && Number(value.to) > 1599 && cr > 109) {
                commit('setLoading', true)
                try {
                    const data = await borrowUtil(this.$wallet, mintAmount, Number(value.to), Number(value.from) * 1000000000, this.$web3)
                    
                    if (data && (data.troveAccountPubkey)) {
                        commit('setTroveId', data.troveAccountPubkey || '')
                        this.$accessor.wallet.getBalance()
                        dispatch('setTroveById', new PublicKey(data.troveAccountPubkey))
                        this.$accessor.dashboard.setBorrow(true)
                        await this.$axios.post('trove/upsert', { trove: data.troveAccountPubkey, user: value.mint, dest:this.$wallet.publicKey.toBase58()}).then((res) => {
                             console.log(res, 'newTrove Backend')
                        })
                    }
                    commit('setLoading', false) 
                    this.$accessor.wallet.getGENSBalance()
                } catch {
                    commit('setLoading', false)
                }
                this.$accessor.dashboard.setBorrow(true)
            }
        },

        // Deposit
        async closeTrove({ state, commit, dispatch }, value) {
            let GENS = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {mint: new PublicKey(TOKEN_GENS)});   
            let burn_addr = GENS.value[0].pubkey.toBase58();
            if (state.troveId) {
                commit('setLoading', true)
                try {
                    console.log("processing closing the trove...")
                    console.log(value.amount)
                    const data = await closeBorrowUtil(this.$wallet, "7d3U17g4WEZkVGjRVVQchrgEaoFAuuui2xmEGCzmtUGt", state.trove.troveAccountPubkey, burn_addr, value.amount, this.$web3)
                    // const data = await closeBorrowUtil(this.$wallet, process.env.mint, state.trove.troveAccountPubkey, value.mint, value.amount, this.$web3)
                    if (data === null) {
                        console.log(data, 'closeTrove')
                        commit('setTroveId', '')
                        await this.$axios.post('trove/liquidate', { trove: state.trove.troveAccountPubkey }).then((res) => {
                            console.log(res, 'newTrove Backend')
                        })
                        commit('setTrove', {})
                        this.$accessor.wallet.getBalance()
                        this.$accessor.wallet.getGENSBalance()
                        this.$accessor.dashboard.setBorrow(false)
                    }
                    // else {
                    //     dispatch('setTroveById', new PublicKey(data.troveAccountPubkey))
                    //     await this.$axios.post('trove/upsert', { trove: data.troveAccountPubkey, user: value.mint }).then((res) => {
                    //         console.log(res, 'updateTrove Backend')
                    //     })
                    // }
                    commit('setLoading', false)
                } catch (e) {
                    console.log({ e })
                    commit('setLoading', false)
                }
            }
        },

        //updating the trove amount
        async payTrove({ state, commit, dispatch }, value){
            let GENS = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {mint: new PublicKey(TOKEN_GENS)});   
            let burn_addr = GENS.value[0].pubkey.toBase58();
            console.log("the amount entered is ", value.amount)
            console.log("the amount to close before was ", state.trove.amountToClose)
            const exceedAmount = state.trove.amountToClose > Number(value.amount) ? false: true
        
            if (state.troveId && (!exceedAmount)) {
                commit('setLoading', true)
                try {
                    console.log("processing updating the trove...")
                    console.log(value.amount)
                    const data = await payBorrowUtil(this.$wallet, "7d3U17g4WEZkVGjRVVQchrgEaoFAuuui2xmEGCzmtUGt", state.trove.troveAccountPubkey, burn_addr, value.amount, this.$web3)
                    console.log("data after updating the trove is",data)

                    await this.$axios.post('trove/pay', {trove:state.trove.troveAccountPubkey, amount: value.amount}).then((res)=>{
                        console.log(res, 'payTroveBackend')
                    })

                    const encodedTroveState = (await this.$web3.getAccountInfo(new PublicKey(state.trove.troveAccountPubkey), 'singleGossip'))!.data;
                    const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(encodedTroveState) as TroveLayout;
                    
                    console.log({ decodedTroveState })
                    commit('setTrove', {
                        troveAccountPubkey: state.trove.troveAccountPubkey,
                        isInitialized: !!decodedTroveState.isInitialized,
                        isLiquidated: !!decodedTroveState.isLiquidated,
                        isReceived: !!decodedTroveState.isReceived,
                        borrowAmount: new BN(decodedTroveState.borrowAmount, 10, 'le').toNumber(),
                        lamports: new BN(decodedTroveState.lamports, 10, 'le').toString(),
                        teamFee: new BN(decodedTroveState.teamFee, 10, 'le').toString(),
                        depositorFee: new BN(decodedTroveState.depositorFee, 10, 'le').toString(),
                        amountToClose: new BN(decodedTroveState.amountToClose, 10, 'le').toString(),
                        owner: new PublicKey(decodedTroveState.owner).toBase58(),
                    })

                    this.$accessor.wallet.getGENSBalance()
                    commit('setLoading', false)
                } catch (e) {
                    console.log({ e })
                    commit('setLoading', false)
                }
            }

        },

        // Get Debt Ratio
        getDebt({ commit }, value) {
            if (value && (value.from > 0 && value.to > 0)) {
                commit('setDebt', getCollateral(value.to.toString(), (Number(value.from) * 1000000000).toString(), parseInt(this.$accessor.usd).toString()).toNumber())
            } else {
                commit('setDebt', 0)
            }
        },

        // Send Email
        async sendEmail({ commit }, value) {
            if (value) {
                commit('setLoadingSub', true)
                await this.$axios.post('/notification/subscribe', { email: value }).then((res) => {
                    console.log(res, 'Subscribe')
                }).finally(() => {
                    commit('setLoadingSub', false)
                })
            }
        },

        // Change the deposit and withdraw tab
        async changeBorrowOrPay({ commit }, value) {
            let newValue = !value;
            commit('setBorrowOrPay', newValue)
        },

        // get closing borrow amount 
        async closeBorrowAmount({commit}, value){
            if (value){
                console.log("making changes in the repayto")
                commit('setCloseAmount', this.$accessor.borrowing.trove.amountToClose - value.repayTo)
            }
        }
    }
)
