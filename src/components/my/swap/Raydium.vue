<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100"
  >
    <div class="w-100" :class="{ 'op-0': getLoading }">
      <div class="w-100 fw-600 f-white-200 fd-r jc-sb">
        <span v-if="raySwap" class="fs-8-S fs-7-M" style="align-self: center"
          >Raydium Swap</span
        >
        <span v-if="!raySwap" class="fs-8-S fs-7-M" style="align-self: center"
          >Swap</span
        >
        <div class="w-100" v-if="getTotalNotifications > 0">
          <NotificaitonsTx />
        </div>
        <div class="fd-r buttons">
          <!-- <Tooltip placement="bottomright">
          <Progress
            type="circle"
            :width="20"
            :stroke-width="10"
            :percent="50"
            :show-info="false"
          />
        </Tooltip> -->
          <Tooltip placement="bottomRight">
            <!-- <template slot="title">
            <div
              class="shadow-purple-100 p-2-S p-10-XS f-white-200 fs-5-S fs-20-XS mcolor-500 rad-fix-3 z-15"
            >
              <p>Program Addresses (DO NOT DEPOSIT)</p>
              <div class="swap-info">
                <div v-if="fromCoin || true" class="info">
                  <div class="symbol">{{ currencyFrom.label }}</div>
                  <div class="address">
                    {{ currencyFrom.value.substr(0, 14) }}
                    ...
                    {{
                      currencyFrom.value.substr(
                        currencyFrom.value.length - 14,
                        14
                      )
                    }}
                  </div>
                  <div class="action">
                    <Icon
                      type="copy"
                      @click="$accessor.copy(currencyFrom.value)"
                    />
                    <a
                      :href="`${url.explorer}/token/${currencyFrom.value}`"
                      target="_blank"
                    >
                      <Icon type="link" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </template> -->
          </Tooltip>

          <!-- <Tooltip>
          <Icon
            type="search"
            :style="{ width: '40px', height: '40px' }"
            class="fd-r jc-c ai-c"
          />
        </Tooltip> -->
          <!-- <Tooltip>
            <Icon
              type="switcher"
              @click="toggleSwap"
              :style="{ width: '40px', height: '40px' }"
              class="fd-r jc-c ai-c"
            />
          </Tooltip> -->
        </div>
      </div>
      <div
        class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS fd-r"
      >
        <div class="w-100 pb-0 fd-r jc-r ai-c">
          <div class="p-a-S p-r-XS l-0 t-15 w-fix-35-S w-35-XS">
            <AmSelectbox
              v-bind:data.sync="currencyFrom"
              :update="true"
              :shadow="false"
              :padding="false"
            />
          </div>

          <!-- <span
              class="p-a-S p-r-XS r-0 t-0 w-fix-35-S w-35-XS pb-1 f-white-200 py-3 ta-r"
              >Bal.
              <span class="f-green-500" v-if="currencyFrom.name == 'GENS'">
                {{ getBalanceGENS || 0 }}
              </span>
              <span class="f-green-500" v-if="currencyFrom.name == 'HGEN'">
                {{ getBalanceHGEN || 0 }}
              </span>
              <span class="f-green-500" v-if="currencyFrom.name == 'SOL'">
                {{ getBalance || 0 }}
              </span>
            </span> -->
        </div>
        <div
          class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-1-S pt-10-XS fd-c"
        >
          <div class="jc-r mt-1-S mb-2-S d-f jc-r">
            <span
              class="fs-4-S fs-20-XS f-mcolor-500 fw-500 ts-3 hv d-n-XS fsh-0 mcolor-500 px-3 py-1 rad-fix-3"
              @click="setMax"
              >max</span
            >
          </div>

          <input
            class="w-fix-s-10min fs-7-S fs-25-XS fw-600 f-mcolor-300 br-0 oul-n white-100 ta-r"
            placeholder="0.00"
            v-model="from"
            maxlength="15"
            type="text"
          />
        </div>
      </div>
      <div class="cside-L cside-M cside-S cside-XS fd-r jc-c mt-8-XS mt-2-S">
        <div
          class="fd-r jc-c f-white-200 ai-c micon-L micon-M micon-S micon-XS"
        >
          <!-- <Icon type="swap" :rotate="90" @click="toggleToken" /> -->
          <Icon type="arrow-down" :rotate="0" @click="toggleToken" />
        </div>
      </div>
      <div
        class="w-100 mt-2-S mt-10-XS mb-1 mcolor-700 rad-fix-2-S rad-fix-15-XS px-4-S px-10-XS fd-r"
      >
        <div class="w-100 pb-0 fd-r jc-r">
          <div class="p-a-S p-r-XS l-0 t-15 w-fix-35-S w-35-XS">
            <AmSelectbox
              v-bind:data.sync="currencyTo"
              :update="true"
              :shadow="false"
              :padding="false"
            />
          </div>
        </div>
        <div
          class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-1-S pt-10-XS ai-c"
        >
          <span
            class="fs-4-S fs-20-XS f-mcolor-500 fw-500 ts-3 f-white-200 pl-1 py-1 rad-fix-3 d-f jc-r mb-2-S"
            >est.</span
          >

          <div
            class="w-fix-s-10min fs-6-S fs-25-XS fw-600 br-0 oul-n ta-r"
            :class="{
              'f-mcolor-300': Number(to) > 0,
              'f-gray-800': Number(to) === 0,
            }"
          >
            {{ to }}
          </div>
        </div>
      </div>
      <div
        class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
        v-if="currencyFrom.value"
      >
        1 {{ currencyFrom.name }} ≈ {{ getPrice }} {{ currencyTo.name }}
      </div>
      <!-- <div
      class="w-100 pt-2-S pt-15-XS ta-c fs-5-S fs-20-XS fw-500 f-white-200 pb-2-S pb-15-XS"
      v-if="currencyFrom.value === tokens[1].value"
    >
      1 HGEN ≈ {{ convertSOL }} GENS
    </div> -->
      <div class="w-100 fd-r py-1-S py-5-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Slippage Tolerance
          <Hint>
            The difference between the price at the confirmation and the actual
            transaction that users are willing to accept during the swapping.
          </Hint>
        </div>
        <div
          class="w-15 fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 ai-c pt-2-XS jc-c-XS"
        >
          <div class="mcolor-700 rad-fix-2 fd-r ai-c py-1">
            <input
              class="w-fix-s-10min fs-5-S fs-25-XS fw-600 f-mcolor-300 br-0 oul-n white-100 pl-2"
              placeholder="0.00"
              v-model="slippageTolerance"
              maxlength="15"
              type="text"
            />
            <span class="f-white-200 fw-400 pl-1 pr-2 fs-4-S fs-25-X">%</span>
          </div>
        </div>
      </div>
      <div class="w-100 fd-r py-1-S py-5-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Minimum Received
          <Hint>
            Your transaction will be reverted if there is a large, unfavorable
            price movement before it is confirmed.
          </Hint>
        </div>
        <div
          class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          v-if="currencyTo.value === tokens[0].value"
        >
          {{ slippagePrice.toFixed(2) }}
          <span class="f-white-200 pl-1">GENS</span>
        </div>
        <div
          class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          v-if="currencyTo.value === tokens[1].value"
        >
          {{ slippagePrice.toFixed(2) }}
          <span class="f-white-200 pl-1">HGEN</span>
        </div>
        <div
          class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          v-if="currencyTo.value === tokens[2].value"
        >
          {{ slippagePrice.toFixed(2) }}
          <span class="f-white-200 pl-1">SOL</span>
        </div>
      </div>
      <div class="w-100 fd-r py-1-S py-5-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Price Impact
          <Hint>
            Estimated % difference in price at the swapping compared to the
            displayed price.
          </Hint>
        </div>
        <div
          class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
        >
          <span class="px-1" v-if="priceImpact <= 0.1"> > </span>
          {{ priceImpact }} <span class="f-white-200 pl-1">%</span>
        </div>
      </div>
      <div class="w-100 pt-6-S pt-20-XS fd-r jc-c">
        <AmButton
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          @click="confirm"
          :full="true"
          v-if="raySwap"
        >
          RAYDIUM SWAP
        </AmButton>
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
            v-if="!raySwap"
          >
            SWAP
          </AmButton>
        </div>
      </div>
    </div>
    <div class="w-100 h-100 p-a l-0 t-0 fd-r ai-c jc-c" v-if="getLoading">
      <Loading />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import BN from "bn.js";

import Hint from "@/components/Hint";
import Loading from "@/components/Loading";
import NotificaitonsTx from "@/components/NotificationTx.vue";

import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";
import {
  TOKEN_A_MINT_ADDR,
  TOKEN_B_MINT_ADDR,
  TOKEN_ACC_A,
  TOKEN_ACC_B,
  LP_TOKENS_HGEN_GENS,
  LP_TOKENS_GS,
  LP_TOKENS_HS,
  TOKEN_ACC_GENS_GS,
  TOKEN_ACC_HGEN_HS,
  TOKEN_ACC_SOL_GS,
  TOKEN_ACC_SOL_HS,
  LP_TOOKS_HS_POOL_ACC,
  TOKEN_GENS,
  WSOL_ADDR,
} from "@/utils/layout";

const POOL_TOKENS = [
  {
    label: "GENS",
    value: "2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8",
    mintAddr: TOKEN_A_MINT_ADDR,
    tokenAccgh: TOKEN_ACC_A,
    tokenAccgs: TOKEN_ACC_GENS_GS,
  },
  {
    label: "HGEN",
    value: "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC",
    mintAddr: TOKEN_B_MINT_ADDR,
    tokenAccgh: TOKEN_ACC_B,
    tokenAcchs: TOKEN_ACC_HGEN_HS,
  },
  {
    label: "SOL",
    value: "So11111111111111111111111111111111111111112",
    mintAddr: "So11111111111111111111111111111111111111112",
    tokenAccgs: TOKEN_ACC_SOL_GS,
    tokenAcchs: TOKEN_ACC_SOL_HS,
  },
];

export default {
  components: {
    NotificaitonsTx,
    Loading,
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
      tokenPrice: 0,
      priceImpact: 0,
      slippageTolerance: 0.5,
      slippagePrice: 0,
      raySwap: false,
      tokens: POOL_TOKENS,
      from: null,
      currencyFrom: {
        theme: "default",
        value: "",
        items: POOL_TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
        name: "GENS",
        balance: 0,
      },
      to: "0.00",
      currencyTo: {
        theme: "default",
        value: "",
        items: POOL_TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
        name: "HGEN",
      },
      tokenPoolType: "GS",
      tokenAacc: "",
      tokenBacc: "",
      tokenLP: "",
      tokenAMintAddr: "",
      tokenBMintAddr: "",
      poolAccA: "",
      poolAccB: "",
    };
  },
  computed: {
    ...mapState(["wallet", "swap", "url"]),
    getLoading() {
      console.log(this.$accessor.swapPool.loading);
      return this.$accessor.swapPool.loading;
    },

    getTotalNotifications() {
      return this.$accessor.notification.totalNotificaitons;
    },

    getPrice() {
      let tokenPrice = 0;
      if (this.tokenPoolType == "GH") {
        let tokenA = new BN(this.$accessor.swapPool.tokenAmountA).mul(
          new BN(100)
        );
        let tokenB = new BN(this.$accessor.swapPool.tokenAmountB).mul(
          new BN(100)
        );

        if (this.currencyFrom.value == POOL_TOKENS[0].value) {
          let price_before_add = Number(tokenB) / Number(tokenA);
          tokenPrice = Number(price_before_add).toString().split(".");
          if (tokenPrice[1] > 0) {
            tokenPrice = tokenPrice[0] + "." + tokenPrice[1].substr(0, 3);
          } else {
            tokenPrice = tokenPrice[0];
          }
        }
        if (this.currencyFrom.value == POOL_TOKENS[1].value) {
          let price_before_add = Number(tokenA) / Number(tokenB);
          tokenPrice = Number(price_before_add).toString().split(".");
          if (tokenPrice[1] > 0) {
            tokenPrice = tokenPrice[0] + "." + tokenPrice[1].substr(0, 3);
          } else {
            tokenPrice = tokenPrice[0];
          }
        }
      }

      if (this.tokenPoolType == "GS") {
        let tokenA = new BN(this.$accessor.swapPool.tokenAmountGensGS);
        let tokenB = new BN(this.$accessor.swapPool.tokenAmountSOLGS);

        if (this.currencyFrom.value == POOL_TOKENS[0].value) {
          let price_before_add = Number(tokenB) / Number(tokenA);
          console.log(price_before_add, "testing for gs");
          tokenPrice = Number(price_before_add).toString().split(".");
          if (tokenPrice[1] > 0) {
            tokenPrice = tokenPrice[0] + "." + tokenPrice[1].substr(0, 3);
          } else {
            tokenPrice = tokenPrice[0];
          }
        }
        if (this.currencyFrom.value == POOL_TOKENS[2].value) {
          let price_before_add = Number(tokenA) / Number(tokenB);
          tokenPrice = Number(price_before_add).toString().split(".");
          if (tokenPrice[1] > 0) {
            tokenPrice = tokenPrice[0] + "." + tokenPrice[1].substr(0, 3);
          } else {
            tokenPrice = tokenPrice[0];
          }
        }
      }

      if (this.tokenPoolType == "HS") {
        let tokenA = new BN(this.$accessor.swapPool.tokenAmountHgenHS);
        let tokenB = new BN(this.$accessor.swapPool.tokenAmountSOLHS);

        if (this.currencyFrom.value == POOL_TOKENS[1].value) {
          let price_before_add = Number(tokenB) / Number(tokenA);
          tokenPrice = Number(price_before_add).toString().split(".");
          console.log(tokenPrice, "hgensol");
          if (tokenPrice[1] > 0) {
            tokenPrice = tokenPrice[0] + "." + tokenPrice[1].substr(0, 3);
          } else {
            tokenPrice = tokenPrice[0];
          }
        }
        if (this.currencyFrom.value == POOL_TOKENS[2].value) {
          let price_before_add = Number(tokenA) / Number(tokenB);
          tokenPrice = Number(price_before_add).toString().split(".");
          console.log(tokenPrice, "hgensol");
          if (tokenPrice[1] > 0) {
            tokenPrice = tokenPrice[0] + "." + tokenPrice[1].substr(0, 3);
          } else {
            tokenPrice = tokenPrice[0];
          }
        }
      }

      return tokenPrice;
    },
    getBalance() {
      let result = 0;
      if (this.$accessor.wallet.balance) {
        result = Number(this.$accessor.wallet.balance).toString().split(".");
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }
      return result.toString();
    },
    getBalanceHGEN() {
      let result = 0;
      if (this.$accessor.wallet.balanceHGEN) {
        result = Number(this.$accessor.wallet.balanceHGEN)
          .toString()
          .split(".");
        console.log("the gens is", result);
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }

      return result.toString();
    },
    getBalanceGENS() {
      let result = 0;
      if (this.$accessor.wallet.balanceGENS) {
        result = Number(this.$accessor.wallet.balanceGENS)
          .toString()
          .split(".");
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }
      return result.toString();
    },
  },
  watch: {
    currencyFrom: {
      deep: true,
      handler(val) {
        let temp = val.items.filter((item) => item.value == val.value)[0];
        if (temp) {
          this.currencyFrom.name = val.items.filter(
            (item) => item.value == val.value
          )[0].label;

          // remove the token name from the currencyTo selectbox
          let temp_to = val.items.filter((item) => item.value != val.value);

          this.currencyTo.items = temp_to;
          if (this.currencyFrom.name != "" && this.currencyTo.name != "") {
            let type = this.checkPool(
              this.currencyFrom.name,
              this.currencyTo.name
            );

            if (type == "GH") {
              this.tokenAacc = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].tokenAccgh;

              this.tokenAMintAddr = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].mintAddr;

              this.tokenBacc = POOL_TOKENS.filter(
                (item) => item.value == this.currencyTo.value
              )[0].tokenAccgh;

              this.tokenBMintAddr = POOL_TOKENS.filter(
                (item) => item.value == this.currencyTo.value
              )[0].mintAddr;
            }

            if (type == "GS") {
              this.tokenAacc = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].tokenAccgs;

              this.tokenAMintAddr = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].mintAddr;

              this.tokenBacc = POOL_TOKENS.filter(
                (item) => item.value == this.currencyTo.value
              )[0].tokenAccgs;

              this.tokenBMintAddr = POOL_TOKENS.filter(
                (item) => item.value == this.currencyTo.value
              )[0].mintAddr;
            }

            if (type == "HS") {
              this.tokenAacc = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].tokenAcchs;
              this.tokenAMintAddr = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].mintAddr;

              this.tokenBacc = POOL_TOKENS.filter(
                (item) => item.value == this.currencyTo.value
              )[0].tokenAcchs;
              this.tokenBMintAddr = POOL_TOKENS.filter(
                (item) => item.value == this.currencyTo.value
              )[0].mintAddr;
            }

            // for balance
            // TODO make it look for the account info using the mint address and ata of the account

            if (this.currencyFrom.name == "HGEN") {
              this.currencyFrom.balance = this.getBalanceHGEN;
            }
            if (this.currencyFrom.name == "GENS") {
              this.currencyFrom.balance = this.getBalanceGENS;
            }
            if (this.currencyFrom.name == "SOL") {
              this.currencyFrom.balance = this.getBalance;
            }

            this.convert();
          }
        }
      },
    },
    currencyTo: {
      deep: true,
      handler(val) {
        console.log(val.items, "valOItem");
        console.log(this.currencyTo.items, "items");
        console.log(val.name, "|", this.currencyFrom.name);

        let temp = val.items.filter((item) => item.value == val.value)[0];
        if (temp) {
          //   let temp_from = val.items.filter((item) => item.value != val.value);
          //   this.currencyFrom.items = temp_from;

          this.currencyTo.name = val.items.filter(
            (item) => item.value == val.value
          )[0].label;

          console.log(this.currencyFrom.name, "|", this.currencyTo.name);
          if (this.currencyFrom.name != "" && this.currencyTo.name != "") {
            let type = this.checkPool(
              this.currencyFrom.name,
              this.currencyTo.name
            );

            if (type == "GH") {
              this.tokenBacc = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].tokenAccgh;

              this.tokenBMintAddr = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].mintAddr;

              this.tokenAacc = POOL_TOKENS.filter(
                (item) => item.value == this.currencyFrom.value
              )[0].tokenAccgh;

              this.tokenAMintAddr = POOL_TOKENS.filter(
                (item) => item.value == this.currencyFrom.value
              )[0].mintAddr;
            }

            if (type == "GS") {
              this.tokenBacc = val.items.filter(
                (item) => item.value == val.value
              )[0].tokenAccgs;

              this.tokenBMintAddr = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].mintAddr;

              this.tokenAacc = POOL_TOKENS.filter(
                (item) => item.value == this.currencyFrom.value
              )[0].tokenAccgs;
              this.tokenAMintAddr = POOL_TOKENS.filter(
                (item) => item.value == this.currencyFrom.value
              )[0].mintAddr;
            }

            if (type == "HS") {
              this.tokenBacc = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].tokenAcchs;
              this.tokenBMintAddr = POOL_TOKENS.filter(
                (item) => item.value == val.value
              )[0].mintAddr;

              this.tokenAacc = POOL_TOKENS.filter(
                (item) => item.value == this.currencyFrom.value
              )[0].tokenAcchs;
              this.tokenAMintAddr = POOL_TOKENS.filter(
                (item) => item.value == this.currencyFrom.value
              )[0].mintAddr;
            }

            // for balance
            // TODO make it look for the account info using the mint address and ata of the account

            if (this.currencyTo.name == "HGEN") {
              this.currencyTo.balance = this.getBalanceHGEN;
            }
            if (this.currencyTo.name == "GENS") {
              this.currencyTo.balance = this.getBalanceGENS;
            }
            if (this.currencyTo.name == "SOL") {
              this.currencyTo.balance = this.getBalance;
            }

            this.convert();
          }
        } else {
          this.currencyTo.name = "";
          this.currencyTo.value = "";
        }
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
    },
    slippageTolerance(val) {
      this.slippagePrice = this.to - (val / 100) * this.to;
    },
    to(val) {
      this.slippagePrice = val - (val * this.slippageTolerance) / 100;
    },
  },
  methods: {
    // TODO: refractor this code for extendibility
    checkPool(currfrom, currto) {
      console.log("this is running well");
      if (
        (currfrom == "GENS" && currto == "SOL") ||
        (currfrom == "SOL" && currto == "GENS")
      ) {
        this.tokenPoolType = "GS";
        this.tokenLP = LP_TOKENS_GS;
      }
      if (
        (currfrom == "HGEN" && currto == "SOL") ||
        (currfrom == "SOL" && currto == "HGEN")
      ) {
        this.tokenPoolType = "HS";
        this.tokenLP = LP_TOKENS_HS;
      }
      if (
        (currfrom == "GENS" && currto == "HGEN") ||
        (currfrom == "HGEN" && currto == "GENS")
      ) {
        this.tokenPoolType = "GH";
        this.tokenLP = LP_TOKENS_HGEN_GENS;
      }
      return this.tokenPoolType;
    },

    toggleSwap() {
      this.raySwap = !this.raySwap;
    },

    toggleToken() {
      //   if (this.currencyFrom.value && this.currencyTo.value) {
      //     const prev_curr_from = this.currencyFrom;
      //     console.log(prev_curr_from.name, "name");
      //     this.currencyFrom = this.currencyTo;
      //     // console.log(this.currencyFrom.name, "name from in toggle");
      //     // this.currencyTo = prev_curr_from;
      //     // console.log(this.currencyTo.name, "name to in toggle");
      //   }
    },
    setModalFunc(value) {
      if (this.loaderConnect) {
        this.$accessor.wallet.setLoaderConnect(false);
      } else {
        this.$accessor.setModal(value);
      }
    },
    calculateTokenGensToHgen() {
      let swapTokenBWithFees;
      if (this.from > 0) {
        const TRADE_FEE_NUMBERATOR = 25;
        const TRADE_FEE_DENOMINATOR = 10000;
        const OWNER_FEE_NUMBERATOR = 5;
        const OWNER_FEE_DENOMINATOR = 10000;
        let tokenA = this.$accessor.swapPool.tokenAmountA * 100;
        let tokenB = new BN(this.$accessor.swapPool.tokenAmountB) * 100;

        let invariant = tokenA * tokenB;
        let numerator = invariant;
        let denominator = tokenA + this.from * 100;

        // new swap price for the token A->B
        let swapTokenB = numerator / denominator;
        swapTokenB = tokenB - swapTokenB;

        // swaptokenB with fees
        let trade_fees =
          (TRADE_FEE_NUMBERATOR * swapTokenB) / TRADE_FEE_DENOMINATOR;
        let owner_fees =
          (OWNER_FEE_NUMBERATOR * swapTokenB) / OWNER_FEE_DENOMINATOR;
        let swap_fees = trade_fees + owner_fees;
        console.log(swap_fees, "swap fees for the gens to hgen");
        swapTokenBWithFees = swapTokenB - swap_fees;

        // pool price before add
        denominator = tokenA + 1 * 100;
        let swapTokeB_for_one = numerator / denominator;
        let price_impact = tokenB - swapTokeB_for_one;
        price_impact =
          Math.abs(Number(swapTokenB) - Number(price_impact)) /
          Number(price_impact) /
          100;
        if (price_impact <= 0.1) {
          price_impact = 0.1;
        }
        price_impact = price_impact.toString().split(".");
        if (price_impact[1] > 0) {
          price_impact = price_impact[0] + "." + price_impact[1].substr(0, 3);
        }
        this.priceImpact = price_impact;
      }

      return swapTokenBWithFees / 100 || 0; // 2 decimal
    },
    calculateTokenHgenToGens() {
      const TRADE_FEE_NUMBERATOR = 25;
      const TRADE_FEE_DENOMINATOR = 10000;
      const OWNER_FEE_NUMBERATOR = 5;
      const OWNER_FEE_DENOMINATOR = 10000;
      let tokenA = this.$accessor.swapPool.tokenAmountA * 100;

      let tokenB = this.$accessor.swapPool.tokenAmountB * 100;

      let invariant = tokenA * tokenB;
      let numerator = invariant;
      let denominator = tokenB + this.from * 100;

      // new swap price for the token A->B
      let swapTokenA = numerator / denominator;
      swapTokenA = tokenA - swapTokenA;

      // swaptokenB with fees
      let trade_fees =
        (TRADE_FEE_NUMBERATOR * swapTokenA) / TRADE_FEE_DENOMINATOR;
      let owner_fees =
        (OWNER_FEE_NUMBERATOR * swapTokenA) / OWNER_FEE_DENOMINATOR;
      let swap_fees = trade_fees + owner_fees;
      let swapTokenAWithFees = swapTokenA - swap_fees;

      // pool price before add
      denominator = tokenB + 1 * 100;
      let swapTokeA_for_one = numerator / denominator;
      let price_impact = tokenA - swapTokeA_for_one;
      price_impact =
        Math.abs(Number(swapTokenA) - Number(price_impact)) /
        Number(price_impact) /
        100;
      if (price_impact <= 0.1) {
        price_impact = 0.1;
      }
      price_impact = price_impact.toString().split(".");
      if (price_impact[1] > 0) {
        price_impact = price_impact[0] + "." + price_impact[1].substr(0, 3);
      }
      this.priceImpact = price_impact;

      return swapTokenAWithFees / 100 || 0; // 2 decimal
    },

    // TODO refractor this code for extendibility
    calculateTokenGensToSol() {
      let swapTokenBWithFees;
      let swapTokenB;
      if (this.from > 0) {
        const TRADE_FEE_NUMBERATOR = 25;
        const TRADE_FEE_DENOMINATOR = 10000;
        const OWNER_FEE_NUMBERATOR = 5;
        const OWNER_FEE_DENOMINATOR = 10000;
        let tokenA = Number(this.$accessor.swapPool.tokenAmountGensGS);
        let tokenB = Number(this.$accessor.swapPool.tokenAmountSOLGS);

        let invariant = tokenA * tokenB;
        let denominator = tokenA + Number(this.from);

        let numerator = invariant;

        // new swap price for the token A->B
        swapTokenB = tokenB - numerator / denominator;
        console.log(swapTokenB, "swap token B is ");
        // swaptokenB with fees
        let trade_fees =
          (TRADE_FEE_NUMBERATOR * swapTokenB) / TRADE_FEE_DENOMINATOR;
        let owner_fees =
          (OWNER_FEE_NUMBERATOR * swapTokenB) / OWNER_FEE_DENOMINATOR;
        let swap_fees = trade_fees + owner_fees;

        swapTokenBWithFees = swapTokenB - swap_fees;

        // pool price before add
        denominator = tokenA + 1;
        let swapTokeB_for_one = numerator / denominator;
        let price_impact = tokenB - swapTokeB_for_one;
        price_impact =
          Math.abs(Number(swapTokenB) - Number(price_impact)) /
          Number(price_impact) /
          100;
        if (price_impact <= 0.1) {
          price_impact = 0.1;
        }
        price_impact = price_impact.toString().split(".");
        if (price_impact[1] > 0) {
          price_impact = price_impact[0] + "." + price_impact[1].substr(0, 3);
        }
        this.priceImpact = price_impact;
      }

      return swapTokenBWithFees || 0; // 2 decimal
    },
    calculateTokenSolToGens() {
      const TRADE_FEE_NUMBERATOR = 25;
      const TRADE_FEE_DENOMINATOR = 10000;
      const OWNER_FEE_NUMBERATOR = 5;
      const OWNER_FEE_DENOMINATOR = 10000;
      let tokenA = Number(this.$accessor.swapPool.tokenAmountGensGS);
      let tokenB = Number(this.$accessor.swapPool.tokenAmountSOLGS);

      let invariant = tokenA * tokenB;
      let numerator = invariant;
      let denominator = tokenB + Number(this.from);

      // new swap price for the token A->B
      let swapTokenA = numerator / denominator;
      swapTokenA = tokenA - swapTokenA;

      // swaptokenB with fees
      let trade_fees =
        (TRADE_FEE_NUMBERATOR * swapTokenA) / TRADE_FEE_DENOMINATOR;
      let owner_fees =
        (OWNER_FEE_NUMBERATOR * swapTokenA) / OWNER_FEE_DENOMINATOR;
      let swap_fees = trade_fees + owner_fees;
      let swapTokenAWithFees = swapTokenA - swap_fees;

      // pool price before add
      denominator = tokenB + 1;
      let swapTokeA_for_one = numerator / denominator;
      let price_impact = tokenA - swapTokeA_for_one;
      price_impact =
        Math.abs(Number(swapTokenA) - Number(price_impact)) /
        Number(price_impact) /
        100;
      if (price_impact <= 0.1) {
        price_impact = 0.1;
      }
      price_impact = price_impact.toString().split(".");
      if (price_impact[1] > 0) {
        price_impact = price_impact[0] + "." + price_impact[1].substr(0, 3);
      }
      this.priceImpact = price_impact;

      return swapTokenAWithFees || 0; // 2 decimal
    },

    // TODO refractor this code for extendibility
    calculateTokenHgenToSol() {
      let swapTokenBWithFees;
      if (this.from > 0) {
        const TRADE_FEE_NUMBERATOR = 25;
        const TRADE_FEE_DENOMINATOR = 10000;
        const OWNER_FEE_NUMBERATOR = 5;
        const OWNER_FEE_DENOMINATOR = 10000;
        let tokenA = this.$accessor.swapPool.tokenAmountHgenHS;
        let tokenB = this.$accessor.swapPool.tokenAmountSOLHS;

        console.log(tokenA, tokenB, "token Hgen and SOL");

        let invariant = tokenA * tokenB;
        let numerator = invariant;
        let denominator = tokenA + Number(this.from);

        // new swap price for the token A->B
        let swapTokenB = numerator / denominator;
        swapTokenB = tokenB - swapTokenB;
        console.log(swapTokenB, "testing value is");

        // swaptokenB with fees
        let trade_fees =
          (TRADE_FEE_NUMBERATOR * swapTokenB) / TRADE_FEE_DENOMINATOR;
        let owner_fees =
          (OWNER_FEE_NUMBERATOR * swapTokenB) / OWNER_FEE_DENOMINATOR;
        let swap_fees = trade_fees + owner_fees;
        swapTokenBWithFees = swapTokenB - swap_fees;

        // pool price before add

        let denominator_one = tokenA + 1;
        let swapTokeB_for_one = tokenB / denominator_one;
        let price_impact = tokenB - swapTokeB_for_one;
        price_impact =
          Math.abs(Number(swapTokenB) - Number(price_impact)) /
          Number(price_impact) /
          100;
        if (price_impact <= 0.1) {
          price_impact = 0.1;
        }
        price_impact = price_impact.toString().split(".");
        if (price_impact[1] > 0) {
          price_impact = price_impact[0] + "." + price_impact[1].substr(0, 3);
        }
        this.priceImpact = price_impact;
      }
      console.log(
        Number(swapTokenBWithFees),
        "The sol for hgen after fees is "
      );
      return swapTokenBWithFees || 0; // 2 decimal
    },

    calculateTokenSolToHgen() {
      const TRADE_FEE_NUMBERATOR = 25;
      const TRADE_FEE_DENOMINATOR = 10000;
      const OWNER_FEE_NUMBERATOR = 5;
      const OWNER_FEE_DENOMINATOR = 10000;
      let tokenA = new BN(this.$accessor.swapPool.tokenAmountHgenHS);
      let tokenB = new BN(this.$accessor.swapPool.tokenAmountSOLHS);

      let invariant = new BN(tokenA).mul(new BN(tokenB));
      let numerator = invariant;
      let denominator = tokenB.add(new BN(this.from));

      // new swap price for the token A->B
      let swapTokenA = numerator.div(denominator);
      swapTokenA = new BN(tokenA).sub(swapTokenA);

      // swaptokenB with fees
      let trade_fees = new BN(TRADE_FEE_NUMBERATOR)
        .mul(new BN(swapTokenA))
        .div(new BN(TRADE_FEE_DENOMINATOR));
      let owner_fees = new BN(OWNER_FEE_NUMBERATOR)
        .mul(new BN(swapTokenA))
        .div(new BN(OWNER_FEE_DENOMINATOR));
      let swap_fees = trade_fees.add(owner_fees);
      let swapTokenAWithFees = swapTokenA.sub(swap_fees);

      // pool price before add
      denominator = tokenB.add(new BN(1).mul(new BN(100)));
      let swapTokeA_for_one = numerator.div(denominator);
      let price_impact = tokenA.sub(swapTokeA_for_one);
      price_impact =
        Math.abs(Number(swapTokenA) - Number(price_impact)) /
        Number(price_impact) /
        100;
      if (price_impact <= 0.1) {
        price_impact = 0.1;
      }
      price_impact = price_impact.toString().split(".");
      if (price_impact[1] > 0) {
        price_impact = price_impact[0] + "." + price_impact[1].substr(0, 3);
      }
      this.priceImpact = price_impact;

      return swapTokenAWithFees || 0; // 2 decimal
    },

    // TODO refactor this code for reusability
    convert() {
      // gens to hgen
      if (
        this.currencyFrom.value === this.tokens[0].value &&
        this.currencyTo.value === this.tokens[1].value
      ) {
        this.to = this.calculateTokenGensToHgen() || 0;
        return;
      }

      // hgen to gens
      if (
        this.currencyFrom.value === this.tokens[1].value &&
        this.currencyTo.value === this.tokens[0].value &&
        this.from > 0
      ) {
        this.to = this.calculateTokenHgenToGens() || 0;
      }

      // gens to sol
      if (
        this.currencyFrom.value === this.tokens[0].value &&
        this.currencyTo.value === this.tokens[2].value
      ) {
        this.to = this.calculateTokenGensToSol() || 0;
      }

      // sol to gens
      if (
        this.currencyFrom.value === this.tokens[2].value &&
        this.currencyTo.value === this.tokens[0].value
      ) {
        this.to = this.calculateTokenSolToGens() || 0;
      }

      // hgen to sol
      if (
        this.currencyFrom.value === this.tokens[1].value &&
        this.currencyTo.value === this.tokens[2].value
      ) {
        this.to = this.calculateTokenHgenToSol() || 0;
      }

      // sol to hgen
      if (
        this.currencyFrom.value === this.tokens[2].value &&
        this.currencyTo.value === this.tokens[1].value
      ) {
        this.to = this.calculateTokenSolToHgen() || 0;
      }
    },
    async confirm() {
      if (this.from > 0) {
        this.$accessor.swapPool.swap({
          tokenLP: this.tokenLP,
          tokenAacc: this.tokenAacc,
          tokenBacc: this.tokenBacc,
          tokenAMintAddr: this.tokenAMintAddr,
          tokenBMintAddr: this.tokenBMintAddr,
          from: Number(this.from) * 100,
          tokenType: this.tokenPoolType,
          slippagePrice: this.slippagePrice,
        }); // 2 decimal

        if (this.currencyFrom.name == "HGEN") {
          this.currencyFrom.balance = this.getBalanceHGEN;
        }
        if (this.currencyFrom.name == "GENS") {
          this.currencyFrom.balance = this.getBalanceGENS;
        }
        if (this.currencyFrom.name == "SOL") {
          this.currencyFrom.balance = this.getBalance;
        }

        if (this.currencyTo.name == "HGEN") {
          this.currencyTo.balance = this.getBalanceHGEN;
        }
        if (this.currencyTo.name == "GENS") {
          this.currencyTo.balance = this.getBalanceGENS;
        }
        if (this.currencyTo.name == "SOL") {
          this.currencyTo.balance = this.getBalance;
        }
      }
      this.to = null;
      this.from = null;
    },
    rayConfirm() {
      if (Number(this.from) > 0) {
        this.$accessor.swap.swap({
          from: this.from,
          mintFrom: this.currencyFrom.value,
          mintTo: this.currencyTo.value,
        });
      }
    },

    getBlanceGens() {},
    async setMax() {
      let tokenDetail;
      console.log("clicked");
      if (this.$accessor.wallet) {
        if (this.currencyFrom.name == "SOL") {
          this.from = this.getBalance;
        } else {
          if (this.currencyFrom.value) {
            tokenDetail = await this.$accessor.wallet.getTokenFromBalance(
              this.currencyFrom.value
            );

            this.from = tokenDetail ? Number(tokenDetail) : 0;
          }
        }
      }
    },
    reset() {
      this.to = null;
      this.from = null;
      this.priceImpact = 0;
    },
  },
  mounted() {
    // if (this.tokenPoolType == "GH") {
    //   this.tokenLP = LP_TOKENS_HGEN_GENS;
    //   this.tokenAacc = TOKEN_ACC_A;
    //   this.tokenBacc = TOKEN_ACC_B;
    //   this.tokenAMintAddr = TOKEN_A_MINT_ADDR;
    //   this.tokenBMintAddr = TOKEN_B_MINT_ADDR;
    // }

    // if (this.tokenPoolType == "GS") {
    //   this.tokenLP = LP_TOKENS_GS;
    //   this.tokenAacc = TOKEN_ACC_GENS_GS;
    //   this.tokenBacc = TOKEN_ACC_SOL_GS;
    //   this.tokenAMintAddr = TOKEN_GENS;
    //   this.tokenBMintAddr = WSOL_ADDR;
    // }

    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();
  },
};
</script>
