<template>
  <div class="w-100">
    <div
      class="
        d-n-XS
        w-100
        fs-8-S fs-25-XS
        fw-600
        f-white-200
        pb-0-L pb-0-M pb-0-S pb-15-XS
        ta-l-S ta-c-XS
      "
    >
      <Balance />
    </div>
    <div
      class="
        w-100
        p-4-S p-10-XS
        mcolor-500
        rad-fix-3
        bs-sb-all
        mt-2-S mt-10-XS
        mb-2-S mb-10-XS
      "
      v-if="!withdrawOrDeposit"
    >
      <div
        class="
          w-100
          fs-7-M fs-6-S fs-20-XS
          fw-600
          f-white-200
          pb-5-M pb-6-S pb-10-XS
          fd-r
          ai-c
          pt-0
          jc-l-S jc-c-XS
        "
      >
        Rewards
        <Hint>
          ARP (Annual Percentage Rate) is just a simple interest that you will
          be receiving every year paid in the token of your choice. But the APR
          is subject to change and fluctuations. The “Monthly” and “Daily” are
          simply calculated to show how much you will be receiving at the term.
        </Hint>
      </div>
      <div
        class="
          w-100
          fs-6-S fs-20-XS
          f-white-200
          fd-r
          ai-b
          fd-600
          py-1
          pl-3-S pl-0
          jc-l-S jc-c-XS
          pb-1-S pb-10-XS
        "
      >
        <span class="f-mcolor-300 pr-2">{{ apr.toFixed(2) }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">32.50%</span> APR)</span
        >
      </div>
      <div
        class="
          w-100
          fs-6-S fs-20-XS
          f-white-200
          fd-r
          ai-b
          fd-600
          py-1
          pl-3-S pl-0
          jc-l-S jc-c-XS
          pb-1-S pb-10-XS
        "
      >
        <span class="f-mcolor-300 pr-2">{{ monthly.toFixed(2) }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">8.50%</span> Monthly)</span
        >
      </div>
      <div
        class="
          w-100
          fs-6-S fs-20-XS
          f-white-200
          fd-r
          ai-b
          fd-600
          py-1
          pl-3-S pl-0
          jc-l-S jc-c-XS
          pb-1-S pb-10-XS
        "
      >
        <span class="f-mcolor-300 pr-2">{{ daily.toFixed(2) }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">1.50%</span> Daily)</span
        >
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mb-4-S mb-10-XS"
    >
      <div
        class="
          w-100
          fs-7-L fs-7-M fs-6-S fs-40-XS
          fw-600
          f-white-200
          pb-5-S pb-15-XS
          ta-l-S ta-c-XS
        "
      >
        Your current Farmings
      </div>
      <!-- <div class="w-100 rad-fix-4 mcolor-700 p-2-M p-5-S p-20-XS"> -->
      <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Farming Date
        </div>
        <div class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          <span class="f-white-200 pl-1-S pl-5-XS">{{ getNow }}</span>
        </div>
      </div>
      <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Redemption Date
        </div>
        <div class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          <span class="f-white-200 pl-1-S pl-5-XS">{{ endDate }}</span>
        </div>
      </div>
      <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Deposited SOL
        </div>
        <div class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          {{ depositedSol }}
          <span class="f-white-200 pl-1-S pl-5-XS">GENS</span>
        </div>
      </div>
      <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Deposited HGEN
        </div>
        <div class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          {{ depositedHgen }}
          <span class="f-white-200 pl-1-S pl-5-XS">HGEN</span>
        </div>
      </div>
      <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Your Liquidity
        </div>
        <div class="w-a fs-4-S fs-15-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c">
          ({{ yourPercent
          }}<span class="f-white-200 pl-1-S pl-5-XS">%</span>)<span
            class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS pl-1-S pl-5-XS"
            >{{ yourAmount }}$</span
          >0
        </div>
      </div>
      <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
          Total Liquidity
        </div>
        <div
          class="w-a fs-4-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
        >
          {{ totalAmount }}
          <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span>0
        </div>
      </div>
      <!-- </div> -->
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          Current Earnings (<span class="f-mcolor-100 fw-600">SOL</span>)
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
        >
          <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span
          >{{ currentEarn }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import Balance from "@/components/my/pool/Balance.vue";
import Farming from "../../../utils/farming";
const farming = new Farming();
export default {
  data() {
    return {
      timestamp: "",
      endDate: "",
      depositedSol: 0,
      depositedHgen: 0,
      totalAmount: 0,
      day: 0,
      dayLeft: 0,
      daily: 0,
      monthly: 0,
      apr: 0,
      currentEarn: 0,
      yourAmount: 0,
      yourPercent: 0,
    };
  },
  mounted() {
    this.getInfo();
  },
  components: {
    Hint,
    Balance,
  },
  layout: "my",
  computed: {
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
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      return dateTime;
    },
  },
  methods: {
    getInfo: function () {
      // return this.$accessor.pool.rewardGensAmount;
      let scope = this;
      farming
        .getTotalAmount()
        .then((res) => [(scope.totalAmount = res)])
        .then((res) => {
          farming
            .getFarmingAccount()
            .then((res) => {
              console.log("res.depositedSol", res.depositedSol);
              scope.depositedSol = res.depositedSol;
              scope.depositedHgen = res.depositedHgen;
              scope.endDate = res.endDate;
              scope.day = res.dayLength;
              scope.dayLeft = res.dayLeft;
              scope.yourAmount = res.depositedSol;
              scope.yourPercent = (res.depositedSol / scope.totalAmount) * 100;
              let penalty = Math.pow(123 / 136, Math.log10(scope.depositedSol));
              let advantage = Math.pow(1.075, scope.day / 30);
              let outcome = penalty * advantage;
              scope.daily = (outcome * 1.5) / 2;
              scope.monthly = (outcome * 0.85) / 2;
              scope.apr = (outcome * 32.5) / 2;
              scope.currentEarn = scope.daily * (scope.day - scope.dayLeft);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
