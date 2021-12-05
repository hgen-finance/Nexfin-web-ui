// Import Typed
import { getterTree, mutationTree, actionTree } from 'typed-vuex'

// Import
import { PublicKey } from '@solana/web3.js';
import { Wallets, WalletInfo } from '../utils/wallets'
import { Result } from 'ant-design-vue';

export const TOKEN_GENS = new PublicKey('2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe')
export const TOKEN_HGEN = new PublicKey('97MxeDbRgc6vYP1Sty2XdPXks3QhMD97EVYJ9pP4XcR3')
// State
export const state = () => ({
  publicKey: "",
  wallets: Wallets,
  errorConnect: false,
  loaderConnect: false,
  balance: 0,
  balanceHGEN: 0,
  balanceGENS: 0
})

// Getters
export const getters = getterTree(state, {})

// Mutation
export const mutations = mutationTree(state, {

  setPublicKey (state, newValue: string) {
    state.publicKey = newValue
  },

  setErrorConnect (state, newValue: boolean) {
    state.errorConnect = newValue
  },

  setLoaderConnect (state, newValue: boolean) {
    state.loaderConnect = newValue
  },

  setBalance (state, newValue: number | null) {
    state.balance = newValue
  },

  setBalanceHGEN (state, newValue: number | null) {
    state.balanceHGEN = newValue
  },

  setBalanceGENS (state, newValue: number | null) {
    state.balanceGENS = newValue
  }

})

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // Connection
    async connectWallet ({ commit }, wallet: WalletInfo) {
      commit('setLoaderConnect', true)
        // I have set it for devnet, need to change for main net
      const adapter = await wallet.getAdapter({ providerUrl: wallet.url, endpoint: 'https://api.devnet.solana.com' })
      if (!adapter || !this.$web3) {
        this.app.$accessor.setModal('connectError')
        return
      }
      this.$wallet = adapter
      adapter.on('connect', () => {
        if (adapter.publicKey) {
          commit('setPublicKey', adapter.publicKey.toBase58())
          this.app.$accessor.setModal('')
          this.$router.push('/my')
        }
        commit('setLoaderConnect', false)
      })
      
      try {
        adapter.connect()
      } catch (error) {
        console.log(error)
        commit('setErrorConnect', true)
        commit('setLoaderConnect', false)
      }
    },

    // Disconnection
    logout ({ commit }) {
      if (this.$wallet) {
        this.$wallet.disconnect()
        this.$wallet = null
      }
      commit('setPublicKey', '')
      this.$router.push('/')
    },

    // Get Balance for sols
    async getBalance ({ commit }) {
      if (this.$web3 && this.$wallet) {
        const data = this.$web3.getBalance(this.$wallet.publicKey)
        data.then(value => {
          commit('setBalance', (value / 1000000000))
        })
        
      }
    },
    
    // getting balance from the hgens from the wallet
    async getHGENBalance({commit}) {
        let HGEN = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {mint: new PublicKey(TOKEN_HGEN)});   
        let myTokenAmount = HGEN.value[0].account.data.parsed.info.tokenAmount.uiAmountString
        commit('setBalanceHGEN', Number(myTokenAmount))
    },

    //getting balance for gens from the wallet
    async getGENSBalance({commit}) {
        let GENS = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {mint: new PublicKey(TOKEN_GENS)});   
        console.log("info about gens in wallet ", GENS.value[0].pubkey.toBase58())
        let myTokenAmount = GENS.value[0].account.data.parsed.info.tokenAmount.uiAmountString
        commit('setBalanceGENS', Number(myTokenAmount))
    }
  
  }
)
