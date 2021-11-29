// Import Typed
import { PublicKey } from '@solana/web3.js';
import { DEPOSIT_ACCOUNT_DATA_LAYOUT, DepositLayout } from '@/utils/layout';
import { getterTree, mutationTree, actionTree } from 'typed-vuex'

// Import Utils
import { depositUtil } from '@/utils/deposit'
import { addDepositUtil } from '@/utils/addDeposit'
import BN from "bn.js";

// State
export const state = () => ({
  depositKey: {"deposit":""},
  gen: '',
  hgen: '',
  rewardCoinAmount: 0,
  rewardHgenAmount: 0,
  rewardGensAmount: 0,
  depositAmount: 0,
  loading: false,
  depositOrWithdraw: true,
})

// Getters
export const getters = getterTree(state, {})

// Mutation
export const mutations = mutationTree(state, {
  setDepositKey (state, newValue: any) {
    state.depositKey = newValue
  },
  setGen (state, newValue: string) {
    state.gen = newValue
  },
  setHGEN (state, newValue: string) {
    state.hgen = newValue
  },
  setRewardCoinAmount (state, newValue: number) {
    state.rewardCoinAmount = newValue
  },
  setRewardHgenAmount (state, newValue: number) {
    state.rewardHgenAmount = newValue
  },
  setRewardGensAmount (state, newValue: number) {
    state.rewardGensAmount = newValue
  },
  setDepositAmount (state, newValue: number) {
    state.depositAmount = newValue
  },
  setLoading (state, newValue: boolean) {
    state.loading = newValue
  },
  setDepositOrWithdraw(state, newValue: boolean) {
      state.depositOrWithdraw = newValue
  }
})

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // Get Deposit
    async getDeposit ({ commit }, value) {
    
      await this.$axios.get('deposit?user=' + this.$wallet.publicKey.toBase58()).then(async ({ data }) => {
        commit('setDepositKey', data.model || '')
        // Info
        const encodedDepositAccount = (await this.$web3.getAccountInfo(new PublicKey(data.model.deposit), 'singleGossip'))!.data;
        const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(encodedDepositAccount) as DepositLayout;
        if (decodedDepositState.bank) {
          commit('setGen', new PublicKey(decodedDepositState.bank).toBase58())
        }
        if (decodedDepositState.governanceBank) {
          commit('setHGEN', new PublicKey(decodedDepositState.governanceBank).toBase58())
        }

        commit('setRewardGensAmount', new BN(decodedDepositState.rewardTokenAmount, 10, 'le').toNumber());
        commit('setRewardHgenAmount', new BN(decodedDepositState.rewardGovernanceTokenAmount, 10, 'le').toNumber());
        commit('setDepositAmount', new BN(decodedDepositState.tokenAmount, 10, 'le').toNumber());
        commit('setRewardCoinAmount', new BN(decodedDepositState.rewardCoinAmount, 10, 'le').toNumber());
      })

    },

    // New Deposit
    async newDeposit ({ state, commit }, value) {
      if (value && (Number(value.from) > 0 && value.gen && value.hgen)) {
        if (!state.depositKey) {
          commit('setLoading', true)
          try {
              console.log("the new deposit is running")
            const test = new PublicKey("C6tfES3TrhTzQnRopAyqHAjx4ixShAzJ16QeffWvoXBk").toBase58();
            const data = await depositUtil(this.$wallet, test, Number(value.from),state.gen, state.hgen, this.$web3)
            if (data && (data.depositAccountPubkey)) {
              commit('setDepositKey', data.depositAccountPubkey || '')
              console.log(data, 'newDeposit')
              await this.$axios.post('deposit/upsert', {deposit: data.depositAccountPubkey}).then((res) => {
                console.log(res, 'newDeposit Backend')
              }).finally(() => {
                commit('setLoading', false)
              })
              this.$accessor.wallet.getBalance()
            }
            commit('setLoading', false)
          } catch {
            commit('setLoading', false)
          }
        }
      }
    },

    // Add Deposit
    async addDeposit ({ state, commit }, value) {
      if (value && (Number(value.from) > 0)) {
        console.log("this is runnng")
        if (state.depositKey && state.gen && state.hgen) {
          commit('setLoading', true)
          try {
           // const data = await addDepositUtil(this.$wallet, state.depositKey.deposit,"C6tfES3TrhTzQnRopAyqHAjx4ixShAzJ16QeffWvoXBk", Number(value.from),"2cWN6Yj93XVkvnswt89S7RQZwJZpzx2S5L8PUvHz1Pyp", "6h81Zm4FdYwuTihTbvESnrScvCEfkTUj94pYkPS1iU1", this.$web3)
            const data = await addDepositUtil(this.$wallet, state.depositKey.deposit, process.env.mint, Number(value.from), state.gen, state.hgen, this.$web3)
            console.log("the data for the add deposit", data);
           //  console.log(data, 'addDeposit')
            this.$accessor.wallet.getBalance()

            await this.$axios.get('deposit?user=' + this.$wallet.publicKey.toBase58()).then(async ({ data }) => {
              commit('setDepositKey', data.model || '')
              // Info
              const encodedDepositAccount = (await this.$web3.getAccountInfo(new PublicKey(data.model.deposit), 'singleGossip'))!.data;
              const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(encodedDepositAccount) as DepositLayout;
              if (decodedDepositState.bank) {
                commit('setGen', new PublicKey(decodedDepositState.bank).toBase58())
              }
              if (decodedDepositState.governanceBank) {
                commit('setHGEN', new PublicKey(decodedDepositState.governanceBank).toBase58())
              }

              commit('setRewardGensAmount', new BN(decodedDepositState.rewardTokenAmount, 10, 'le').toNumber());
              commit('setRewardHgenAmount', new BN(decodedDepositState.rewardGovernanceTokenAmount, 10, 'le').toNumber());
              commit('setDepositAmount', new BN(decodedDepositState.tokenAmount, 10, 'le').toNumber());
              commit('setRewardCoinAmount', new BN(decodedDepositState.rewardCoinAmount, 10, 'le').toNumber());
            })
            commit('setLoading', false)
          } catch {
            commit('setLoading', false)
          }
        }
      }
    },

    // Close Deposit
    async closeDeposit ({ state, commit }, value) {
      if (value && (Number(value) > 0)) {
        if (state.depositKey) {
          commit('setLoading', true)
          this.$axios.post('deposit/withdraw', {deposit: state.depositKey.deposit, amount: value}).then(({ data }) => {
            console.log(data, 'closeDeposit')
          }).finally(async () => {
            commit('setLoading', false)
            this.$accessor.wallet.getBalance()

            await this.$axios.get('deposit?user=' + this.$wallet.publicKey.toBase58()).then(async ({ data }) => {
              commit('setDepositKey', data.model || '')
              // Info
              const encodedDepositAccount = (await this.$web3.getAccountInfo(new PublicKey(data.model.deposit), 'singleGossip'))!.data;
              const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(encodedDepositAccount) as DepositLayout;
              if (decodedDepositState.bank) {
                commit('setGen', new PublicKey(decodedDepositState.bank).toBase58())
              }
              if (decodedDepositState.governanceBank) {
                commit('setHGEN', new PublicKey(decodedDepositState.governanceBank).toBase58())
              }

              commit('setRewardGensAmount', new BN(decodedDepositState.rewardTokenAmount, 10, 'le').toNumber());
              commit('setRewardHgenAmount', new BN(decodedDepositState.rewardGovernanceTokenAmount, 10, 'le').toNumber());
              commit('setDepositAmount', new BN(decodedDepositState.tokenAmount, 10, 'le').toNumber());
              commit('setRewardCoinAmount', new BN(decodedDepositState.rewardCoinAmount, 10, 'le').toNumber());
            })
          })
        }
      }
    },

    // Change the deposit and withdraw tab
    async changeWithdrawAndDeposit ({ state, commit }, value) {
        commit('setDepositOrWithdraw', !value)
    }
  }
)
