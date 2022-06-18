<template>
  <div class="w-100 fd-c jc-c">
    <div class="w-100 fd-r jc-sb">
      <!-- <span class="fs-6 f-mcolor-100  ts-3 hv d-n-XS fsh-0">Close</span> -->
      <div
        class="w-80 fs-8-S fs-25-XS fw-600 f-white-200 pb-4-S pb-10-XS ta-l-S ta-l-XS"
      >
        Farm
      </div>
      <!-- <span
        class="fs-6-S fs-25-XS f-white-200  ts-3 hv fsh-0 ta-r-S"
        @click="closeList"
        v-if="getToggleValue"
        ><Tooltip placement="bottomRight"> Close </Tooltip></span
      > -->
      <span class="fs-6-S fs-25-XS f-white-200 ts-3 hv fsh-0 ta-r-S"
        ><Tooltip placement="bottomRight" class="f-green-600"> Open </Tooltip>
      </span>
    </div>
    <div class="w-100" v-if="getToggleValue">
      <div
        class="w-100 fs-6-S fs-20-XS fw-600 f-gray-600 pb-2-S pb-10-XS fd-r ai-c pt-0 jc-l-S jc-l-XS"
      >
        Your Current Farming
      </div>
      <div class="w-100">
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200">
            Farming Date
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ta-r"
          >
            <span class="f-white-200 pl-1-S pl-5-XS">{{ startDate }}</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Redemption Date
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            <span class="f-white-200 pl-1-S pl-5-XS">{{ endDate }}</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Lp Tokens
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            {{ yourAmount }}
            <span
              class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS pl-1-S pl-5-XS"
            ></span>
            ({{ yourPercent }}
            <span class="f-white-200 pl-1-S pl-5-XS">%</span>)
          </div>
        </div>
        <!-- <div class="w-100 fd-r pt-1-M pt-2-S pt-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Total Liquidity
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span>0
          </div>
        </div> -->
        <div class="w-100 fd-r py-2-S py-10-XS my-2-S my-10-XS">
          <div class="w-100 fs-6-S fs-20-XS fw-600 f-gray-600 fd-r ai-c">
            Current Earnings (<span class="f-mcolor-100 fw-600">SOL</span>)
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-green-600 fd-r ai-c"
          >
            <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span
            >{{ currentEarn }}
          </div>
        </div>
      </div>
      <!-- <div
        class="w-100 fs-6-S fs-20-XS fw-600 f-gray-600 pb-2-S pb-10-XS fd-r ai-c pt-0 jc-l-S jc-l-XS"
      >
        Rewards
        <Hint>
          ARP (Annual Percentage Rate) is just a simple interest that you will
          be receiving every year paid in the token of your choice. But the APR
          is subject to change and fluctuations. The “Monthly” and “Daily” are
          simply calculated to show how much you will be receiving at the term.
        </Hint>
      </div> -->
      <!-- <div
        class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-0 jc-l-S jc-l-XS pb-1-S pb-10-XS"
      >
        <span class="f-mcolor-300 pr-2">{{ getHgen }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">32.50%</span> APR)</span
        >
      </div>
      <div
        class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-0 jc-l-S jc-l-XS pb-1-S pb-10-XS"
      >
        <span class="f-mcolor-300 pr-2">{{ getHgen }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">32.50%</span> Monthly)</span
        >
      </div>
      <div
        class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-0 jc-l-S jc-l-XS pb-1-S pb-10-XS"
      >
        <span class="f-mcolor-300 pr-2">{{ getHgen }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">1.50%</span> Daily)</span
        >
      </div> -->

      <div class="w-100 pb-4-S pb-15-XS fd-c-L fd-r-S fd-c-XS">
        <div class="w-100 mr-0-L mr-2-S mr-0-XS mt-6-S pt-15-XS" v-if="true">
          <AmButton
            color="mcolor-100"
            bColor="mcolor-100"
            opacityEffect
            full
            to="/my/farming"
          >
            GO
          </AmButton>
        </div>
      </div>
      <!-- <div class="w-100 fs-6-S fs-20-XS fw-400 f-white-200 pb-6-S pb-15-XS">
      You will receive GENS stable coin.
    </div>
    <div class="w-100 fs-6-S fs-20-XS fw-400 f-white-200 pb-2-S pb-10-XS">
      current debt
    </div>
    <div class="w-100 fs-11-S fs-30-XS fw-700 f-white-200 pb-6-S pb-15-XS">
      $ 201,000
    </div>
    <div class="w-60">
      <AmButton color="white-200" bColor="white-100" colorText="mcolor-100" opacityEffect full to="/my">
        <span class="fw-800">Borrow</span>
      </AmButton>
    </div> -->
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import { Icon, Tooltip } from "ant-design-vue";
import Farming from "../../../utils/farming";
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
      currentEarn: 0,
      yourAmount: 0,
      yourPercent: 0,
      lpTokenType: "HS",
      open: true,
    };
  },
  mounted() {
    this.getInfo;
  },
  components: {
    Hint,
    Icon,
    Tooltip,
  },
  computed: {
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
    getPercent() {
      return Number.parseInt(
        (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) *
          100
      );
    },
    getCoin() {
      return this.$accessor.pool.rewardCoinAmount;
    },
    getGens() {
      return this.$accessor.pool.rewardGensAmount;
    },
    getHgen() {
      return this.$accessor.pool.rewardHgenAmount;
    },
    getNow() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      return dateTime;
    },
    getToggleValue() {
      return this.open;
    },
  },
  methods: {
    openList() {
      this.open = true;
    },
    closeList() {
      this.open = false;
      console.log(this.open);
    },
  },
};
</script>
