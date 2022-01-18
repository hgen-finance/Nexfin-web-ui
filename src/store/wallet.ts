// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import
import { PublicKey } from "@solana/web3.js";
import { Wallets, WalletInfo } from "../utils/wallets";
import { Result } from "ant-design-vue";

export const TOKEN_GENS = new PublicKey(
  "7d3U17g4WEZkVGjRVVQchrgEaoFAuuui2xmEGCzmtUGt"
);
export const TOKEN_HGEN = new PublicKey(
  "6UeYcgjzpij4wGhVShJQsoCoi3nk2bPvz4v4Dz4cmMVv"
);
const LAMPORTS = 1000000000;

// State
export const state = () => ({
  publicKey: "",
  wallets: Wallets,
  errorConnect: false,
  loaderConnect: false,
  balance: 0,
  balanceHGEN: 0,
  balanceGENS: 0,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
  setPublicKey(state, newValue: string) {
    state.publicKey = newValue;
  },

  setErrorConnect(state, newValue: boolean) {
    state.errorConnect = newValue;
  },

  setLoaderConnect(state, newValue: boolean) {
    state.loaderConnect = newValue;
  },

  setBalance(state, newValue: number | null) {
    state.balance = newValue;
  },

  setBalanceHGEN(state, newValue: number | null) {
    state.balanceHGEN = newValue;
  },

  setBalanceGENS(state, newValue: number | null) {
    state.balanceGENS = newValue;
  },
});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // Connection
    async connectWallet({ commit }, wallet: WalletInfo) {
      commit("setLoaderConnect", true);
      // I have set it for testnet, need to change for main net
      const adapter = await wallet.getAdapter({
        providerUrl: wallet.url,
        endpoint: "https://api.testnet.solana.com",
      });
      if (!adapter || !this.$web3) {
        this.app.$accessor.setModal("connectError");
        return;
      }
      this.$wallet = adapter;
      adapter.on("connect", () => {
        if (adapter.publicKey) {
          commit("setPublicKey", adapter.publicKey.toBase58());
          this.app.$accessor.setModal("");
          this.$router.push("/my");
        }
        commit("setLoaderConnect", false);
      });

      try {
        adapter.connect();
      } catch (error) {
        console.log(error);
        commit("setErrorConnect", true);
        commit("setLoaderConnect", false);
      }
    },

    // Disconnection
    logout({ commit }) {
      if (this.$wallet) {
        this.$wallet.disconnect();
        this.$wallet = null;
      }
      commit("setPublicKey", "");
      this.$router.push("/");
    },

    // update the cached balance price
    async updateBalance({ commit }) {
      if (this.$wallet) {
        // let GENS = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {mint: new PublicKey(TOKEN_GENS)});
        // if (GENS.value[0]){
        //     let gensAccount =GENS.value[0].pubkey;

        //     this.$web3.onAccountChange(gensAccount, async (val)=>{
        //         let gensAmount = GENS.value[0] ? GENS.value[0].account.data.parsed.info.tokenAmount.uiAmountString : 0;
        //         commit('setBalanceGENS', Number(gensAmount))
        //     })
        // }
        this.$web3.onAccountChange(
          this.$wallet.publicKey,
          async function (val) {
            commit("setBalance", val.lamports / LAMPORTS);
          }
        );
      }
    },

    //update the cached balance for gens
    async updateGensBalance({ commit }) {},

    // Get Balance for sols
    async getBalance({ commit }) {
      console.log("is beign called");
      if (this.$web3 && this.$wallet) {
        const data = this.$web3.getBalance(this.$wallet.publicKey);
        data.then((value) => {
          commit("setBalance", value / LAMPORTS);
        });
      }
    },

    // getting balance from the hgens from the wallet
    async getHGENBalance({ commit }) {
      if (this.$wallet) {
        let HGEN = await this.$web3.getParsedTokenAccountsByOwner(
          this.$wallet.publicKey,
          { mint: new PublicKey(TOKEN_HGEN) }
        );
        let myTokenAmount = HGEN.value[0]
          ? HGEN.value[0].account.data.parsed.info.tokenAmount.uiAmountString
          : 0;
        commit("setBalanceHGEN", Number(myTokenAmount));
      }
    },

    //getting balance for gens from the wallet
    async getGENSBalance({ commit }) {
      if (this.$wallet) {
        let GENS = await this.$web3.getParsedTokenAccountsByOwner(
          this.$wallet.publicKey,
          { mint: new PublicKey(TOKEN_GENS) }
        );
        let myTokenAmount = GENS.value[0]
          ? GENS.value[0].account.data.parsed.info.tokenAmount.uiAmountString
          : 0;
        commit("setBalanceGENS", Number(myTokenAmount));
      }
    },
  }
);
