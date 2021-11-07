<template>
  <div class="container pt-0-L pt-0-M pt-10-S pt-40-XS">
    <div
      class="w-100 f-white-200 tt-u fs-14-S fs-25-XS fw-600 ta-c px-10-XS fd-r jc-c ai-c"
    >
      <img
        src="@/assets/svg/company_logo.png"
        class="h-fix-20-M h-fix-30-S h-fix-55-XS mr-2-M mr-3-S mr-3-XS"
      />
      <img
        src="@/assets/svg/nexfin-logo.png"
        class=" h-fix-10-M h-fix-15-S h-fix-30-XS mr-2 ml-5-XS"
      />
    </div>
    <div
      class="w-100 gradient tt-u fs-20-S fs-25-XS fw-900 ta-c pt-4-S pt-15-XS"
    >
      $ {{ getTotal }}
    </div>
    <div class="w-100 f-gray-400 ta-c fs-6-S fs-15-XS fw-500">
      Total Deposited Value at GENS
    </div>
    <div class="w-100 fd-r jc-c">
      <div class="w-100-L w-100-M w-50-S w-50-XS fd-r jc-c">
        <AmButton
          color="mcolor-100"
          class="mt-3-L mt-3-M mt-8-S mt-8-XS"
          opacityEffect
          scaleEffect
          :full="mobile"
          @click="$emit('connect', 'connect')"
          v-if="!publicKey"
        >
          Launch App
        </AmButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobile: false
    };
  },
  props: {
    publicKey: { type: String, default: null }
  },
  computed: {
    getTotal() {
      let res = "000000000000";
      const total = this.$accessor.totalDeposit;
      if (total) {
        res = res.substr(0, res.length - total.toString().length) + total;
      }
      return res.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
    }
  }
};
</script>
