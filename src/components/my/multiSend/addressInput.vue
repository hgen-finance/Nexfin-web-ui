<template>
  <div class="w-100 fd-r jc-sb">
    <div
      class="w-80 mt-4 mb-2 mcolor-700 rad-fix-2 px-1-S px-10-XS py-3-S py-10-XS d-f jc-r"
    >
      <div class="w-10 pb-0 fd-r jc-r ai-c ml-2-S mb-5-S">
        <div class="p-a-S p-r-XS l-0 t-15 w-fix-35-S w-35-XS">
          <AmSelectbox
            v-bind:data.sync="currencyTo"
            :update="true"
            :shadow="false"
            :padding="false"
          />
        </div>
      </div>
      <div class="w-90 fd-c line-l line-r pl-5-S">
        <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS ta-l">
          Destination Wallet Address
        </div>
        <div class="w-100 fd-r ai-c">
          <input
            type="text"
            class="w-100 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300 ta-l"
            placeholder="xxx..xxx"
            v-model="to"
            maxlength="12"
          />
        </div>
      </div>
    </div>
    <div
      class="w-20 mt-4 mb-2 mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
    >
      <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">Amount</div>
      <div class="w-100 fd-r ai-c">
        <input
          type="text"
          class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300"
          placeholder="0.00"
          v-model="amount"
          maxlength="12"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
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
    Loading,
  },
  layout: "my",
  computed: {},
  data() {
    return {
      to: null,
      amount: null,
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
    };
  },
  watch: {},
  methods: {},
  mounted() {},
};
</script>
<style scoped>
.line-r {
  border-right: 1px solid #ccc;
}
.line-l {
  border-left: 1px solid #ccc;
}
</style>
