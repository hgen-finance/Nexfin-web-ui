// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { faucetUtil } from "@/utils/solFaucet";

// State
export const state = () => ({});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        async addSol() {
            await faucetUtil(this.$wallet, this.$web3)
            this.$accessor.wallet.getBalance();
        },
    }
);
