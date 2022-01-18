// Import Typed
import {
  getAccessorType,
  mutationTree,
  actionTree,
  getterTree,
} from "typed-vuex";

// State
export const state = () => ({
  depositList: [],
  depositTotal: 0,
});

export type RootState = ReturnType<typeof state>;

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
  addDepositList(state, newValue = []) {
    state.depositList = [...state.depositList, ...newValue];
  },
  setDepositList(state, newValue = []) {
    state.depositList = newValue;
  },
  setDepositTotal(state, newValue: number) {
    state.depositTotal = newValue;
  },
});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // Send Warning Message
    async sendWarning({}, value) {
      await this.$axios
        .post("/notification/send", {
          subject: "Warning Message",
          body: value.text,
          debitRatio: value.ratio,
        })
        .then((res) => {
          console.log(res, "Subscribe Warning");
        });
    },

    // Send Liquidation Message
    async sendLiquidation({}, value) {
      await this.$axios
        .post("/notification/send", {
          subject: "Liquidation Message",
          body: value.text,
          debitRatio: value.ratio,
        })
        .then((res) => {
          console.log(res, "Subscribe Liquidation");
        });
    },

    // Get Deposit List
    async getDepositList({ commit }, value) {
      if (value.clear) {
        commit("setDepositList", []);
      }
      let params = "?page=" + value.page;
      if (value.search) {
        params += "&query=" + value.search;
      }
      if (value.sort) {
        params += "&sort_field=" + value.sort + "&sort_direction=asc";
      }
      await this.$axios.get("deposit/list" + params).then(({ data }) => {
        commit("setDepositTotal", data.total_count || 0);
        if (value.clear) {
          commit("setDepositList", data.entities || []);
        } else {
          commit("addDepositList", data.entities || []);
        }
      });
    },
  }
);
