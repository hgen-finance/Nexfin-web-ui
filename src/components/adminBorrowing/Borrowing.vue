<template>
  <div class="w-100 px-0-L px-4-M px-3-S px-3-XS m-0-auto">
    <div class="fw-700 f-white-200 fs-10 mb-5">Borrowing</div>
    <div class="d-f fd-r">
      <div>
        <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">Total</div>
        <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">Total Borrowing</div>
        <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
          Total Debt Ratio
        </div>
        <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">
          Total Liquidation Mode
        </div>
      </div>
      <div>
        <div class="fw-600 fs-6 sub-mt-1">
          <span class="f-mcolor-500">9.003</span>
          <span class="f-white-200">MEMBERS</span>
        </div>
        <div class="fw-600 fs-6 sub-mt-1">
          <span class="f-mcolor-500">45645645</span>
          <span class="f-white-200">GENS</span>
        </div>
        <div class="fw-600 fs-6 sub-mt-1">
          <span class="f-mcolor-500">9.003</span>
          <span class="f-white-200">%</span>
        </div>
        <div class="fw-600 fs-6 f-red-600 sub-mt-1">
          <span>OFF</span>
        </div>
      </div>
    </div>
    <div class="d-f fd-r jc-sb mt-6">
      <div class="w-35">
        <SimpleInput label="How many percentage to the pool share?" />
      </div>
      <div class="w-35">
        <SimpleInput label="Fee" />
      </div>
      <div class="w-20">
        <SimpleRadio label="Total Liquidation Mode" :options="['OFF', 'ON']" />
      </div>
    </div>
    <div class="w-100 mt-2">
      <AmButton color="mcolor-100" opacityEffect :full="true">
        Confirm
      </AmButton>
    </div>
  </div>
</template>

<script>
import SimpleInput from "@/components/common/form-elements/input-text/SimpleInput.vue";
import SimpleRadio from "@/components/common/form-elements/input-select/SimpleRadio.vue";

export default {
  components: {
    SimpleInput,
    SimpleRadio,
  },
};
</script>
