// Import Typed
import { getterTree, mutationTree, actionTree } from 'typed-vuex'


// State
export const state = () => ({
  troveList: [],
  troveTotal: 0,
  loading: false,
})

// Getters
export const getters = getterTree(state, {
  troveList: (state) => state.troveList,
})

// Mutation
export const mutations = mutationTree(state, {
  adjustTroveList(state, newValue = []) {
    state.troveList = [ ...state.troveList, ...newValue ]
  },
  adjustTroveListClear(state, newValue = []) {
    state.troveList = newValue
  },
  setTroveTotal(state, newValue: number) {
    state.troveTotal = newValue
  },
  setLoading (state, newValue: boolean) {
    state.loading = newValue
  },
})

// Actions
export const actions = actionTree(
  { state, getters, mutations }, {
    async getTroveListAction({ commit }, value) {
      if (value.clear) {
        commit('adjustTroveListClear', [])
      }
      let params = '?page=' + value.page
      if (value.search) {
        params += '&query=' + value.search
      }
      if (value.sort) {
        params += '&sort_field=' + value.sort + '&sort_direction=desc'
      }
      commit('setLoading', true)
      console.log("the loading status atm is ", this.$accessor.loading)
      await this.$axios.get('trove/list' + params).then(({ data }) => {        
        commit('setTroveTotal', data.total_count || 0)
        commit('setLoading', false);
        if (value.clear) {
          commit('adjustTroveListClear', data.entities || [])
        } else {
          commit('adjustTroveList', data.entities || [])
        }
      })
    },
    // Deposit
    async closeTroveUser ({ state, commit, dispatch }, value) {
      if (value) {
        await this.$axios.post('trove/liquidate', {trove: value.trove.troveAccountPubkey}).then(() => {
          this.$accessor.wallet.getBalance()
          const newArr = state.troveList.filter(item => item)
          newArr.splice(value.index, 1)
          commit('adjustTroveListClear', newArr || [])
        })
      }
    },
  }
)
