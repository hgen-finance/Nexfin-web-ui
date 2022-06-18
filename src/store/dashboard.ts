// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
// import { claimDepositRewardUtil } from '@/utils/claimDepositReward'

// State
export const state = () => ({
    isBorrow: false,
    loading: false,
    logo: false,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setBorrow(state, newValue: boolean) {
        state.isBorrow = newValue;
    },
    setLoading(state, newValue: boolean) {
        state.loading = newValue;
    },
    setLogo(state, newValue: boolean) {
        state.logo = newValue;
    },
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // Deposit
        async claim({ commit, state }) {
            if (this.$accessor.pool.depositKey) {
                commit("setLoading", true);
                await this.$axios
                    .post("/api/deposit/claim", {
                        deposit: this.$accessor.pool.depositKey.deposit,
                    })
                    .then((res) => {
                        console.log(res, "claimDeposit Backend");
                    })
                    .finally(() => {
                        commit("setLoading", false);
                    });
                this.$accessor.wallet.getBalance();
            }
        },

        // Change the deposit and withdraw tab
        async changeLogoVis({ state, commit }, value) {
            commit("setLogo", value);
        },
    }
);
