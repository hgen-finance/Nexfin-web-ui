// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { borrowUtil } from "@/utils/borrow";
import { closeBorrowUtil } from "@/utils/closeBorrow";
import { createATA } from "@/utils/createATA";
import { payBorrowUtil } from "@/utils/payBorrow";
import { addBorrowUtil } from "@/utils/addBorrow";
import {
    TROVE_ACCOUNT_DATA_LAYOUT,
    TroveLayout,
    getCollateral,
    TOKEN_GENS,
    CLUSTER
} from "@/utils/layout";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

// State
export const state = () => ({
    troveId: "",
    trove: { troveAccountPubkey: "", amountToClose: 0, depositorFee: 0 },
    debt: 0,
    loading: false,
    loadingSub: false,
    borrowOrPay: true,
    closeAmount: 0,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setTroveId(state, newValue: any) {
        state.troveId = newValue;
    },

    setTrove(state, newValue: any) {
        state.trove = newValue;
        console.log({ newValue });
    },

    setDebt(state, newValue: number) {
        state.debt = newValue;
    },

    setLoading(state, newValue: boolean) {
        state.loading = newValue;
    },

    setLoadingSub(state, newValue: boolean) {
        state.loadingSub = newValue;
    },

    setBorrowOrPay(state, newValue: boolean) {
        state.borrowOrPay = newValue;
    },
    setCloseAmount(state, newValue: number) {
        state.closeAmount = newValue;
    },
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        async setTroveById({ commit }, value) {
            const encodedTroveState = (await this.$web3.getAccountInfo(
                value,
                "singleGossip"
            ))!.data;
            const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(
                encodedTroveState
            ) as TroveLayout;

            console.log({ decodedTroveState });
            commit("setTrove", {
                troveAccountPubkey: value.toBase58(),
                isInitialized: !!decodedTroveState.isInitialized,
                isLiquidated: !!decodedTroveState.isLiquidated,
                isReceived: !!decodedTroveState.isReceived,
                borrowAmount: new BN(
                    decodedTroveState.borrowAmount,
                    10,
                    "le"
                ).toNumber(),
                lamports: new BN(decodedTroveState.lamports, 10, "le").toString(),
                teamFee: new BN(decodedTroveState.teamFee, 10, "le").toString(),
                depositorFee: new BN(
                    decodedTroveState.depositorFee,
                    10,
                    "le"
                ).toString(),
                amountToClose: new BN(
                    decodedTroveState.amountToClose,
                    10,
                    "le"
                ).toString(),
                owner: new PublicKey(decodedTroveState.owner).toBase58(),
            });
        },
        // Get Deposit
        async getTrove({ commit, dispatch }, value) {
            if (this.$wallet) {
                await this.$axios
                    .get("/api/trove?user=" + this.$wallet.publicKey.toBase58())
                    .then(({ data }) => {
                        if (data.model && data.model.trove) {
                            commit("setTroveId", data.model.trove || "");
                            dispatch("setTroveById", new PublicKey(data.model.trove));
                            this.$accessor.dashboard.setBorrow(true);
                        }
                    });
            }
        },
        // Claim
        async confirmBorrow({ state, commit, dispatch }, value) {
            // calculate team fee and depositor fee
            let team_fee = (0.1 * value.to) / 100;
            team_fee = team_fee < 1 ? 1 : team_fee;

            let borrower_fee = (0.4 * value.to) / 100;
            borrower_fee = borrower_fee < 4 ? 4 : borrower_fee;

            let total_fee = team_fee + borrower_fee;
            let mintAmount = value.to - total_fee;

            console.log(mintAmount, "mintAmount");
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
                );
            } else {
                totalColl = this.$accessor.borrowing.debt || 0;
            }

            // check if there already previous trove opened under this wallet pub key
            if (state.troveId && Number(value.from > 0) && totalColl > 109) {
                try {
                    commit("setLoading", true);
                    const data = await addBorrowUtil(
                        this.$wallet,
                        state.troveId,
                        Number(value.to),
                        Number(value.from) * 1000000000,
                        this.$web3
                    )

                    // pass wait transaction notification
                    await this.$axios
                        .post("/api/trove/addBorrow", {
                            trove: data.troveAccountPubkey,
                            amount: Number(value.to),
                            user: value.mint,
                            dest: this.$wallet.publicKey.toBase58(),
                        })
                        .then((res) => {
                            console.log(res, "addTrove Backend");
                        });
                    dispatch("setTroveById", new PublicKey(data.troveAccountPubkey));
                    commit("setLoading", false);
                    this.$accessor.wallet.getBalance();
                    this.$accessor.wallet.getGENSBalance();
                    await this.$axios
                        .post("/api/reward/addReward", {
                            amount: value.to,
                        })
                        .then((res) => {
                            console.log(res, "reward Added to the liquidity provider");
                        });
                } catch {
                    commit("setLoading", false);
                }
                return;
            }

            // check if the collateral ratio is not higher than the 109
            const cr = getCollateral(
                value.to.toString(),
                (Number(value.from) * 1000000000).toString(),
                parseInt(this.$accessor.usd).toString()
            );

            if (
                !state.troveId &&
                Number(value.from > 0) &&
                Number(value.to) > 99 &&
                cr > 109
            ) {
                commit("setLoading", true);
                try {
                    const data = await borrowUtil(
                        this.$wallet,
                        mintAmount,
                        Number(value.to),
                        Number(value.from) * 1000000000,
                        this.$web3
                    );

                    console.log(`https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`, "transaction id ")
                    console.log(`${data.txId.substring(0, 14)}...${data.txId.substring(data.txId.length - 14)}`)
                    // pass wait transaction notification
                    this.$accessor.notification.notify({
                        title: 'Transaction sent',
                        description: 'Waiting for confirmation',
                        type: 'confirm',
                        txId: data.txId,
                    })

                    console.log("this list of notification is ", this.$accessor.notification.notifications.map(val => val));

                    // handling the transaciton in the borrow
                    await this.$web3.confirmTransaction(data.txId).then(res => { console.log(res, `-----res`) }, err => {
                        console.error(err.message, "my err")
                    });


                    if (data && data.troveAccountPubkey) {
                        commit("setTroveId", data.troveAccountPubkey || "");
                        this.$accessor.wallet.getBalance();
                        dispatch("setTroveById", new PublicKey(data.troveAccountPubkey));
                        this.$accessor.dashboard.setBorrow(true);
                        await this.$axios
                            .post("/api/trove/upsert", {
                                trove: data.troveAccountPubkey,
                                amount: Number(value.to),
                                user: value.mint,
                                dest: this.$wallet.publicKey.toBase58(),
                            })
                            .then((res) => {
                                console.log(res, "newTrove Backend");
                            });
                    }
                    commit("setLoading", false);
                    this.$accessor.wallet.getGENSBalance();
                    await this.$axios
                        .post("/api/reward/addReward", {
                            amount: value.to,
                        })
                        .then((res) => {
                            console.log(res, "reward Added to the liquidity provider");
                        });
                } catch {
                    commit("setLoading", false);
                }
                this.$accessor.dashboard.setBorrow(true);
            }
        },

        // Deposit
        async closeTrove({ state, commit, dispatch }, value) {
            // calculate team fee and depositor fee
            let team_fee = (0.1 * value.amount) / 100;
            team_fee = team_fee < 1 ? 1 : team_fee;

            let borrower_fee = (0.4 * value.amount) / 100;
            borrower_fee = borrower_fee < 4 ? 4 : borrower_fee;

            let total_fee = team_fee + borrower_fee;
            let pay_amount = Number(value.amount) + total_fee;
            console.log(pay_amount, "pay amount");

            let GENS = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: new PublicKey(TOKEN_GENS) }
            );
            let burn_addr = GENS.value[0].pubkey.toBase58();
            if (state.troveId) {
                commit("setLoading", true);
                try {
                    console.log("processing closing the trove...");
                    console.log(value.amount);

                    await this.$axios
                        .post("/api/trove/pay", {
                            trove: state.trove.troveAccountPubkey,
                            amount: value.amount,
                        })
                        .then((res) => {
                            console.log(res, "payTroveBackend");
                        });

                    const data = await closeBorrowUtil(
                        this.$wallet,
                        "7d3U17g4WEZkVGjRVVQchrgEaoFAuuui2xmEGCzmtUGt",
                        state.trove.troveAccountPubkey,
                        burn_addr,
                        value.amount,
                        this.$web3
                    );

                    if (data === null) {
                        console.log(data, "closeTrove");
                        commit("setTroveId", "");
                        await this.$axios
                            .post("/api/trove/liquidate", {
                                trove: state.trove.troveAccountPubkey,
                            })
                            .then((res) => {
                                console.log(res, "newTrove Backend");
                            });
                        dispatch("borrowing/clearTrove", null, { root: true });
                        this.$accessor.wallet.getBalance();
                        this.$accessor.wallet.getGENSBalance();
                        this.$accessor.dashboard.setBorrow(false);
                    }
                    commit("setLoading", false);
                    await this.$axios
                        .post("/api/reward/addReward", {
                            amount: value.amount,
                        })
                        .then((res) => {
                            console.log(res, "reward Added to the liquidity provider");
                        });
                } catch (e) {
                    console.log({ e });
                    commit("setLoading", false);
                }
            }
        },

        //updating the trove amount
        async payTrove({ state, commit, dispatch }, value) {
            let team_fee = (0.1 * value.amount) / 100;
            team_fee = team_fee < 1 ? 1 : team_fee;

            let borrower_fee = (0.4 * value.amount) / 100;
            borrower_fee = borrower_fee < 4 ? 4 : borrower_fee;

            let total_fee = team_fee + borrower_fee;
            let pay_amount = Number(value.amount) + total_fee;
            console.log(pay_amount, "pay amount");

            let GENS = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: new PublicKey(TOKEN_GENS) }
            );
            let burn_addr = GENS.value[0].pubkey.toBase58();
            const exceedAmount =
                state.trove.amountToClose >= Number(value.amount) ? false : true;

            if (state.troveId && !exceedAmount) {
                commit("setLoading", true);
                try {
                    console.log("processing updating the trove...");
                    console.log(value.amount);
                    const data = await payBorrowUtil(
                        this.$wallet,
                        "7d3U17g4WEZkVGjRVVQchrgEaoFAuuui2xmEGCzmtUGt",
                        state.trove.troveAccountPubkey,
                        burn_addr,
                        value.amount,
                        this.$web3
                    );
                    console.log("data after updating the trove is", data);

                    await this.$axios
                        .post("/api/trove/pay", {
                            trove: state.trove.troveAccountPubkey,
                            amount: value.amount,
                        })
                        .then((res) => {
                            console.log(res, "payTroveBackend");
                        });

                    this.$accessor.wallet.getGENSBalance();
                    dispatch("borrowing/setTroveById", state.trove.troveAccountPubkey, { root: true })
                    commit("setLoading", false);

                    // TODO: fix issue for ``block has not found on rewards``. Check the time for the block to expire
                    await this.$axios
                        .post("/api/reward/addReward", {
                            amount: value.amount,
                        })
                        .then((res) => {
                            console.log(res, "reward Added to the liquidity provider");
                        });
                } catch (e) {
                    console.log({ e });
                    commit("setLoading", false);
                }
            }
        },

        // Get Debt Ratio
        getDebt({ commit }, value) {
            if (value && value.from > 0 && value.to > 0) {
                commit(
                    "setDebt",
                    getCollateral(
                        value.to.toString(),
                        (Number(value.from) * 1000000000).toString(),
                        parseInt(this.$accessor.usd).toString()
                    )
                );
            } else {
                commit("setDebt", 0);
            }
        },

        // Send Email
        async sendEmail({ commit }, value) {
            if (value) {
                commit("setLoadingSub", true);
                await this.$axios
                    .post("/notification/subscribe", { email: value })
                    .then((res) => {
                        console.log(res, "Subscribe");
                    })
                    .finally(() => {
                        commit("setLoadingSub", false);
                    });
            }
        },

        // Change the deposit and withdraw tab
        async changeBorrowOrPay({ commit }, value) {
            let newValue = !value;
            commit("setBorrowOrPay", newValue);
        },

        // get closing borrow amount
        async closeBorrowAmount({ commit }, value) {
            if (value) {
                console.log("making changes in the repayto");
                commit(
                    "setCloseAmount",
                    this.$accessor.borrowing.trove.amountToClose - value.repayTo
                );
            }
        },

        // clear trove state when user logs out of the wallet
        async clearTrove({ commit }) {
            commit("setTroveId", "");
            commit("setTrove", {
                troveAccountPubkey: "",
                amountToClose: 0,
                depositorFee: 0,
            });
            commit("setCloseAmount", 0);
        },
    }
);
