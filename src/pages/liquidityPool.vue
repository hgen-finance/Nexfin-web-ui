<template>
  <div class="w-90 w-100-XS fd-c ai-c">
    <div
      class="w-100-XS w-90-S br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 fd-c-XS ai-c jc-c mb-5-S mb-10-XS fd-r"
    >
      <div class="fw-600 f-cyan-1500 mr-3-S">$GENS</div>
      <div class="f-white-200 fs-5-S">
        GENS is a stable coin of HGEN platform designed to be pegged to USD.
        <br />
        GENS is main currency for our borrowing and lending protocol.
      </div>
    </div>
    <div class="w-100 px-10-S px-0-XS ">
      <div class="w-100">
        <div class="w-100 fd-r jc-sb ai-c my-3-S">
          <div class="fs-10-S f-white-200 ai-s br-mcolor-400 rad-fix-5 fw-600">
            <span class="hv d-n-XS fsh-0" @click="showPoolUI"> POOLS </span>
            <!-- |
          <span class="hv d-n-XS fsh-0" @click="showMyPoolUI"> My pool </span> -->
          </div>
          <div class="fd-r buttons">
            <Tooltip>
              <Icon
                type="search"
                :style="{ width: '40px', height: '40px' }"
                class="fd-r jc-c ai-c f-white-200"
              />
            </Tooltip>
            <Tooltip>
              <Icon
                type="sync"
                :style="{ width: '40px', height: '40px' }"
                class="fd-r jc-c ai-c f-white-200"
                :rotate="135"
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <ListPool v-if="poolUI" />
      <MyPool v-if="!poolUI" />
    </div>
  </div>
</template>
<script>
import Loading from "@/components/Loading";
import ListPool from "@/components/my/liquidityPool/ListPool.vue";
import MyPool from "@/components/my/liquidityPool/MyPool.vue";

import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

export default {
  components: {
    Loading,
    Tooltip,
    Icon,
    ListPool,
    MyPool,
  },
  layout: "my",
  computed: {
    getPoolInfo() {
      return {
        tokenAmountA: this.$accessor.swapPool.tokenAmountA || 0,
        tokenAmountB: this.$accessor.swapPool.tokenAmountB || 0,
      };
    },
  },
  data() {
    return {
      headers: ["Pool name", "Token A", "Token B", "Liquidity"],
      pools: ["GENS-HGEN", "GENS-SOL"],
      poolUI: true,
    };
  },
  watch: {},
  methods: {
    createSwapPool() {
      //   this.$accessor.swapPool.createTokenSwapPool();
    },
    showPoolUI() {
      this.poolUI = true;
    },
    showMyPoolUI() {
      this.poolUI = false;
    },
  },
  mounted() {},
};
</script>
<style scoped>
.ft-h {
  height: fit-content;
}

.inner {
  border: 3px solid #151441;
}

.select-pool:hover {
  background: rgba(18, 17, 45, 1);
  transition: ease-in 300ms;
}
</style>
