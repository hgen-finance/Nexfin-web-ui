<template>
  <div class="w-100">
    <div
      class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-4-S pb-10-XS ta-c-XS "
    >
      Borrow
    </div>

    <div class="w-100 fs-6-S fs-20-XS f-gray-600 pb-3-S pb-10-XS fw-600">
      Your Current Debt
    </div>
    <div class="w-100 fs-6-S fs-20-XS f-white-200 pb-4-S pb-20-XS">
      <span class="fs-8-S fs-25-XS fw-800 f-mcolor-100">{{
        getDebt.toLocaleString()
      }}</span>
      <span class="fs-8-S fs-25-XS fw-600 px-1-S px-3-XS">GENS</span>
      (
      <span class="f-mcolor-100 fw-800 pr-1-S pr-3-XS"
        >{{ getCollateral }}%</span
      >
      Collateral )
    </div>
    <div class="w-100 fd-r ai-c py-1-M py-2-S py-10-XS">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
        Total Borrowing
      </div>
      <div
        class="w-45 fsh-0 fs-5-S fs-20-XS f-white-200 fw-600 ta-r"
        :title="getTotalDebt.toLocaleString()"
      >
        <span class="f-mcolor-100 pr-1-S pr-3-XS"
          >{{
            getTotalDebt
              .toLocaleString()
              .toString()
              .slice(0, 10)
          }}{{ getTotalDebt.toString().length > 10 ? "... " : " " }}</span
        >
        GENS
      </div>
    </div>
    <div class="w-100 fd-r ai-c py-1-M py-2-S py-10-XS" v-if="true">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
        Total Collateral Ratio
      </div>
      <div class="w-45 fsh-0 fs-5-S fs-20-XS f-white-200 fw-600 ta-r">
        <span class="f-mcolor-100">320</span> %
      </div>
    </div>
    <div class="w-100 fd-r ai-c py-1-M py-2-S py-10-XS" v-if="true">
      <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
        Total Liquidation Mode
      </div>
      <div class="w-45 fsh-0 fs-5-S fs-20-XS f-white-200 fw-600 ta-r">
        <span class="f-red-700 pl-1-S pl-5-XS">OFF</span>
      </div>
    </div>

    <div class="w-100 pb-4-S pb-15-XS fd-c-L fd-r-S fd-c-XS">
      <div class="w-100 mr-0-L mr-2-S mr-0-XS mt-6-S pt-15-XS" v-if="!isBorrow">
        <AmButton
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          full
          to="/my/borrowing"
        >
          GO
        </AmButton>
      </div>
      <div class="w-100 ml-0-L ml-2-S ml-0-XS" v-if="isBorrow">
        <AmButton
          color="mcolor-200"
          bColor="mcolor-100"
          opacityEffect
          full
          to="/my/borrowing"
        >
          pay debt
        </AmButton>
      </div>
    </div>
    <div class="w-100 fs-4-M fs-6-S fs-20-XS f-white-200 pb-6-S pb-15-XS">
      You will receive GENS stable coin.
    </div>
  </div>
</template>

<script>
import { getCollateral } from "../../../utils/layout";

export default {
  computed: {
    isBorrow() {
      return this.$accessor.dashboard.isBorrow;
    },
    getDebt() {
      console.log(this.$accessor.borrowing.trove);
      return this.$accessor.borrowing.trove.borrowAmount || "0";
    },
    getBalanceHGEN() {
      return this.$accessor.wallet.balanceHGEN || 0;
    },
    getBalanceGENS() {
      return this.$accessor.wallet.balanceGENS || 0;
    },

    getTotalDebt() {
      return this.$accessor.troveTotal;
    },
    getCollateral() {
      return this.$accessor.borrowing.trove.borrowAmount
        ? getCollateral(
            this.$accessor.borrowing.trove.borrowAmount.toString(),
            this.$accessor.borrowing.trove.lamports.toString(),
            parseInt(this.$accessor.usd.toString())
          )
        : 0;
    }
  }
};
</script>
