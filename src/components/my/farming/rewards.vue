<template>
  <div class="w-100">
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mb-4-S mb-10-XS"
    >
      <div
        class="w-100 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 pb-5-S pb-15-XS ta-l-S ta-c-XS"
      >
        Your current Farmings
      </div>
      <div class="w-100 fd-r">
        <div class="w-100 py-1-M py-2-S py-10-XS fd-c">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
            Farming Date
          </div>
          <div
            class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 py-1-S py-5-XS"
          >
            <span class="f-white-200">{{ getStartDate || "-" }}</span>
          </div>
        </div>
        <div class="w-100 py-1-M py-2-S py-10-XS fd-c">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 ai-c">
            Redemption Date
          </div>
          <div
            class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 py-1-S py-5-XS ai-c"
          >
            <span class="f-white-200">{{ getEndDate || "-" }}</span>
          </div>
        </div>

        <div class="w-100 py-1-M py-2-S py-10-XS fd-c">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 ai-c">
            LP Tokens
          </div>
          <div
            class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 py-1-S py-5-XS ai-c"
          >
            <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">{{
              getYourAmount
            }}</span>
            ({{ getPoolSharePercent }} <span class="f-white-200">%</span>)
          </div>
        </div>
        <div class="w-100 py-1-S py-10-XS fd-c">
          <div class="w-100 fs-5-S fs-20-XS f-white-200 ai-c">
            Earnings (<span class="f-mcolor-100">SOL</span>)
          </div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 f-mcolor-100 py-1-S py-5-XS ai-c"
          >
            <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span
            >{{ getEarning }}
          </div>
        </div>
        <div class="w-100 py-1-S py-10-XS fd-c">
          <div class="w-100 fs-5-S fs-20-XS f-white-200 ai-c">APR %</div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 f-mcolor-100 py-1-S py-5-XS ai-c"
          >
            {{ getApr.toFixed(2) }}
          </div>
        </div>
        <div class="">
          <AmButton
            color="mcolor-100"
            bColor="mcolor-100"
            opacityEffect
            full
            v-if="dayLeft <= 0 && dayLeft"
            @click="withdrawFarm()"
          >
            Claim
          </AmButton>
          <AmButton
            color="mcolor-1001"
            bColor="mcolor-1001"
            full
            v-if="dayLeft > 0 || dayLeft == null"
            disabled
          >
            Claim
          </AmButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import Balance from "@/components/my/farming/Balance.vue";
import Farming from "@/utils/farming";
const farming = new Farming();
export default {
  data() {
    return {
      timestamp: "",
      startDate: "",
      endDate: "",
      depositedLp: 0,
      depositedSol: 0,
      depositedHgen: 0,
      totalAmount: 1389185,
      day: 0,
      dayLeft: null,
      daily: 0,
      monthly: 0,
      apr: 0,
      fApr: 32.5,
      constApr: 32.5,
      currentEarn: 0,
      yourAmount: 0,
      yourPercent: 0,
      lpTokenType: "HS",
    };
  },
  mounted() {
    this.getInfo;
    this.$accessor.farm.onFarmingAccountChange();
  },
  components: {
    Hint,
    Balance,
  },
  layout: "my",
  computed: {
    getPercent() {
      let percent;
      if (this.$accessor.pool.depositAmount) {
        percent = Number.parseInt(
          (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit ||
            0) * 100
        );
      } else {
        percent = 0;
      }
      return percent;
    },
    getYourAmount() {
      return this.$accessor.farm.depositedLp;
    },
    getApr() {
      let apr;
      let outcome;

      let hgen =
        (Number(this.$accessor.farm.depositedLp) /
          this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountHgenHS *
        100;
      if (hgen > 0) {
        let penalty = Math.pow(12 / 30, Math.log10(hgen));
        let advantage = Math.pow(1.075, this.day / 30);

        outcome = penalty * advantage;
        apr = outcome * this.constApr;
      } else {
        apr = 0;
      }
      return apr;
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
    getEndDate() {
      return this.$accessor.farm.endDate;
    },
    getStartDate() {
      return this.$accessor.farm.startDate;
    },
    getEarning() {
      let penalty = Math.pow(12 / 30, Math.log10(this.depositedHgen));
      let advantage = Math.pow(1.075, this.day / 30);
      let outcome = penalty * advantage;
      this.fApr = outcome * this.fApr;
      this.daily =
        (((this.depositedSol * outcome * 1.5) / 100) * this.depositedHgen) /
        234;

      let earn = this.daily * (this.day - this.dayLeft);
      if (earn) {
        earn = earn.toString().split(".");
        if (earn.length > 1 && earn[1].length > 6) {
          earn = earn[0].toLocaleString() + "." + earn[1].substr(0, 6);
        }
      } else {
        earn = "0.00";
      }
      return earn;
    },
    getPoolSharePercent() {
      return (
        (this.$accessor.farm.depositedLp / this.totalAmount) *
        100
      ).toFixed(4);
    },
    async getInfo() {
      await this.$accessor.farm.getFarmingAccount();
      this.depositedLp = Number(this.$accessor.farm.depositedLp);
      this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType); // TODO: make it refresh after 30 secs
      this.startDate = this.$accessor.farm.startDate;
      let sol =
        (Number(this.depositedLp) /
          Number(this.$accessor.liquidity.lpTotalSupply)) *
        Number(this.$accessor.swapPool.tokenAmountSOLHS) *
        100;

      sol = sol > 0 ? sol.toString().split(".") : 0;
      if (sol.length > 1 && sol[1].length > 9) {
        sol = sol[0].toLocaleString() + "." + sol[1].substr(0, 9);
      }
      this.depositedSol = Number(sol);

      let hgen =
        (this.depositedLp / this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountHgenHS *
        100;

      hgen = hgen > 0 ? hgen.toString().split(".") : 0;
      if (hgen.length > 1 && hgen[1].length > 2) {
        hgen = hgen[0].toLocaleString() + "." + hgen[1].substr(0, 2);
      }

      this.depositedHgen = Number(hgen);
      this.endDate = this.$accessor.farm.endDate;
      this.day = this.$accessor.farm.dayLength;

      // calculate the time left for the farming date
      let curr_date = new Date();
      let diff_time = new Date(this.endDate).getTime() - curr_date.getTime();

      this.dayLeft = Math.ceil(diff_time / (1000 * 3600 * 24)); // set the current date
      this.yourAmount = this.$accessor.farm.depositedLp;
      this.totalAmount = 1389185;
      this.yourPercent = (
        (this.$accessor.farm.depositedLp / this.totalAmount) *
        100
      ).toFixed(4);
      if (this.day != 0) {
        let penalty = Math.pow(12 / 30, Math.log10(this.depositedHgen));
        let advantage = Math.pow(1.075, this.day / 30);
        let outcome = penalty * advantage;
        this.fApr = outcome * this.fApr;
        this.daily =
          (((this.depositedSol * outcome * 1.5) / 100) * this.depositedHgen) /
          234;
        this.monthly =
          (((this.depositedSol * outcome * 8.5) / 100) * this.depositedHgen) /
          234;
        this.apr =
          (((this.depositedSol * outcome * 32.5) / 100) * this.depositedHgen) /
          234;

        let earn = this.daily * (this.day - this.dayLeft);
        earn = earn.toString().split(".");
        if (earn.length > 1 && earn[1].length > 6) {
          this.currentEarn =
            earn[0].toLocaleString() + "." + earn[1].substr(0, 6);
        }
      }
    },
  },
  methods: {
    async withdrawFarm() {
      await farming.withdrawFarm();
      let scope = this;
      setInterval(async function () {
        scope.$accessor.farm.getFarmingAccount();
        scope.$accessor.wallet.getLPBalance();
      }, 5000);
    },
  },
};
</script>
