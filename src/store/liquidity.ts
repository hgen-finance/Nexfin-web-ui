// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { addLiquidityUtil } from "@/utils/addLiquidity";
import { getMintInfo, getAccountInfo } from "@/utils/accounts";
import { LP_TOKENS_HGEN_GENS, LP_TOKENS_HS } from "@/utils/layout";
import { PublicKey } from "@solana/web3.js";

// State
export const state = () => ({
  lpTotalSupply: 0,
  lpTokens: 0,
  loading: false,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
  setLpTotalSupply(state, newValue: number) {
    state.lpTotalSupply = newValue;
  },
  setLpTokens(state, newValue: number) {
    state.lpTokens = newValue;
  },
  setLoading(state, newValue: boolean) {
    state.loading = newValue;
  },
});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // Addliquidity
    async addLiquidity({ commit, dispatch, state }, value) {
      if (value && value.from) {
        console.log("is called");
        await addLiquidityUtil(
          this.$wallet,
          Number(value.from),
          value.mintFrom,
          value.mintTo,
          this.$web3
        );
      }
    },

    async getLPsupplyInfo({ commit }, value) {
      let poolMintInfo;
      // if (value == "GH") {
      //     // get lp supply and pool info for the gens-hgens pool
      //     poolMintInfo = await getMintInfo(this.$web3, LP_TOKENS_HGEN_GENS);
      //     commit("setLpTotalSupply", poolMintInfo.supply.toNumber());
      // }

      // if (value == "HS") {
      // get lp supply and pool info for the hgen-sol pool
      poolMintInfo = await getMintInfo(this.$web3, LP_TOKENS_HS);
      commit("setLpTotalSupply", poolMintInfo.supply.toNumber());
      // }
    },

    async getLpTokens({ state, commit, dispatch }, value) {
      // TODO make it take multiple paramter for mint address instead of single hardcoded value
      let lpToken = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        { mint: LP_TOKENS_HS }
      );

      let result: number = await lpToken.value[0].account.data.parsed.info
        .tokenAmount.uiAmount;
      commit("setLpTokens", result);
    },
    // update the cached balance price
    async updateLpToken({ commit, dispatch }, value) {
      let lp_tokens;
      let tokenATA;

      lp_tokens = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        {
          mint: LP_TOKENS_HS,
        }
      );
      tokenATA = lp_tokens.value[0] ? lp_tokens.value[0].pubkey.toBase58() : "";

      this.$web3.onAccountChange(new PublicKey(tokenATA), () => {
        dispatch("getLPsupplyInfo", value);
        dispatch("getLpTokens");
      });
    },
  }
);
