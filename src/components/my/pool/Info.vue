<template>
  <div class="w-100">
    <div
      class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS mb-2-S mb-10-XS"
    >
      <Balance />
    </div>
    <div
      class="w-100 p-4-S p-10-XS  rad-fix-3 mt-5-S  mb-4-S mb-10-XS"
    >
      <div class="w-100">
        <div
          class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 mt-2-S mt-5-XS mb-2-S mb-5-XS brbs-s pb-2-S br-gray-800"
        >
          GENS Total Staking of Platform
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Total Staking
          </div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-400 f-white-200 fd-r ai-c"
          >
            {{ getTotalStake }}
            <span class="f-white-200 pl-1-S pl-5-XS">GENS</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS  rad-fix-3  mb-2-S mb-10-XS "
    >
      <div class="w-100 fd-r py-2-S py-10-XS brbs-s brts-s brb-3 brt-3 br-gray-800">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          Pool share
          <Hint> Percentage of Pool share. </Hint>
        </div>
        <div
          class="w-a fs-8-M fs-10-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
        >
          {{ getPercent }}
          <span class="f-white-200 pl-1-S pr-5-XS">%</span>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS  rad-fix-3  mb-2-S mb-10-XS "
    >
      <div
        class="w-100 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 mb-3-M mb-3-S pb-2-M pb-2-S pb-30-XS ta-l-S ta-c-XS brbs-s br-gray-800"
      >
        Your current earnings
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          Liquidation Incentive
          <Hint> An incentive from borrower’s liquidation. </Hint>
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
        >
          <span class="f-cyan-1500 pr-2">{{ getCoin }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">SOL</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          Transaction Fee
          <Hint> Transaction fee of Borrowing.</Hint>
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
        >
          <span class="f-cyan-1500 pr-2">{{ getRewardToken }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">GENS</span>
        </div>
      </div>
      <!-- <div
        class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 pb-2-S pb-10-XS fd-r ai-c pt-3 jc-l-S jc-c-XS"
      >
        Rewards
        <Hint>
          ARP (Annual Percentage Rate) is just a simple interest that you will
          be receiving every year paid in the token of your choice. But the APR
          is subject to change and fluctuations. The “Monthly” and “Daily” are
          simply calculated to show how much you will be receiving at the term.
        </Hint>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <span class="fs-5-S fs-20-XS pl-2"
            ><span class="f-white-200">32.50%</span> APR</span
          >
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
        >
          <span class="f-mcolor-300 pr-2">{{ getHgen }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">HGEN</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <span class="fs-5-S fs-20-XS pl-2"
            ><span class="f-white-200">32.50%</span> Monthly</span
          >
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
        >
          <span class="f-mcolor-300 pr-2">{{ getHgen }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">HGEN</span>
        </div>
      </div>
      <div class="w-100 fd-r py-2-S py-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <span class="fs-5-S fs-20-XS pl-2"
            >(<span class="f-white-200">1.50%</span> Daily)</span
          >
        </div>
        <div
          class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
        >
          <span class="f-mcolor-300 pr-2">{{ getHgen }}</span>
          <span class="f-white-200 pl-1-S pr-5-XS">HGEN</span>
        </div>
      </div> -->
      <div class="my-5-S my-10-XS">
        <AmButton
          color="gradient-5002"
          bColor="gradient-5002"
          opacityEffect
          full
          v-if="true"
          @click="withdrawReward()"
          class="rad-fix-15"
        >
          Withdraw
        </AmButton>
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import Balance from "@/components/my/pool/Balance.vue";

export default {
  components: {
    Hint,
    Balance,
  },
  layout: "my",
  computed: {
    getTotalStake() {
      return Number(this.$accessor.totalDeposit).toFixed(2) || "0.00";
    },
    getPercent() {
      return this.$accessor.pool.depositAmount
        ? Number(
            (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit) *
              100
          ).toFixed(2)
        : 0;
    },
    getRewardToken() {
      return this.$accessor.pool.rewardGensAmount / 100 || 0;
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
  },
  methods: {
    withdrawReward() {
      console.log("clicked on claim reward");
      this.$accessor.pool.claimDepositReward();
    },
  },
  mounted() {
    this.$accessor.pool.onDepositChange(); // for handling subscription to account change in deposit
  },
};
</script>
