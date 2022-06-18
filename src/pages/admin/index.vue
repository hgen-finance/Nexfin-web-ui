<template>
  <div class="w-100 fd-c jc-c pt-10 pb-10">
    <div class="container w-100 pt-10 px-0-L px-4-M px-3-S px-3-XS">
      <div class="w-100 f-white-200 tt-u fs-19-M fs-15-S fs-8-XS fw-600 ta-c">
        TOTAL DEPOSITED VALUE AT HGEN
      </div>
      <div
        class="w-100 f-white-200 tt-u fs-19-M fs-18-S fs-9-XS fw-800 ta-c pt-8-S pt-4-XS"
      >
        $
        <span class="gradient">{{ getTotal }}</span>
        (<span class="gradient">{{ getTotalAll / getUsd }}</span> SOL)
      </div>
    </div>
    <div
      class="container w-100 my-10-L my-10-M my-10-S my-10-XS px-3-S px-3-XS"
    >
      <div class="d-f fd-c-XS fd-c-S fd-r-L fd-r-M jc-c">
        <template v-for="(mp, index) in marketPrice">
          <MarketPrice
            :key="mp.token"
            :marketPrice="mp"
            :class="{ 'ml-4-L ml-4-M ml-0-S ml-0-XS': index !== 0 }"
          />
        </template>
      </div>
    </div>
    <Borrowing />

    <div
      class="container d-f fd-c jc-c ai-c mt-10 w-40-L w-40-M w-90-S w-90-XS m-0-auto ta-c"
    >
      <div class="f-white-200 fw-600 fs-7">Farming Lock up option</div>
      <a
        href="#"
        class="fw-400 fs-6-L fs-6-M fs-6-S fs-6-XS td-u f-mcolor-300 wb-br-all mt-3"
      >
        https://docs.liquity.org/faq/stability-pool-and-liquidations#what-happens-if-the-stability-pool-is-empty-when-liquidations-occur
      </a>
      <div class="f-white-200 fw-600 fs-7 mt-3">
        On price stability of Liquity (LUSD)
      </div>
      <a
        href="#"
        class="fw-400 fs-6-L fs-6-M fs-6-S fs-6-XS td-u f-mcolor-300 wb-br-all mt-3"
      >
        https://medium.com/liquity/on-price-stability-of-liquity-64ce8420f753
      </a>
    </div>
  </div>
</template>

<script>
import MarketPrice from "@/components/admin/MarketPrice.vue";
import Borrowing from "@/components/admin/Borrowing.vue";
import { mapGetters } from "vuex";

export default {
  layout: "admin",
  components: {
    MarketPrice,
    Borrowing,
  },
  computed: {
    ...mapGetters({ marketPrice: "admin/getMarketPrice" }),
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getTotalAll() {
      return Number(this.$accessor.totalDeposit);
    },
    getTotal() {
      let res = "000000000000";
      const total = Number(this.$accessor.totalDeposit);
      if (total) {
        if (total > 999999999999) {
          res = 999999999999;
        } else {
          res = res.substr(0, res.length - total.toString().length) + total;
        }
      }
      return res.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
    },
  },
};
</script>
