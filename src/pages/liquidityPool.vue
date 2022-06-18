<template>
  <div class="w-90 p-5-S p-10-XS mcolor-500 rad-fix-8 bs-sb-all ft-h inner">
    <div class="w-100">
      <div class="w-100 fd-r jc-sb ai-c my-3-S">
        <div class="fs-4-S f-white-200 ai-s br-mcolor-400 rad-fix-5">
          <span class="hv d-n-XS fsh-0" @click="showPoolUI"> Pools </span>
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
