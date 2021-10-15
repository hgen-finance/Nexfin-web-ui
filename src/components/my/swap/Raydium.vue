<template>
  <div class="w-100 br-6 gradient-200 rad-fix-8 p-8-S p-20-XS">
    <div
      class="
        w-100
        fw-600
        f-white-200
        fd-r
        jc-sb
      "
    >
      <span class="fs-8-S fs-7-M" style="align-self:center;">Raydium Swap</span>
      <div class="fd-r buttons ">
        <Tooltip placement="bottomright">
          <Progress
            type="circle"
            :width="20"
            :stroke-width="10"
            :percent="50"
            :show-info="false"
          />
        </Tooltip>
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
          <Icon type="info-circle" />
        </Tooltip>
        <Icon type="setting" />
        <Tooltip placement="bottomRight">
          <Icon type="search" />
        </Tooltip>
      </div>
    </div>
    <div
      class="
        w-100
        mt-2-S mt-10-XS
        mb-1
        mcolor-700
        rad-fix-2-S rad-fix-15-XS
        px-4-S px-10-XS
      "
    >
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS"
      >
        From
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r">
        <input
          class="
            w-fix-s-10min
            fs-6-S fs-25-XS
            fw-600
            f-mcolor-300
            br-0
            oul-n
            white-100
          "
          placeholder="0"
          v-model="from"
          maxlength="15"
          type="text"
        />
        <div class="p-a-S p-r-XS r-0 b-0 w-fix-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyFrom"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
      </div>
    </div>
    <div class="cside-L cside-M cside-S cside-XS fd-r jc-c mt-8-XS mt-2-S">
      <div class="fd-r jc-c f-white-200 ai-c micon-L micon-M micon-S micon-XS">
        <Icon type="swap" :rotate="90" />
      </div>
    </div>
    <div
      class="
        w-100
        mt-2-S mt-10-XS
        mb-1
        mcolor-700
        rad-fix-2-S rad-fix-15-XS
        px-4-S px-10-XS
      "
    >
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-600 pb-2-S pb-10-XS pt-3-S pt-10-XS fd-r jc-sb z-4"
      >
        <span>
          To
        </span>
        <span>
          Estimated
        </span>
      </div>
      <div class="w-100 pb-3-S pb-0 fd-r jc-sb ai-c">
        <div
          class="w-fix-s-10min fs-6-S fs-25-XS fw-600 br-0 oul-n"
          :class="{
            'f-mcolor-300': Number(to) > 0,
            'f-gray-800': Number(to) === 0
          }"
        >
          {{ to }}
        </div>
        <div class="p-a-S p-r-XS r-0 b-0 w-fix-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyTo"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
      </div>
    </div>
    <div
      class="
        w-100
        pt-2-S pt-15-XS
        ta-c
        fs-5-S fs-20-XS
        fw-500
        f-white-200
        pb-2-S pb-15-XS
      "
      v-if="currencyFrom.value === tokens[0].value"
    >
      1 RAY ≈ {{ convertRay }} SOL
    </div>
    <div
      class="
        w-100
        pt-2-S pt-15-XS
        ta-c
        fs-5-S fs-20-XS
        fw-500
        f-white-200
        pb-2-S pb-15-XS
      "
      v-if="currencyFrom.value === tokens[1].value"
    >
      1 SOL ≈ {{ convertSOL }} RAY
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
        class="
          w-a
          fs-5-S fs-20-XS
          fsh-0
          fw-400
          f-mcolor-100
          fd-r
          ai-c
          pt-2-XS
          jc-c-XS
        "
      >
        1 <span class="f-white-200 pl-1">%</span>
      </div>
    </div>
    <div class="w-100 fd-r py-1-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
        Minimum Received
        <Hint>
          Your transaction will revert if there is a large, unfavourable price
          movement before it is confirmed.
        </Hint>
      </div>
      <div
        class="
          w-a
          fs-5-S fs-20-XS
          fsh-0
          fw-400
          f-mcolor-100
          fd-r
          ai-c
          pt-2-XS
          jc-c-XS
        "
      >
        0.0983070000 <span class="f-white-200 pl-1">SOL</span>
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
        class="
          w-a
          fs-5-S fs-20-XS
          fsh-0
          fw-400
          f-mcolor-100
          fd-r
          ai-c
          pt-2-XS
          jc-c-XS
        "
      >
        0.00 <span class="f-white-200 pl-1">%</span>
      </div>
    </div>
    <div class="w-100 pt-6-S pt-20-XS fd-r jc-c">
      <AmButton
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        @click="confirm"
        :full="true"
      >
        CREATE RAY aCCOUNT
      </AmButton>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Hint from "@/components/Hint";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

const TOKENS = [
  { label: "RAY", value: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { label: "SOL", value: "So11111111111111111111111111111111111111112" }
];
const CONVERT_RAY = 0.10104800982233;
const CONVERT_SOL = 9.896285951185709;

export default {
  components: {
    Hint,
    Icon,
    Tooltip,
    Button,
    Progress,
    Spin,
    Modal
  },
  data() {
    return {
      tokens: TOKENS,
      convertRay: CONVERT_RAY,
      convertSOL: CONVERT_SOL,
      from: null,
      currencyFrom: {
        theme: "default",
        value: TOKENS[0].value,
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200"
      },
      to: 0,
      currencyTo: {
        theme: "default",
        value: TOKENS[1].value,
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200"
      }
    };
  },
  computed: {
    ...mapState(["wallet", "swap", "url"])
  },
  watch: {
    currencyFrom: {
      deep: true,
      handler(val) {
        if (val.value === this.currencyTo.value) {
          this.currencyTo.value = val.items.filter(
            item => item.value !== val.value
          )[0].value;
        }
        this.convert();
      }
    },
    currencyTo: {
      deep: true,
      handler(val) {
        if (val.value === this.currencyFrom.value) {
          this.currencyFrom.value = val.items.filter(
            item => item.value !== val.value
          )[0].value;
        }
        this.convert();
      }
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
    }
  },
  methods: {
    setModalFunc(value) {
      if (this.loaderConnect) {
        this.$accessor.wallet.setLoaderConnect(false);
      } else {
        this.$accessor.setModal(value);
      }
    },
    convert() {
      if (this.currencyFrom.value === this.tokens[0].value) {
        this.to = CONVERT_RAY * Number(this.from);
      } else {
        this.to = CONVERT_SOL * Number(this.from);
      }
    },
    confirm() {
      if (Number(this.from) > 0) {
        this.$accessor.swap.swap({
          from: this.from,
          mintFrom: this.currencyFrom.value,
          mintTo: this.currencyTo.value
        });
      }
    }
  }
};
</script>
