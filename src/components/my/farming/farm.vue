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
      <div class="w-100 fd-r ai-c pb-4-S pb-10-XS jc-sb">
        <!-- <span class="fs-6 f-white-200  ts-3 hv d-n-XS fsh-0">Close</span> -->
        <div class="w-80 fs-8-S fs-25-XS fw-600 f-white-200 ta-l-S ta-l-XS">
          Farm
        </div>
        <span
          class="fs-6-S fs-25-XS f-white-200 ts-3 hv fsh-0 ta-r-S"
          @click="closeList"
          v-if="getToggleValue"
        >
          <!-- <Tooltip placement="bottomRight">
            <Icon type="caret-up" />
            Close
          </Tooltip> -->
        </span>
        <span class="fs-6-S fs-25-XS f-white-200 ts-3 hv fsh-0 ta-r-S"
          ><Tooltip placement="bottomRight" class="f-cyan-1500 fw-600">
            <!-- <Icon type="caret-down" /> -->
            OPEN
          </Tooltip>
        </span>
      </div>

      <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS ta-c-XS">
        Your Current Farm
      </div>
      <div
        class="fs-7-S fs-20-XS f-white-200 ta-c-XS pb-2-S pb-10-XS ta-c-XS mb-10-XS fw-600"
        data-tour-step="1"
      >
        <span class="fs-7-S fs-25-XS f-white-200 fw-800">{{
          getDepsoitedLpToken
        }}</span>
        <span class="mr-1"> LP Tokens </span>(<span class="fw-800 f-white-200">
          {{ getPoolShare }}
        </span>
        <span class="fw-600 pr-1">% </span>Pool Share)
      </div>

      <div class="w-100" v-if="getToggleValue">
        <div
          class="w-100 fs-5-S fs-20-XS f-gray-500 pb-2-S pb-10-XS ta-c-XS jc-c-XS fd-r"
          v-if="getDepositKey"
        >
          <div class="fd-r ai-c">
            <span class="fw-600"
              ><img
                src="@/assets/svg/symbol-hgen.png"
                class="h-fix-10-S h-fix-55-XS mr-2"
            /></span>
            <span> HGEN </span>
          </div>
          <span
            class="fw-600 fs-6-L fs-5-S fs-20-XS f-white-200 mr-2 ml-2 my-10-XS ml-10-XS mr-10-XS"
            >:</span
          >
          <div class="fd-r ai-c">
            <span class="fw-600"
              ><img
                src="@/assets/svg/sol-logo.png"
                class="h-fix-10-S h-fix-55-XS mr-2"
              />
            </span>
            <span> SOL </span>
          </div>
        </div>

        <div
          class="w-100 my-2-S my-10-XS mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          v-if="getDepositKey"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Set amount you want to deposit
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-25-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >LP TOKEN</span
            >
            <input
              type="text"
              id="lp"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0.00"
              v-model="lp"
              maxlength="12"
            />
            <span
              class="fs-5-S fs-20-XS f-cyan-200 fw-500 ts-3 hv d-n-XS fsh-0 px-3 py-1 rad-fix-10"
              @click="setMax"
              >max</span
            >
          </div>
        </div>
        <div
          class="w-100 my-2-S my-10-XS mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          v-if="getDepositKey"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Set farming duration
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >DAY</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0"
              v-model="day"
            />
            <!-- <span class="fs-6 f-white-200 ts-3 hv d-n-XS fsh-0">Day</span> -->
          </div>
        </div>
        <!-- <div class="w-100 fd-r jc-r ai-c">
          <span class="f-white-200 fs-6-S fw-600">Update</span>
          <Hint
            >Currently, we support single transaction for farming. We will be
            supporting multiple transaction in two weeks for our devnet.</Hint
          >
        </div> -->
        <div class="w-100 fd-r-S fd-c-XS pt-4-S pt-20-XS" v-if="getDepositKey">
          <div class="w-50-S w-100-XS mr-2-S mr-0-XS">
            <AmButton
              color="gradient-1000"
              bColor="gradient-1000"
              opacityEffect
              full
              v-if="getDepositKey"
              @click="reset()"
              class="rad-fix-10"
            >
              Reset
            </AmButton>
          </div>
          <div
            class="w-50-S w-100-XS ml-2-S ml-0-XS mt-0-S mt-4-XS mt-0-S mt-10-XS"
          >
            <AmButton
              color="gradient-5002"
              bColor="gradient-5002"
              opacityEffect
              full
              v-if="getDepositKey"
              @click="setFarmingData()"
              class="rad-fix-10"
            >
              confirm
            </AmButton>
          </div>
        </div>
      </div>
      <div
        class="w-100 my-2 fs-6-S f-red-500 fs-25-XS mcolor-800 p-3-S rad-fix-10"
        v-if="getFarmWarning"
      >
        <span class="f-orange-600">
          Warning! You already have existing farm session.
        </span>
      </div>
      <div
        class="w-100 mt-3 fs-6-S f-red-500 fs-25-XS mcolor-800 p-3-S rad-fix-5"
        v-if="getOutcome < 1 && lp > 0 && day > 0"
      >
        <span class="f-orange-600">
          Warning! You have incured
          {{ ((1 - getOutcome) * 100).toFixed(2) }}% penalty. Change the value
          to get advantage.</span
        >
      </div>
      <div
        class="w-100 mt-3 fs-6-S f-green-500 fs-25-XS gradient-5002 p-3-S rad-fix-5"
        v-if="getOutcome > 1 && lp > 0 && day > 0"
      >
        <span class="f-green-500"
          >You have {{ ((getOutcome - 1) * 100).toFixed(2) }}% advantage on
          farming.</span
        >
      </div>
      <div class="w-100 h-100 p-a l-0 t-0 fd-r ai-c jc-c" v-if="getLoading">
        <Loading />
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import { Icon, Tooltip } from "ant-design-vue";
import Farming from "../../../utils/farming";
import Hint from "@/components/Hint.vue";
const TOKENS = [
  { label: "HGEN", value: "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC" },
  { label: "SOL", value: "So11111111111111111111111111111111111111112" },
];
// conversion fo the hgen and sol
const CONVERT_HGEN = 150;
const CONVERT_SOL = 0.005;

const farming = new Farming();

export default {
  components: {
    Loading,
    Icon,
    Tooltip,
    Hint,
  },
  data() {
    return {
      gen: "",
      hgen: "",
      from: null,
      to: null,
      lp: null,
      day: null,
      open: true,
      totalAmount: 1389185,
      currencyFrom: {
        theme: "default",
        value: TOKENS[0].value,
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      currencyTo: {
        theme: "default",
        value: TOKENS[1].value,
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      outcome: 0,
      penalty: 0,
      advantage: 0,
      poolShare: 0,
      depositedLp: 0,
      showFarmWarning: false,
      updateReward: false,
    };
  },
  computed: {
    getFarmWarning() {
      return this.showFarmWarning;
    },
    getDepsoitedLpToken() {
      return Number(this.$accessor.farm.depositedLp);
    },
    getFarmStatus() {
      return this.$accessor.farm.hasFarm;
    },
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getDepositKey() {
      return true;
      // return this.$accessor.pool.depositKey
    },
    getLoading() {
      return this.$accessor.pool.loading;
    },
    getDepositAmount() {
      return this.$accessor.pool.depositAmount;
    },
    getPercent() {
      return Number.parseInt(
        (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) *
          100
      );
    },
    getDepositeTotal() {
      return this.$accessor.totalDeposit || 0;
    },
    getToggleValue() {
      return this.open;
    },
    getFrom() {
      return this.from;
    },
    getTo() {
      return this.to;
    },
    getDay() {
      return this.day;
    },
    getOutcome() {
      return this.outcome;
    },
    getPenalty() {
      return this.penalty;
    },
    getAdvantage() {
      return this.advantage;
    },
    getInputLpTokens() {
      return this.lp || 0;
    },
    getPoolShare() {
      let share = 0;

      share = (this.getDepsoitedLpToken / this.totalAmount) * 100 || 0;

      share = share.toString().split(".");
      if (share.length > 1 && share[1].length > 2) {
        share = share[0] + "." + share[1].substr(0, 2);
      } else {
        if (share.length > 1) share = share[0] + "." + share[1];
      }
      if (share.length < 2) {
        share = share[0];
      }
      return share;
    },
    getLpTokens() {
      return this.$accessor.liquidity.lpTokens;
    },
  },
  watch: {
    lp(val) {
      console.log(val, "val goes brr.");
      let hgen =
        (val / this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountHgenHS *
        100;
      console.log(
        this.$accessor.liquidity.lpTotalSupply,
        this.$accessor.swapPool.tokenAmountHgenHS
      );
      hgen = hgen > 0 ? hgen.toString().split(".") : 0;
      if (hgen.length > 1 && hgen[1].length > 2) {
        hgen = hgen[0].toLocaleString() + "." + hgen[1].substr(0, 2);
      }
      this.from = Number(hgen);
      console.log(this.from, "valuie 1....");

      let sol =
        (val / this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountSOLHS *
        100;
      sol = sol > 0 ? sol.toString().split(".") : 0;
      if (sol.length > 1 && sol[1].length > 9) {
        sol = sol[0].toLocaleString() + "." + sol[1].substr(0, 9);
      }
      this.to = Number(sol);

      this.penalty = Math.pow(12 / 30, Math.log10(this.to));
      this.advantage = Math.pow(1.075, this.day / 30);
      this.outcome = this.penalty * this.advantage;

      this.$emit("lp", val);
    },
    day(val) {
      this.penalty = Math.pow(12 / 30, Math.log10(this.to));
      this.advantage = Math.pow(1.075, val / 30);
      this.outcome = this.penalty * this.advantage;
      this.$emit("day", val);
    },
    from(val) {},
    to(val) {},
  },
  methods: {
    getInfo() {
      farming
        .getFarmingAccount()
        .then((res) => {
          this.depositedLp = Number(res.depositedLp);
          this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType); // TODO: make it refresh after 30 secs
          //   if (this.$accessor.farm.depositedLp > 0) {
          //     console.log("this was called **************************");
          //     this.hasFarm = true;
          //   } else {
          //     this.hasFarm = false;
          //   }
        })
        .catch((err) => console.log(err));
    },
    reset() {
      this.from = null;
      this.lp = null;
      this.to = null;
      this.day = null;
    },
    farmFunc() {},
    openList() {
      this.open = true;
    },
    closeList() {
      this.open = false;
    },
    setFarmingData() {
      console.log(this.from, this.to, this.day, "without computed");
      console.log(this.getFrom, this.getTo, this.getDay, "with computed");
      this.getInfo();
      if (
        this.getFrom !== null &&
        this.getTo !== null &&
        this.getDay !== null &&
        Number(this.lp) > 0 &&
        this.$accessor.farm.depositedLp == 0
      ) {
        this.showFarmWarning = false;
        if (this.lp <= Number(this.getLpTokens)) {
          const farming = new Farming();
          farming.setFarmingAccount(this.lp, this.from, this.to, this.getDay);
          this.$accessor.wallet.getBalance();
          this.$accessor.wallet.getGENSBalance();
          this.$accessor.wallet.getHGENBalance();
          this.$accessor.wallet.getLPBalance();
        }
      } else {
        this.showFarmWarning = true;
      }
      this.lp = null;
      this.from = null;
      this.to = null;
      this.day = null;
      this.$accessor.farm.getFarmingAccount();

      let scope = this;
      //TODO change the wallet lp balance update on account change
      setInterval(async function () {
        scope.$accessor.wallet.getLPBalance();
        scope.$accessor.farm.getFarmingAccount();
      }, 5000);
      //   else alert("Enter the values correctly");
    },
    convertToHgen() {
      // converting to hgen when sol is entered
      this.to = this.solPrice * Number(this.from);
    },
    convertToSol() {
      // converting to sol when hgen is entered
      this.to = CONVERT_SOL * Number(this.to);
    },

    setMax() {
      //   this.from = this.$accessor.wallet.balance
      //     ? Number(this.$accessor.wallet.balanceHGEN) / this.$accessor.usd
      //     : 0;
      //   // remove this when you change the value on watch
      //   console.log(this.$accessor.wallet.balance, "sol balance");
      //   if (this.from > this.$accessor.wallet.balance) {
      //     this.from = this.$accessor.wallet.balance - 1;
      //     this.to = Math.ceil(this.from * this.$accessor.usd) || 0;
      //   } else {
      //     this.to = Math.ceil(this.from * this.$accessor.usd) || 0;
      //   }
      this.lp = this.$accessor.liquidity.lpTokens;
    },
  },
  mounted() {
    this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType); // TODO: make it refresh after 30 secs
    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();
    this.$accessor.liquidity.getLpTokens();
    this.$accessor.liquidity.updateLpToken(this.lpTokenType);
    this.getInfo();
  },
};
</script>
