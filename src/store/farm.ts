import {
    FarmingLayout,
    FARMING_ACCOUNT_DATA_LAYOUT,
    INSTRUCTION_LAYOUT,
    InstructionLayout,
} from "@/utils/layout";

import {
    Account,
    PublicKey,
    SystemProgram,
    Connection,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";

const programId = new PublicKey("3PtvnRuzC68zrDQoRsoKVQoVvhbVF7fTxeYzLF6mN3EE");

// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { farmUtil } from "@/utils/farm";

// State
export const state = () => ({
    total: 0,
    startDate: 0,
    endDate: 0,
    depositedLp: 0,
    depositedSol: 0,
    depositedHgen: 0,
    dayLength: 0,
    dayLeft: 0,
    hasFarm: false,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setTotal(state, newValue: any) {
        state.total = newValue;
    },
    setStartDate(state, newValue: any) {
        state.startDate = newValue;
    },
    setEndDate(state, newValue: any) {
        state.endDate = newValue;
    },
    setDepositedSol(state, newValue: any) {
        state.depositedSol = newValue;
    },
    setDepositedHgen(state, newValue: any) {
        state.depositedHgen = newValue;
    },
    setDayLength(state, newValue: any) {
        state.dayLength = newValue;
    },
    setDayLeft(state, newValue: any) {
        state.dayLeft = newValue;
    },
    setDepositedLp(state, newValue: any) {
        state.depositedLp = newValue;
    },
    setHasFarm(state, newValue: boolean) {
        state.hasFarm = newValue;
    }
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        async getTotalAmount({ commit }, value) {
            let total = 0;
            let accounts = await this.$web3.getProgramAccounts(programId);
            for (let i = 0; i < accounts.length; i++) {
                let accountInfo = await this.$web3.getAccountInfo(
                    accounts[i].pubkey
                );
                console.log(accountInfo.data);
                total += parseInt(
                    Buffer.from(
                        (
                            FARMING_ACCOUNT_DATA_LAYOUT.decode(
                                accountInfo.data
                            ) as FarmingLayout
                        ).depositedSol
                    ).toString("utf8")
                );
            }
            commit("setTotal", total);
        },

        async farmState({ commit }, value) {
            commit("setHasFarm", value);
        },

        async clearFarmDetails({ commit }) {
            commit("setStartDate", null);
            commit("setEndDate", null);
            commit("setDepositedLp", 0);
            commit("setDepositedSol", 0);
            commit("setDepositedHgen", 0);
            commit("setDayLength", 0);
            commit("setDayLeft", 0);
        },

        async onFarmingAccountChange({ commit, dispatch }, value) {
            let farming_account = await PublicKey.createWithSeed(
                this.$wallet.publicKey,
                "computer",
                programId
            );
            console.log(farming_account.toBase58(), "waiting ..............................")
            this.$web3.onProgramAccountChange(
                (farming_account),
                () => {
                    dispatch("getFarmingAccount")
                },
            );
        },


        async getFarmingAccount({ commit }, value) {
            let farming_account = await PublicKey.createWithSeed(
                this.$wallet.publicKey,
                "computer",
                programId
            );
            let accountInfo = await this.$web3.getAccountInfo(farming_account);

            if (accountInfo == null) return;
            let data = FARMING_ACCOUNT_DATA_LAYOUT.decode(
                accountInfo.data
            ) as FarmingLayout;

            let startDate = Buffer.from(data.startDate).toString("utf8");
            let endDate = Buffer.from(data.endDate).toString("utf8");
            let depositedLp = parseInt(
                Buffer.from(data.depositedLp).toString("utf8")
            );
            let depositedSol = parseInt(
                Buffer.from(data.depositedSol).toString("utf8")
            );
            let depositedHgen = parseInt(
                Buffer.from(data.depositedHgen).toString("utf8")
            );
            let dayLength = parseInt(Buffer.from(data.dayLength).toString("utf8"));
            let dayLeft = parseInt(Buffer.from(data.dayLeft).toString("utf8"));
            commit("setStartDate", startDate);
            commit("setEndDate", endDate);
            commit("setDepositedLp", depositedLp);
            commit("setDepositedSol", depositedSol);
            commit("setDepositedHgen", depositedHgen);
            commit("setDayLength", dayLength);
            commit("setDayLeft", dayLeft);
        }

        //TODO for withdraw farming dispatch the get farming info first
        // TODO clear all the info after the withdraw
    }
);