<template>
  <div class="w-75-S w-100-XS">
    <div
      class="w-100 f-mcolor-300 fw-800 fs-15-S fs-30-XS ta-c pt-20-XS pb-1-S pb-3-XS"
    >
      <span class="f-white-200 pr-3">$</span>{{ getTotal }}
    </div>
    <div class="w-100 f-white-200 fw-400 fs-6-S fs-20-XS ta-c pb-10-S pb-30-XS">
      Total Deposited Value (Total Value Locked)
    </div>
    <div class="w-100 fd-r-S fd-c-XS ai-s jc-sb">
      <div class="w-45-S w-100-XS br-6 gradient-200 rad-fix-8 p-6-S p-20-XS">
        <Borrowing />
      </div>
      <div
        class="w-45-S w-100-XS gradient-200 rad-fix-8 p-6-S p-20-XS fsh-0 mt-20-XS"
      >
        <Pool />
      </div>
    </div>
    <!-- <div class="w-100 f-mcolor-300 fw-800 fs-15-S fs-35-XS ta-c pt-12-S pt-30-XS pb-2-S pb-5-XS">
      <span class="f-white-200 pr-3">$</span>{{ getTotal }}
    </div>
    <div class="w-100 f-white-200 fw-400 fs-6-S fs-25-XS ta-c pb-10-S pb-30-XS">
      Total Deposited Value (Total Value Locked)
    </div> -->
    <div class="w-100 fd-r-S fd-c-XS ai-s">
      <!-- <div class="w-50-S w-100-XS br-6 brs-s br-mcolor-300 shadow-purple-100 p-6-S p-20-XS rad-fix-8-S rad-fix-20-XS mr-2-S">
        <Current />
      </div> -->
      <div
        class="w-45-S w-100-XS gradient-200 p-6-S p-20-XS rad-fix-8-S rad-fix-20-XS  mt-12-S mt-20-XS"
      >
        <Farming />
        <!-- <img src="@/static/my-farming.png" class="h-100 p-a r-0 t-0" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Current from "@/components/my/index/Current";
import Farming from "@/components/my/index/Farming";
import Borrowing from "@/components/my/index/Borrowing";
import Pool from "@/components/my/index/Pool";

export default {
  components: {
    Current,
    Farming,
    Borrowing,
    Pool
  },
  layout: "my",
  computed: {
    getTotal() {
      let res = "000000000000";
      const total = Number(this.$accessor.troveTotal);
      if (total) {
        if (total > 999999999999) {
          res = 999999999999;
        } else {
          res = res.substr(0, res.length - total.toString().length) + total;
        }
      }
      return res.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
    }
  }
};
</script>
