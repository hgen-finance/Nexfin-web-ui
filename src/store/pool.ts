// Import Typed
import { PublicKey } from "@solana/web3.js";
import {
    TOKEN_GENS,
    TOKEN_HGEN,
    CLUSTER
} from "@/utils/layout";
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { depositUtil } from "@/utils/deposit";
import { addDepositUtil } from "@/utils/addDeposit";
import { withdrawUtil } from "@/utils/withdraw";
import { claimRewardUtil } from "@/utils/claimDepositReward";

// anchor
import { setup } from "@/utils/anchor";

require("dotenv").config();

// State
export const state = () => ({
    depositKey: { deposit: "" },
    gen: "EdvHEGQ2sqC4ZofLpj2xE5BQefgewWFY5nHe9aMcReC1",
    hgen: "8dMknixujhgPTWBLsB6WRof9e1Ud3NpH4iBVtBrsqMK7",
    rewardCoinAmount: 0,
    rewardHgenAmount: 0,
    rewardGensAmount: 0,
    depositAmount: 0,
    loading: false,
    depositOrWithdraw: true,
    depositList: [],
    depositTotal: 0,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setDepositKey(state, newValue: any) {
        state.depositKey = newValue;
    },
    setGens(state, newValue: string) {
        state.gen = newValue;
    },
    setHgen(state, newValue: string) {
        state.hgen = newValue;
    },
    setRewardCoinAmount(state, newValue: number) {
        state.rewardCoinAmount = newValue;
    },
    setRewardHgenAmount(state, newValue: number) {
        state.rewardHgenAmount = newValue;
    },
    setRewardGensAmount(state, newValue: number) {
        state.rewardGensAmount = newValue;
    },
    setDepositAmount(state, newValue: number) {
        state.depositAmount = newValue;
    },
    setLoading(state, newValue: boolean) {
        state.loading = newValue;
    },
    setDepositOrWithdraw(state, newValue: boolean) {
        state.depositOrWithdraw = newValue;
    },
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // Get Deposit
        async getDeposit({ state, commit }, value) {
            if (this.$wallet) {
                try {
                    await this.$axios
                        .get("/api/deposit?user=" + this.$wallet.publicKey.toBase58())
                        .then(async ({ data }) => {
                            if (data.model) {
                                commit("setDepositKey", data.model || "");

                                let program = await setup(this.$web3, this.$wallet)
                                let result;
                                try {
                                    result = (await program.account.deposit.fetch(new PublicKey(data.model.deposit)));
                                    console.log(result, "result");
                                } catch (err) {
                                    console.error(err)
                                }

                                commit("setGens", result.bank);
                                commit("setHgen", result.governanceBank);
                                commit("setRewardGensAmount", result.rewardTokenAmount);
                                commit("setRewardHgenAmount", result.rewardGovernanceTokenAmount);
                                commit("setDepositAmount", result.tokenAmount);
                                commit("setRewardCoinAmount", result.rewardCoinAmount);
                            }
                        });
                } catch (err) {
                    console.error(err, "Getting Deposit data error");
                }
            }
        },

        // New Deposit
        async newDeposit({ state, commit, dispatch }, value) {
            console.log("Running new deposit...")
            // setting anchor program
            let program = await setup(this.$web3, this.$wallet)

            let GENS = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: (TOKEN_GENS) }
            );
            let burn_addr = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

            let HGEN = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: (TOKEN_HGEN) }
            );
            let gov_addr = HGEN.value[0] ? HGEN.value[0].pubkey.toBase58() : "";

            if (value && Number(value.from) > 0) {
                if (!state.depositKey.deposit) {
                    commit("setLoading", true);
                    try {
                        const data = await depositUtil(
                            this.$wallet,
                            TOKEN_GENS.toBase58(),
                            Number(value.from),
                            burn_addr,
                            gov_addr,
                            this.$web3,
                            program
                        );

                        console.log(data, "getting data")
                        console.log(
                            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
                            "transaction id "
                        );
                        console.log(
                            `${data.txId.substring(0, 14)}...${data.txId.substring(
                                data.txId.length - 14
                            )}`
                        );
                        // pass wait transaction notification
                        this.$accessor.notification.notify({
                            title: "Transaction sent",
                            description: "Waiting for confirmation",
                            type: "confirm",
                            txId: data.txId,
                        });

                        console.log(
                            "this list of notification is ",
                            this.$accessor.notification.notifications.map((val) => val)
                        );

                        // handling the transaciton in the borrow
                        await this.$web3.confirmTransaction(data.txId).then(
                            (res) => {
                                console.log(res, `res`);
                            },
                            (err) => {
                                console.error(err.message, "Err");
                            }
                        );

                        let result;
                        try {
                            result = (await program.account.deposit.fetch(new PublicKey(data.depositAccountPubkey)));
                            console.log(result, "result");
                        } catch (err) {
                            console.error(err)
                        }

                        let backend_data = {
                            owner: result.authority.toBase58(),
                        }

                        if (data && data.depositAccountPubkey) {
                            commit("setDepositKey", data.depositAccountPubkey || "");
                            console.log(data, "newDeposit");
                            await this.$axios
                                .post("/api/deposit/upsert", {
                                    deposit: data.depositAccountPubkey,
                                    amount: Number(value.from),
                                    data: backend_data
                                })
                                .then((res) => {
                                    console.log(res, "newDeposit Backend");
                                })
                                .finally(async () => {
                                    commit("setLoading", false);
                                    this.$accessor.wallet.getBalance();
                                    this.$accessor.wallet.getGENSBalance();
                                    dispatch("getDeposit")
                                    commit("setLoading", false);
                                });

                            this.$accessor.wallet.getBalance();
                            this.$accessor.wallet.getGENSBalance();
                            dispatch("getInfo", null, { root: true });
                        }
                        commit("setLoading", false);
                    } catch (err) {
                        console.log(err, "transaction error")
                        commit("setLoading", false);
                    }
                }
            }
        },

        // Add Deposit
        async addDeposit({ state, commit, dispatch }, value) {

            // setting anchor program
            let program = await setup(this.$web3, this.$wallet)

            let GENS = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: new PublicKey(TOKEN_GENS) }
            );
            let burn_addr = GENS.value[0].pubkey.toBase58();

            let HGEN = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: (TOKEN_HGEN) }
            );
            let gov_addr = HGEN.value[0] ? HGEN.value[0].pubkey.toBase58() : "";

            if (value && Number(value.from) > 0) {
                if (state.depositKey.deposit) {
                    commit("setLoading", true);
                    try {
                        const data = await addDepositUtil(
                            this.$wallet,
                            state.depositKey.deposit,
                            TOKEN_GENS.toBase58(),
                            Number(value.from),
                            burn_addr,
                            gov_addr,
                            this.$web3,
                            program
                        );

                        console.log(
                            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
                            "transaction id "
                        );

                        console.log(
                            `${data.txId.substring(0, 14)}...${data.txId.substring(
                                data.txId.length - 14
                            )}`
                        );

                        // pass wait transaction notification
                        this.$accessor.notification.notify({
                            title: "Transaction sent",
                            description: "Waiting for confirmation",
                            type: "confirm",
                            txId: data.txId,
                        });

                        console.log(
                            "this list of notification is ",
                            this.$accessor.notification.notifications.map((val) => val)
                        );

                        // handling the transaciton in the borrow
                        await this.$web3.confirmTransaction(data.txId).then(
                            (res) => {
                                console.log(res, `res`);
                            },
                            (err) => {
                                console.error(err.message, "Err");
                            }
                        );

                        this.$accessor.wallet.getBalance();
                        this.$accessor.wallet.getGENSBalance();

                        let result;
                        try {
                            result = (await program.account.deposit.fetch(new PublicKey(data.depositAccountPubkey)));
                            console.log(result, "result");
                        } catch (err) {
                            console.error(err)
                        }

                        let backend_data = {
                            owner: result.authority.toBase58(),
                        }

                        await this.$axios.post("/api/deposit/upsert", {
                            deposit: state.depositKey.deposit,
                            amount: Number(value.from),
                            data: backend_data
                        });
                        dispatch("getDeposit")
                        commit("setLoading", false);
                        dispatch("getInfo", null, { root: true });
                    } catch (err) {
                        console.error(err, "Transaction error")
                        commit("setLoading", false);
                    }
                }
            }
        },

        // Close Deposit
        async closeDeposit({ state, commit, dispatch }, value) {
            // setting anchor program
            let program = await setup(this.$web3, this.$wallet)

            let GENS = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: new PublicKey(TOKEN_GENS) }
            );
            let mint_acc_addr = GENS.value[0].pubkey.toBase58();

            if (
                value &&
                Number(value) > 0 &&
                Number(value) <= this.$accessor.pool.depositAmount
            ) {
                if (state.depositKey) {
                    commit("setLoading", true);
                    try {

                        const data = await withdrawUtil(
                            this.$wallet,
                            state.depositKey.deposit,
                            TOKEN_GENS.toBase58(),
                            Number(value),
                            mint_acc_addr,
                            this.$web3,
                            program
                        )

                        console.log(
                            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
                            "transaction id "
                        );

                        console.log(
                            `${data.txId.substring(0, 14)}...${data.txId.substring(
                                data.txId.length - 14
                            )}`
                        );

                        // handling the transaciton in the borrow
                        await this.$web3.confirmTransaction(data.txId).then(
                            (res) => {
                                console.log(res, `res`);
                            },
                            (err) => {
                                console.error(err.message, "Err");
                            }
                        );

                        this.$accessor.wallet.getBalance();
                        this.$accessor.wallet.getGENSBalance();
                        dispatch("getDeposit")
                        commit("setLoading", false);

                        await this.$axios
                            .post("/api/deposit/withdraw", {
                                deposit: state.depositKey.deposit,
                                amount: Number(value),
                            })
                            .then(({ data }) => {
                                console.log(data, "closeDeposit");
                            });


                    } catch (e) {
                        console.log(Error, e);
                        commit("setLoading", false);
                    }
                }
            }
        },
        // claim deposit rewards
        async claimDepositReward({ state, dispatch }, value) {
            console.log("Starting claim")
            // setting anchor program
            let program = await setup(this.$web3, this.$wallet)

            let GENS = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: new PublicKey(TOKEN_GENS) }
            );
            let mint_acc_addr = GENS.value[0].pubkey.toBase58();

            let HGEN = await this.$web3.getParsedTokenAccountsByOwner(
                this.$wallet.publicKey,
                { mint: (TOKEN_HGEN) }
            );
            let gov_addr = HGEN.value[0] ? HGEN.value[0].pubkey.toBase58() : "";

            try {
                console.log("claiming rewards...")
                let data = await claimRewardUtil(
                    this.$wallet,
                    state.depositKey.deposit,
                    TOKEN_GENS,
                    mint_acc_addr,
                    gov_addr,
                    this.$web3,
                    program
                )
                console.log(
                    `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
                    "transaction id "
                );
                console.log(
                    `${data.txId.substring(0, 14)}...${data.txId.substring(
                        data.txId.length - 14
                    )}`
                );

                // handling the transaciton in the borrow
                await this.$web3.confirmTransaction(data.txId).then(
                    (res) => {
                        console.log(res, `res`);
                    },
                    (err) => {
                        console.error(err.message, "Err");
                    }
                );

                this.$accessor.wallet.getBalance();
                this.$accessor.wallet.getGENSBalance();
                dispatch("getDeposit")
            } catch (err) {
                console.error(err)
            }
        },

        // Change the deposit and withdraw tab
        async changeWithdrawAndDeposit({ commit }, value) {
            commit("setDepositOrWithdraw", !value);
        },

        // clear trove state when user logs out of the wallet
        async clearDeposit({ commit }) {
            commit("setDepositKey", "");
            commit("setDepositAmount", 0);
        },

        // on account change for the deposit account
        async onDepositChange({ state, dispatch }) {
            if (state.depositKey.deposit)
                this.$web3.onAccountChange(
                    new PublicKey(state.depositKey.deposit),
                    () => dispatch("pool/getDeposit", null, { root: true }),
                    "confirmed"
                );
        },
    }
);
