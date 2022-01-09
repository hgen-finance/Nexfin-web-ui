// Import Typed
const CoinGecko = require('coingecko-api');
import { OWNER_ACCOUNT_DATA_LAYOUT, DepositLayout } from '@/utils/layout';
import { getAccessorType, mutationTree, actionTree, getterTree } from 'typed-vuex'

// Import Modules
import * as url from './url'
import * as wallet from './wallet'
import * as dashboard from './dashboard'
import * as borrowing from './borrowing'
import * as swap from './swap'
import * as pool from './pool'
import * as risky from './risky'
import * as admin from './admin'

import Vue from 'vue';
// State
export const state = () => ({
  modal: '',
  totalDeposit: 0,
  debtRatio: false,
  gasFee: 0,
  governanceReward: 0,
  solReward: 0,
  tokenReward: 0,
  troveTotal: 0,
  usd: 0,
  lightMode: false,
  logo: false
})

export type RootState = ReturnType<typeof state>

// Getters
export const getters = getterTree(state, {})

// Mutation
export const mutations = mutationTree(state, {
  setModal (state, newValue: string) {
    state.modal = newValue
  },
  setTotalDeposit (state, newValue: number) {
    state.totalDeposit = newValue
  },
  setGasFee (state, newValue: number) {
    state.gasFee = newValue
  },
  setGovernanceReward (state, newValue: number) {
    state.governanceReward = newValue
  },
  setSolReward (state, newValue: number) {
    state.solReward = newValue
  },
  setTokenReward (state, newValue: number) {
    state.tokenReward = newValue
  },
  setTroveTotal (state, newValue: number) {
    state.troveTotal = newValue
  },
  setUsd (state, newValue: number) {
    state.usd = newValue
  },
  setLightMode (state, newValue: boolean) {
    state.lightMode = newValue
  },
  setDebtRatio (state, newValue: boolean) {
    state.debtRatio = newValue
  },
  
})

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    async getInfo ({ commit }) {
      await this.$axios.get('info').then(({ data }) => {

        console.log("the data total deposit was ", data.depositTotal)
        commit('setTotalDeposit', data.depositTotal || 0)
        commit('setGasFee', data.gasFee || 0)
        commit('setGovernanceReward', data.governanceReward || 0)
        commit('setSolReward', data.solReward || 0)
        commit('setTokenReward', data.tokenReward || 0)
        commit('setTroveTotal', data.troveTotal || 0)
        commit('setLightMode', data.totalLiquidationMode || false)
        commit('setDebtRatio', data.debtRatio || 0)
      })
      await this.$axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd').then(({ data }) => {
        if (data.solana) {
          commit('setUsd', data.solana.usd)
        }
      })
    },
    copy(_vuexContext, text: string) {
        ;(this as any)._vm
          .$copyText(text)
          .then(() => {
            this.$notify.success({
              message: 'Copy success',
              description: ''
            })
          })
          .catch(() => {
            this.$notify.error({
              message: 'Copy failed',
              description: ''
            })
          })
      }
  }
)

// Export Module
export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    wallet,
    dashboard,
    borrowing,
    swap,
    pool,
    risky,
    admin,
    url
  }
})
