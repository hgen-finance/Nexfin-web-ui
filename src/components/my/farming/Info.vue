<template>
  <div class="w-100">
    <div
      class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS"
    >
      <Balance />
    </div>
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mt-2-S mt-10-XS mb-2-S mb-10-XS"
    >
      <div
        class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 pb-2-S pb-10-XS fd-r ai-c pt-3 jc-l-S jc-c-XS"
      >
        Rewards Calculation
        <Hint>
          APR (Annual Percentage Rate) is an interest that you will be receiving
          as a reward by staking your tokens available for loans. But the APR
          can be fluctuated. and the “Monthy” and “Daily” are calculated to show
          how much of reward you will be receiving during the term.
        </Hint>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <span class="fs-5-S fs-20-XS pl-2"
            ><span class="f-mcolor-100">32.50%</span> APR</span
          >
        </div>

        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
        >
          <span class="f-mcolor-300 pr-2">{{ getApr.toFixed(3) }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">HGEN</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <span class="fs-5-S fs-20-XS pl-2"
            ><span class="f-mcolor-100">8.50%</span> Monthly</span
          >
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
        >
          <span class="f-mcolor-300 pr-2">{{ getMonthly.toFixed(3) }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">HGEN</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <span class="fs-5-S fs-20-XS pl-2"
            ><span class="f-mcolor-100">1.50%</span> Daily</span
          >
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
        >
          <span class="f-mcolor-300 pr-2">{{ getDaily.toFixed(3) }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">HGEN</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import Balance from "@/components/my/farming/Balance.vue";
import Farming from "../../../utils/farming";
const farming = new Farming();
export default {
  data() {
    return {
      timestamp: "",
      endDate: "",
      //   depositedLp: 0,
      depositedSol: 0,
      depositedHgen: 0,
      totalAmount: 1389185,
      //   day: 0,
      dayLeft: 0,
      daily: 0,
      monthly: 0,
      apr: 0,
      currentEarn: 0,
      yourAmount: 0,
      yourPercent: 0,
      lpTokenType: "HS",
    };
  },
  props: {
    depositedLp: { type: Number, default: null },
    day: { type: Number, default: null },
  },
  mounted() {
    this.getInfo;
  },
  components: {
    Hint,
    Balance,
  },
  watch: {
    depositedLp(val) {
      let sol =
        (Number(val) / Number(this.$accessor.liquidity.lpTotalSupply)) *
        Number(this.$accessor.swapPool.tokenAmountSOLHS) *
        100;
      sol = sol > 0 ? sol.toString().split(".") : 0;
      if (sol.length > 1 && sol[1].length > 9) {
        sol = sol[0].toLocaleString() + "." + sol[1].substr(0, 9);
      }
      this.depositedSol = Number(sol);

      let hgen =
        (this.getDepositedLp / this.$accessor.liquidity.lpTotalSupply) *
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

      this.depositedHgen = Number(hgen);

      this.yourAmount = this.val;
      this.totalAmount = 1389185;
      this.yourPercent = ((this.val / this.totalAmount) * 100).toFixed(4);
      if (this.day != 0) {
        let penalty = Math.pow(12 / 30, Math.log10(this.depositedHgen));
        let advantage = Math.pow(1.075, this.day / 30);
        let outcome = penalty * advantage;
        this.daily =
          (((this.depositedSol * outcome * 1.5) / 100) * this.depositedHgen) /
            234 || 0;
        this.monthly =
          (((this.depositedSol * outcome * 8.5) / 100) * this.depositedHgen) /
            234 || 0;
        this.apr =
          (((this.depositedSol * outcome * 32.5) / 100) * this.depositedHgen) /
            234 || 0;
      }
    },
    day(val) {
      let sol =
        (Number(this.getDepositedLp) /
          Number(this.$accessor.liquidity.lpTotalSupply)) *
        Number(this.$accessor.swapPool.tokenAmountSOLHS) *
        100;
      sol = sol > 0 ? sol.toString().split(".") : 0;
      if (sol.length > 1 && sol[1].length > 9) {
        sol = sol[0].toLocaleString() + "." + sol[1].substr(0, 9);
      }
      this.depositedSol = Number(sol);

      let hgen =
        (this.getDepositedLp / this.$accessor.liquidity.lpTotalSupply) *
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

      this.depositedHgen = Number(hgen);

      this.yourAmount = this.getDepositedLp;
      this.totalAmount = 1389185;
      this.yourPercent = (
        (this.getDepositedLp / this.totalAmount) *
        100
      ).toFixed(4);
      if (val != 0) {
        let penalty = Math.pow(12 / 30, Math.log10(this.depositedHgen));
        let advantage = Math.pow(1.075, val / 30);
        let outcome = penalty * advantage;
        this.daily =
          (((this.depositedSol * outcome * 1.5) / 100) * this.depositedHgen) /
          234;
        this.monthly =
          (((this.depositedSol * outcome * 8.5) / 100) * this.depositedHgen) /
          234;
        this.apr =
          (((this.depositedSol * outcome * 32.5) / 100) * this.depositedHgen) /
          234;
      }
    },
  },
  layout: "my",
  computed: {
    getDaily() {
      return this.daily;
    },
    getMonthly() {
      return this.monthly;
    },
    getApr() {
      return this.apr;
    },
    getDepositedLp() {
      return this.depositedLp;
    },
    getInfo() {
      this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType); // TODO: make it refresh after 30 secs
    },
    getPercent() {
      return Number.parseInt(
        (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) *
          100
      );
    },

    getCoin() {
      return this.$accessor.pool.rewardCoinAmount;
    },
    getNow() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time = today.getHours() + ":" + today.getMinutes();
      const dateTime = date + " " + time;
      return dateTime;
    },
  },
  methods: {
    withdrawFarm() {
      farming.withdrawFarm();
    },
  },
};
</script>
