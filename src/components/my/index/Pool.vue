<template>
  <div class="w-90-S w-100-XS h-100min fd-c l-0-S">
    <div
      class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-5-S pb-10-XS ta-c-XS"
    >
      Stake
    </div>
    <div class="w-100 fd-r ai-c">
      <div class="w-70-S w-50-XS">
        <div class="w-100 fs-6-S fs-20-XS f-gray-600 pb-2-S pb-10-XS fw-600">
          Your current pool share
        </div>
        <div class="w-100 fs-5-S fs-25-XS f-white-200">
          <span class="f-mcolor-100 fs-8-S fs-25-XS fw-900">{{
            getPercent
          }}</span>
          <span class="fs-8-S fs-25-XS fw-900 px-1">%</span>
          (<span class="f-mcolor-100 fw-800 pr-1">{{
            getDepositAmount.toLocaleString()
          }}</span>
          GENS)
        </div>
      </div>
      <div class="w-30-S w-50-XS pl-0-S pl-40-XS ta-r">
        <div class="w-100 fs-6-S fs-20-XS f-gray-600 pb-2-S pb-10-XS">APY</div>
        <div class="w-100 fs-8-S fs-25-XS fw-900 f-white-200">
          <span class="f-mcolor-100 mr-1">32.5</span>%
        </div>
      </div>
    </div>
    <div class="w-100 fd-r ai-c py-2-S py-10-XS my-2-S my-10-XS">
      <div class="w-100 fs-6-S fs-20-XS f-gray-600 fw-600">Total Deposited</div>
      <div class="w-45 fsh-0 fs-5-S fs-20-XS f-white-200 fw-600 ta-r">
        <span class="f-mcolor-100 pr-1-S pr-3-XS">{{
          getDepositeTotal.toLocaleString()
        }}</span>
        GENS
      </div>
    </div>
    <div class="w-100 fs-6-S fs-20-XS f-gray-600 pb-2-S pb-5-XS fw-600">
      Your current earnings
    </div>
    <div class="w-100 fd-r ai-c py-1-M py-2-S py-5-XS mt-0-S">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
        Liquidation Incentive
      </div>
      <div class="w-45 fs-5-S fs-20-XS fsh-0 f-white-200 fw-600 ta-r">
        <span class="f-mcolor-100 mr-1">{{ getCoin }}</span> SOL
      </div>
    </div>
    <div class="w-100 fd-r ai-c py-1-M py-2-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
        Transaction Fee
      </div>
      <div class="w-45 fs-5-S fs-20-XS fsh-0 f-white-200 fw-600 ta-r">
        <span class="f-mcolor-100 mr-1">{{ getGens }}</span> GENS
      </div>
    </div>
    <div class="w-100 fd-r ai-c py-1-M py-2-S py-5-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">Rewards</div>
      <div class="w-45 fs-5-S fs-20-XS fsh-0 f-white-200 fw-600 ta-r">
        <span class="f-mcolor-100 mr-1">{{ getHgen }}</span> HGEN
      </div>
    </div>
    <div class="w-45-S w-100-XS fsh-0 mt-3-S mt-10-XS fd-r jc-r">
      <AmButton
        :height="false"
        color="mcolor-200"
        bColor="mcolor-100"
        opacityEffect
        full
        @click="claimFunc"
        v-if="true"
      >
        claim
      </AmButton>
      <!-- <AmButton :height="false" color="gray-900" bColor="gray-900" colorText="gray-500" disabled full v-if="getDepositKey">
          claim
        </AmButton> -->
    </div>
    <div class="w-100 pt-8-S pt-20-XS pb-4-S pb-15-XS">
      <AmButton
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        full
        to="/my/pool"
      >
        GO
      </AmButton>
    </div>
    <div class="w-100 fs-4-M fs-6-S fs-20-XS f-white-200 pb-6-S pb-15-XS">
      You can earn <b>SOL</b>, <b>HGEN</b> and <b>GENS</b> coins.
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isBorrow() {
      return this.$accessor.dashboard.isBorrow;
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
    claimFunc() {
      if (this.getDepositKey) {
        this.$accessor.dashboard.claim();
      }
    },
  },
};
</script>
