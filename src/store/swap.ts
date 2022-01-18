// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { swapUtil } from "@/utils/swap";

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
    // Swap
    async swap({ commit }, value) {
      if (value && value.from) {
        await swapUtil(
          this.$wallet,
          Number(value.from),
          value.mintFrom,
          value.mintTo,
          this.$web3
        );
      }
    },
  }
);
