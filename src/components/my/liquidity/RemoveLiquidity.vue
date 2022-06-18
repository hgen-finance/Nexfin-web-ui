<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100"
  >
    <div class="w-100 fw-600 f-white-200 fd-r jc-sb">
      <span class="fs-8-S fs-7-M" style="align-self: center"
        >Remove Liquidity</span
      >
      <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="changeLiquidityStateToAdd"
      >
        + Add Liquidity
      </span>
      <!-- <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="createSwapPool"
      >
        + Create Pool
      </span> -->
      <!-- <span
        class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
        style="align-self: center"
        v-if="true"
        @click="addToken"
      >
        + Add Tokens
      </span> -->
    </div>
    <div class="w-100 fs-5-S fs-20-XS f-gray-500 pb-1-S pb-5-XS ta-c-XS">
      Your Current Liquidity
    </div>
    <div
      class="fs-7-S fs-20-XS f-white-200 ta-c-XS pb-2-S pb-10-XS ta-c-XS mb-10-XS fw-600"
      data-tour-step="1"
    >
      <span class="fs-7-S fs-25-XS f-mcolor-100 fw-800">{{ getLpTokens }}</span>
      <span class="mr-1"> LP Tokens </span>(<span class="fw-800 f-mcolor-100">
        {{ getPoolShare }}
      </span>
      <span class="fw-600 pr-1">% </span>Pool Share)
    </div>
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS fd-c jc-r"
    >
      <div class="w-100 mt-1-S d-f jc-r">
        <span
          class="fs-4-S fs-20-XS f-mcolor-500 fw-500 ts-3 hv d-n-XS fsh-0 mcolor-500 px-3 py-1 rad-fix-3"
          @click="setMax"
        >
          max
        </span>
      </div>

      <div class="w-100 py-3-S mt-1-S pb-0 fd-r jc-r">
        <div class="p-a-S p-r-XS l-0 b-0 w-fix-60-S w-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyFrom"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
        <input
          class="w-fix-s-10min fs-6-S fs-25-XS fw-600 f-mcolor-300 br-0 oul-n white-100 ta-r"
          placeholder="0"
          v-model="from"
          maxlength="15"
          type="text"
        />
      </div>
    </div>

    <div class="w-100 fd-r py-1-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
        Slippage Tolerance
        <Hint>
          Difference on price of 2 different coins you are using in transaction
          during time it takes to complete transaction.
        </Hint>
      </div>
      <div
        class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
      >
        1 <span class="f-white-200 pl-1">%</span>
      </div>
    </div>
    <div class="w-100 fd-r py-1-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
        Price Impact
        <Hint>
          If the pool is $1,000 and you sell $1 worth, thay will "impact" the
          pool 0.1%.
        </Hint>
      </div>
      <div
        class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
      >
        0.00 <span class="f-white-200 pl-1">%</span>
      </div>
    </div>
    <div class="w-100 pt-6-S pt-20-XS fd-r jc-c">
      <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS">
        <AmButton
          color="mcolor-200"
          bColor="mcolor-100"
          opacityEffect
          full
          @click="reset"
        >
          reset
        </AmButton>
      </div>
      <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS">
        <AmButton
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          @click="confirm"
          :full="true"
        >
          REMOVE LIQUIDITY
        </AmButton>
      </div>
    </div>
    <div
      class="w-100 my-2 fs-6-S f-red-500 fs-25-XS mcolor-800 p-3-S rad-fix-5"
      v-if="alert"
    >
      <span class="f-orange-600">
        {{ alertMessage }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BN from "bn.js";

import Hint from "@/components/Hint";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

import {
  TOKEN_HGEN,
  TOKEN_WSOL_ADDR,
  POOL_AUTHORITY,
  TOKEN_ACC_HGEN_HS,
  TOKEN_ACC_SOL_HS,
  LP_TOKENS_HS,
} from "@/utils/layout";
import { PublicKey } from "@solana/web3.js";

const TOKENS = [
  { label: "HGEN-SOL", value: "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC" },
];

// TODO: add liquidity when choosed hgen/gens or gens/hgen
export default {
  components: {
    Hint,
    Icon,
    Tooltip,
    Button,
    Progress,
    Spin,
    Modal,
  },
  data() {
    return {
      tokens: TOKENS,
      from: null,
      currencyFrom: {
        theme: "default",
        value: TOKENS[0].value,
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      tokenPoolType: "HS",
      tokenAacc: "",
      tokenBacc: "",
      tokenLP: "",
      tokenAMintAddr: "",
      tokenBMintAddr: "",
      poolAccA: "",
      poolAccB: "",
      lpTokenType: "HS",
      alert: false,
      alertMessage: "",
    };
  },
  computed: {
    ...mapState(["wallet", "liquidity", "url"]),
    convertLiquidityToken() {},
    getLpTokens() {
      return this.$accessor.liquidity.lpTokens;
    },
    getPoolShare() {
      this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType);
      let supply = Number(this.$accessor.liquidity.lpTotalSupply / 100) || 0;
      return (
        ((this.$accessor.liquidity.lpTokens / supply) * 100).toFixed(2) || 0
      );
    },
  },
  watch: {
    from(val) {
      if (val > this.$accessor.liquidity.lpTokens) {
        this.alert = true;
        this.alertMessage =
          "Input value exceeds the deposited amount. Please adjust your input value.";
      } else if (val > this.$accessor.liquidity.BalanceLPHS) {
        this.alert = true;
        this.alertMessage =
          "You dont have enough LP tokens for this transaction. Please adjust your input value";
      } else {
        this.alert = false;
      }
    },
  },
  methods: {
    changeLiquidityStateToAdd() {
      this.$accessor.swapPool.changeLiquidityState(true);
    },
    addToken() {
      this.$accessor.swapPool.addToken();
    },
    confirm() {
      if (Number(this.from) > 0) {
        console.log(this.tokenBMintAddr, "value of token B");
        this.$accessor.swapPool.withdrawToken({
          tokenLP: this.tokenLP,
          tokenAacc: this.tokenAacc,
          tokenBacc: this.tokenBacc,
          tokenAMintAddr: this.tokenAMintAddr,
          tokenBMintAddr: this.tokenBMintAddr,
          from: Number(this.from),
          tokenType: this.tokenPoolType,
        });
      }
      this.$accessor.liquidity.updateLpToken(this.lpTokenType);
    },
    createSwapPool() {
      this.$accessor.swapPool.createTokenSwapPool();
    },
    setMax() {
      this.from = this.$accessor.liquidity.lpTokens;
    },
    reset() {
      this.from = null;
    },
  },
  mounted() {
    this.$accessor.wallet.getLPBalance();
    this.$accessor.liquidity.getLpTokens();
    this.$accessor.liquidity.updateLpToken(this.lpTokenType);
    this.tokenLP = LP_TOKENS_HS;
    this.tokenAacc = TOKEN_ACC_HGEN_HS;
    this.tokenBacc = TOKEN_ACC_SOL_HS;
    this.tokenAMintAddr = TOKEN_HGEN;
    this.tokenBMintAddr = new PublicKey(
      "So11111111111111111111111111111111111111112"
    );
  },
};
</script>
