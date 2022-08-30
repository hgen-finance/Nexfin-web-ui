<template>
  <div>
    <div
      class="w-100 br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 fd-c-XS ai-c jc-c mb-5-S mb-10-XS fd-r"
    >
      <div class="fw-600 f-cyan-1500 mr-3-S">$GENS</div>
      <div class="f-white-200 fs-5-S">
        GENS is a stable coin of HGEN platform designed to be pegged to USD.
        <br />
        GENS is main currency for our borrowing and lending protocol.
      </div>
    </div>
    <div
      class="w-100 br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 fd-c ai-c jc-c"
    >
      <div class="w-70 w-100-XS" :class="{ 'op-0': getLoading }">
        <div class="w-100" v-if="getTotalNotifications > 0">
          <NotificaitonsTx />
        </div>
        <div class="w-100 fw-600 f-white-200 fd-r jc-sb jc-c-XS fd-c-XS">
          <span class="fs-8-S fs-7-M" style="align-self: center"
            >Add Liquidity</span
          >
          <span
            class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-red-500 ts-3 hv fsh-0"
            style="align-self: center"
            v-if="true"
            @click="changeLiquidityStateToRemove"
          >
            - Remove Liquidity
          </span>
        </div>
        <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS ta-c-XS">
          Your Current Liquidity
        </div>
        <div
          class="fs-7-S fs-20-XS f-white-200 ta-c-XS pb-2-S pb-10-XS ta-c-XS mb-10-XS fw-600"
          data-tour-step="1"
        >
          <span class="fs-7-S fs-25-XS f-white-200 fw-800">{{
            getLpTokens
          }}</span>
          <span class="mr-1"> LP Tokens </span>(<span
            class="fw-800 f-white-200"
          >
            {{ getPoolShare }}
          </span>
          <span class="fw-600 pr-1">% </span>Pool Share)
        </div>
        <div
          class="w-100 mt-2-S mt-10-XS mb-1 mcolor-1100 rad-fix-10-S rad-fix-10-XS px-4-S py-1-S py-5-XS px-10-XS br-mcolor-800 brs-s-L br-1-L"
        >
          <div
            class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS jc-r fd-r ai-r"
          >
            <div class="mb-2-S">
              <span
                class="fs-4-S fs-20-XS f-cyan-1100 fw-500 ts-3 hv d-n-XS fsh-0 py-1"
                @click="setMax"
                >max</span
              >
            </div>
          </div>

          <div class="w-100 pb-3-S fd-r jc-r">
            <div class="p-a-S p-r-XS l-0 b-0 w-fix-35-S w-35-XS">
              <AmSelectbox
                v-bind:data.sync="currencyFrom"
                :update="true"
                :shadow="false"
                :padding="false"
              />
            </div>
            <input
              class="ta-r w-fix-s-10min fs-7-S fs-25-XS fw-600 f-white-200 br-0 oul-n white-100"
              placeholder="0.00"
              v-model="from"
              maxlength="15"
              type="text"
            />
          </div>
        </div>
        <div class="cside-L cside-M cside-S cside-XS fd-r jc-c mt-8-XS mt-2-S">
          <div
            class="fd-r jc-c f-white-200 ai-c micon-L micon-M micon-S micon-XS br-mcolor-800 brs-s-L br-1-L"
          >
            <Icon type="plus" :rotate="90" />
          </div>
        </div>
        <div
          class="w-100 mt-2-S mt-10-XS mb-1 mcolor-1100 rad-fix-10-S rad-fix-10-XS px-4-S px-10-XS br-mcolor-800 brs-s-L br-1-L"
        >
          <div class="w-100 pb-3-S pt-3-S fd-r jc-r ai-c">
            <div class="p-a-S p-r-XS l-0 b-0 w-fix-35-S w-35-XS">
              <AmSelectbox
                v-bind:data.sync="currencyTo"
                :update="true"
                :shadow="false"
                :padding="false"
              />
            </div>
            <div
              class="w-fix-s-10min w-65-XS fs-6-S fs-25-XS fw-600 br-0 oul-n ta-r"
              :class="{
                'f-cyan-1500': Number(to) > 0,
                'f-white-200': Number(to) === 0,
              }"
            >
              {{ to || "0.00" }}
            </div>
          </div>
        </div>
        <div
          class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
          v-if="currencyFrom.value === tokens[1].value"
        >
          <span> 1 SOL ≈ {{ convertTokenA }} HGEN </span>
          <Icon
            type="sync"
            class="f-white-200 ts-3 hv d-n-XS fsh-0 jc-r px-1-S"
          />
        </div>
        <div
          class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
          v-if="currencyFrom.value === tokens[0].value"
        >
          1 HGEN ≈ {{ convertTokenB }} SOL
          <Icon
            type="sync"
            class="f-white-200 ts-3 hv d-n-XS fsh-0 px-1-S jc-r"
          />
        </div>

        <div class="w-100 fd-r py-1-S py-5-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Slippage Tolerance
            <Hint>
              Difference on price of 2 different coins you are using in
              transaction during time it takes to complete transaction.
            </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-white-200 fd-r ai-c pt-2-XS jc-c-XS"
          >
            1 <span class="f-white-200 pl-1">%</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-S py-5-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Price Impact
            <Hint>
              If the pool is $1,000 and you sell $1 worth, thay will "impact"
              the pool 0.1%.
            </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-white-200 fd-r ai-c pt-2-XS jc-c-XS"
          >
            0.00 <span class="f-white-200 pl-1">%</span>
          </div>
        </div>
        <div class="w-100 pt-6-S pt-20-XS fd-r fd-c-XS jc-c">
          <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS mb-10-XS">
            <AmButton
              color="gradient-1000"
              bColor="gradient-1000"
              opacityEffect
              full
              @click="reset"
              class="rad-fix-10"
            >
              reset
            </AmButton>
          </div>
          <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS">
            <AmButton
              color="gradient-5002"
              bColor="gradient-5002"
              opacityEffect
              @click="confirm"
              :full="true"
              class="rad-fix-10"
            >
              ADD LIQUIDITY
            </AmButton>
          </div>
        </div>
        <div
          class="w-100 my-2 fs-6-S f-red-500 fs-25-XS mcolor-800 p-3-S rad-fix-10"
          v-if="alert"
        >
          <span class="f-orange-600">
            {{ alertMessage }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BN from "bn.js";

import Hint from "@/components/Hint";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";
import { PublicKey } from "@solana/web3.js";

import {
  LP_TOKENS_HS,
  TOKEN_ACC_HGEN_HS,
  TOKEN_ACC_SOL_HS,
} from "@/utils/layout";

const TOKENS = [
  { label: "HGEN", value: "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC" },
  { label: "SOL", value: "So11111111111111111111111111111111111111112" },
];

// TODO: Fetch these value from the pool, currently the values are hardcoded
const CONVERT_HGEN = 1;
const CONVERT_GENS = 1;

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
        items: [TOKENS[0]],
        colorDefault: "mcolor-1100",
        colorFocus: "mcolor-1100",
        colorBackground: "mcolor-1100",
        colorTitle: "white-200",
      },
      to: "0.00",
      currencyTo: {
        theme: "default",
        value: TOKENS[1].value,
        items: [TOKENS[1]],
        colorDefault: "mcolor-1100",
        colorFocus: "mcolor-1100",
        colorBackground: "mcolor-1100",
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
      lpToken: 0,
      alert: false,
      alertMessage: "",
    };
  },
  computed: {
    ...mapState(["wallet", "addLiquidity", "url"]),
    convertTokenB() {
      let tokenA = this.$accessor.swapPool.tokenAmountHgenHS;
      let tokenB = this.$accessor.swapPool.tokenAmountSOLHS;

      if (tokenA > tokenB) return this.trimValue(tokenB / tokenA) || 0;
      else return this.trimValue(tokenA / tokenB) || 0;
    },
    convertTokenA() {
      let tokenA = this.$accessor.swapPool.tokenAmountHgenHS;
      let tokenB = this.$accessor.swapPool.tokenAmountSOLHS;

      if (tokenB > tokenA) return tokenB / tokenA || 0;
      else return tokenA / tokenB || 0;
    },
    tokepool: {
      get: function () {
        let result;
        result = {
          lpToken: LP_TOKENS_HS,
          tokenAaccount: TOKEN_ACC_HGEN_HS,
          tokenBaccount: TOKEN_ACC_SOL_HS,
        };
        return result;
      },
      set: function () {},
    },
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
    currencyFrom: {
      deep: true,
      handler(val) {
        if (val.value === this.currencyTo.value) {
          this.currencyTo.value = val.items.filter(
            (item) => item.value !== val.value
          )[0].value;
        }
        this.convert();
      },
    },
    currencyTo: {
      deep: true,
      handler(val) {
        if (val.value === this.currencyFrom.value) {
          this.currencyFrom.value = val.items.filter(
            (item) => item.value !== val.value
          )[0].value;
        }
        this.convert();
      },
    },
    from(val) {
      if (val) {
        this.from = val.toString().replace(/[^+\d\.]/g, "");
        if (this.from.split(".").length > 2)
          this.from = this.from.replace(/\.(?=[^\.]*$)/, "");
        if (this.from.substr(0, 2) === "00")
          this.from = this.from.substr(1, this.from.length);

        this.convert();
      } else {
        this.to = 0;
      }

      if (
        val > this.$accessor.wallet.balanceHGEN ||
        this.to > this.$accessor.wallet.balance
      ) {
        this.alert = true;
        this.alertMessage =
          "You don't have enough liquditiy for this transaction. Please adjust your input values.";
      } else {
        this.alert = false;
      }
    },
  },
  methods: {
    changeLiquidityStateToRemove() {
      this.$accessor.swapPool.changeLiquidityState(false);
    },
    calculateTokenRatio() {
      let tokenRatio;

      if (this.from < 0) {
        return 0;
      }

      let tokenA = this.$accessor.swapPool.tokenAmountHgenHS;
      let tokenB = this.$accessor.swapPool.tokenAmountSOLHS;

      if (tokenA > tokenB) {
        tokenRatio = tokenA / tokenB;
      } else {
        tokenRatio = tokenB / tokenA;
      }

      return tokenRatio || 0;
    },

    setModalFunc(value) {
      if (this.loaderConnect) {
        this.$accessor.wallet.setLoaderConnect(false);
      } else {
        this.$accessor.setModal(value);
      }
    },
    trimValue(value) {
      let to_value = value.toString();
      to_value = to_value > 0 ? to_value.split(".") : 0;
      if (to_value.length > 1 && to_value[1].length > 9) {
        to_value =
          to_value[0].toLocaleString() + "." + to_value[1].substr(0, 9);
      } else {
        if (to_value.length > 1) {
          to_value = to_value.join(".");
        }
      }
      return to_value;
    },
    async convert() {
      let tokenA = this.$accessor.swapPool.tokenAmountHgenHS;
      let tokenB = this.$accessor.swapPool.tokenAmountSOLHS;

      let to_value = 0;
      if (this.currencyFrom.value === this.tokens[0].value && tokenA > tokenB) {
        to_value = Number(this.from) / this.calculateTokenRatio() || 0;
        this.to = this.trimValue(to_value);
      } else {
        to_value = this.calculateTokenRatio() * Number(this.from) || 0;
        this.to = this.trimValue(to_value);
      }

      this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType);
      let supply = Number(this.$accessor.liquidity.lpTotalSupply) || 0;

      let POOL_TOKEN_AMOUNT = Math.min(
        (this.from * supply) / Number(tokenA),
        (this.to * supply) / Number(tokenB)
      );

      this.to = (POOL_TOKEN_AMOUNT / supply) * tokenB;
      this.to = this.trimValue(this.to);
    },
    addToken() {
      this.$accessor.swapPool.addToken();
    },
    confirm() {
      if (Number(this.from) > 0) {
        this.$accessor.swapPool.depositAllToken({
          tokenLP: this.tokenLP,
          tokenAacc: this.tokenAacc,
          tokenBacc: this.tokenBacc,
          tokenAMintAddr: this.tokenAMintAddr,
          tokenBMintAddr: this.tokenBMintAddr,
          from: Number(this.from),
          to: Number(this.to),
          tokenType: this.tokenPoolType,
        });
      }
      this.$accessor.liquidity.updateLpToken(this.lpTokenType);
    },
    createSwapPool() {
      this.$accessor.swapPool.createTokenSwapPool();
    },

    setMax() {
      if (this.$accessor.wallet.balanceHGEN > 0) {
        this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType);
        let supply = Number(this.$accessor.liquidity.lpTotalSupply / 100) || 0;
        let tokenA = this.$accessor.swapPool.tokenAmountHgenHS;
        let tokenB = this.$accessor.swapPool.tokenAmountSOLHS;

        let min_lp_token = Math.min(
          (this.$accessor.wallet.balanceHGEN / tokenA) * supply,
          ((this.$accessor.wallet.balance - 0.01) / tokenB) * supply
        );

        let hgen = (min_lp_token / supply) * tokenA;
        hgen = hgen.toString().split(".");
        if (hgen.length > 1 && hgen[1].length > 2) {
          hgen = hgen[0] + "." + hgen[1].substr(0, 2);
          this.from = hgen;
        } else {
          if (hgen.length > 1) {
            this.from = hgen[0] + "." + hgen[1];
          } else {
            this.from = hgen;
          }
        }
        let sol = (min_lp_token / supply) * tokenB;
        sol = sol.toString().split(".");
        if (sol.length > 1 && sol[1].length > 8) {
          sol = sol[0] + "." + sol[1].substr(0, 8);
          this.to = sol;
        } else {
          if (sol.length > 1) {
            this.to = sol[0] + "." + sol[1];
          }
          this.to = sol;
        }
      }
    },
    reset() {
      this.to = null;
      this.from = null;
    },
  },
  mounted() {
    this.tokenLP = LP_TOKENS_HS;
    this.tokenAacc = TOKEN_ACC_HGEN_HS;
    this.tokenBacc = TOKEN_ACC_SOL_HS;
    this.tokenAMintAddr = new PublicKey(TOKENS[0].value);
    this.tokenBMintAddr = new PublicKey(TOKENS[1].value);
    this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType); // TODO: make it refresh after 30 secs
    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();
    this.$accessor.liquidity.getLpTokens();
    this.$accessor.liquidity.updateLpToken(this.lpTokenType);
  },
};
</script>
