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
  publicKey: null,
  wallets: Wallets,
  errorConnect: false,
  loaderConnect: false,
  balance: 0,
  balanceHGEN: 1000,
  balanceGENS: 11
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

    // Get Balanse
    async getBalance ({ commit }) {
      if (this.$web3 && this.$wallet) {
        const data = this.$web3.getBalance(this.$wallet.publicKey)
        //hgen
        // let HGENres = this.$web3.getTokenAccountsByOwner(this.$wallet.publickey, {mint:TOKEN_HGEN});
        // //let HGENBalance = await this.$web3.getTokenAccountBalance(HGENres.value[0].pubkey);   
        
        // HGENres.then(value => {
        //     commit('setBalanceHGEN', Number(this.$web3.getTokenAccountBalance(value[0].pubkey)))
        // })
        // // gens
        // let GENSres = await this.$web3.getTokenAccountsByOwner(this.$wallet.publickey, {mint:TOKEN_GENS});
        // let GENBalance = await this.$web3.getTokenAccountBalance(GENSres.value[0].pubkey);  
        data.then(value => {
          commit('setBalance', (value / 1000000000))
          commit('setBalanceHGEN', 0)
          commit('setBalanceGENS', (value / 1000000000) * 0.000926)
        })
        
      }
    },
    
    // async getHGENBalance({commit}) {
    //     let HGENres = this.$web3.getTokenAccountsByOwner(this.$wallet.publickey, {mint:TOKEN_HGEN});        
    //     HGENres.then(value => {
    //         commit('setBalanceHGEN', Number(this.$web3.getTokenAccountBalance(value[0].pubkey)))
    //     })
    // }
  
  }
)
