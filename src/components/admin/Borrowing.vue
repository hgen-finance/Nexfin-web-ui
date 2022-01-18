<template>
  <div class="container px-0-L px-4-M px-3-S px-3-XS m-0-auto">
    <div
      class="w-80-L w-90-M w-100-S gradient-200 rad-fix-8 p-6-M p-6-S p-6-XS m-0-auto br-mcolor-400 br-1 brs-"
    >
      <div class="fw-700 f-white-200 fs-10 mb-5">Borrowing</div>
      <div class="d-f fd-r">
        <div>
          <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">Total</div>
          <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
            Total Borrowing
          </div>
          <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
            Total Debt Ratio
          </div>
          <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
            Total Liquidation Mode
          </div>
        </div>
        <div>
          <div class="fw-600 fs-6 sub-mt-1">
            <span class="f-mcolor-500">{{ totalTroveList }}</span>
            <span class="f-white-200">MEMBERS</span>
          </div>
          <div class="fw-600 fs-6 sub-mt-1">
            <span class="f-mcolor-500">{{ troveTotal }}</span>
            <span class="f-white-200">GENS</span>
          </div>
          <div class="fw-600 fs-6 sub-mt-1">
            <span class="f-mcolor-500">{{ debtRatio }}</span>
            <span class="f-white-200">%</span>
          </div>
          <div class="fw-600 fs-6 sub-mt-1">
            <span v-if="!getLightMode" class="f-red-600">OFF</span>
            <span v-if="getLightMode" class="f-green-600">ON</span>
          </div>
        </div>
      </div>
      <div class="w-100 d-f fd-r-L fd-r-M fd-c-S fd-c-XS mt-8">
        <div class="w-33-L w-33-M w-100-S w-100-XS">
          <div class="fw-700 f-white-200 fs-8 mb-3">Total fees</div>
          <div class="d-f fd-r">
            <div>
              <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
                Borrowing Fee
              </div>
              <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
                Repaying Fee
              </div>
            </div>
            <div>
              <div class="fw-600 fs-6 sub-mt-1">
                <span class="f-mcolor-500">9.003</span>
                <span class="f-white-200">GENS</span>
              </div>
              <div class="fw-600 fs-6 sub-mt-1">
                <span class="f-mcolor-500">45645645</span>
                <span class="f-white-200">GENS</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-33-L w-33-M w-100-S w-100-XS mt-5-XS">
          <div class="fw-700 f-white-200 fs-8 mb-3">
            Total sharing in the pool
          </div>
          <div class="d-f fd-r">
            <div>
              <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
                Borrowing Fee
              </div>
              <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
                Repaying Fee
              </div>
            </div>
            <div>
              <div class="fw-600 fs-6 sub-mt-1">
                <span class="f-mcolor-500">9.003</span>
                <span class="f-white-200">GENS</span>
              </div>
              <div class="fw-600 fs-6 sub-mt-1">
                <span class="f-mcolor-500">45645645</span>
                <span class="f-white-200">GENS</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-33-L w-33-M w-100-S w-100-XS mt-5-XS">
          <div class="fw-700 f-white-200 fs-8 mb-3">Total earning</div>
          <div class="d-f fd-r">
            <div>
              <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
                Borrowing Fee
              </div>
              <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
                Repaying Fee
              </div>
            </div>
            <div>
              <div class="fw-600 fs-6 sub-mt-1">
                <span class="f-mcolor-500">9.003</span>
                <span class="f-white-200">GENS</span>
              </div>
              <div class="fw-600 fs-6 sub-mt-1">
                <span class="f-mcolor-500">45645645</span>
                <span class="f-white-200">GENS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getLightMode() {
      return this.$accessor.lightMode;
    },
    troveTotal() {
      return this.$accessor.troveTotal;
    },
    totalTroveList() {
      return this.$accessor.risky.troveTotal;
    },
    debtRatio() {
      return this.$accessor.debtRatio;
    },
  },
  mounted() {
    this.$accessor.risky.getTroveListAction({ page: 1, clear: true });
  },
};
</script>
