<template>
  <div class="w-100">
    <div class="w-100 fd-r ai-s">
      <div class="w-100 fd-r ai-s mcolor-700 rad-fix-9 gradient-200">
        <div
          class="d-i fs-5 f-white-200 ta-c px-1 py-2 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100"
          v-for="(header, h) in headers"
          :key="h"
        >
          <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-600">
            {{ header }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="getPoolInfo.tokenAmountA == 0">
      <div
        class="w-100 h-100 fd-c ai-c jc-c ta-c fw-600 fs-5-S f-gray-500 mt-4-S"
      >
        Pool is empty
        <!-- <span
          class="fs-3-S fs-4-M px-1-S py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
          style="align-self: center"
          v-if="true"
          @click="createSwapPool"
        >
          + Create Pool
        </span> -->
      </div>
    </div>
    <div v-if="getPoolInfo">
      <div
        class="w-100 fd-r ai-s br-t-4 br-mcolor-400 select-pool hv mt-4-S mt-5-XS rad-fix-9"
        v-for="(pool, p) in pools"
        :key="p"
      >
        <div
          class="d-i fs-5 ta-c px-1 py-3 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
        >
          <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400 fw-600">
            {{ pool }}
          </div>
        </div>
        <div
          class="d-i fs-5 ta-c px-1 py-3 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
        >
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400"
            v-if="pool == 'GENS-HGEN'"
          >
            {{ getPoolInfo.tokenAmountA || 0 }}
          </div>
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400"
            v-if="pool == 'GENS-SOL'"
          >
            {{ getPoolInfo.tokenAmountGensGS || 0 }}
          </div>
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400"
            v-if="pool == 'HGEN-SOL'"
          >
            {{ getPoolInfo.tokenAmountHgenHS || 0 }}
          </div>
        </div>
        <div
          class="d-i fs-5 ta-c px-1 py-3 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
        >
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400"
            v-if="pool == 'GENS-HGEN'"
          >
            {{ getPoolInfo.tokenAmountB || 0 }}
          </div>
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400"
            v-if="pool == 'GENS-SOL'"
          >
            {{ getPoolInfo.tokenAmountSOLGS || 0 }}
          </div>
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400"
            v-if="pool == 'HGEN-SOL'"
          >
            {{ getPoolInfo.tokenAmountSOLHS || 0 }}
          </div>
        </div>
        <div
          class="d-i fs-5 ta-c px-1 py-3 br-r-4 br-mcolor-400 fd-r ai-c jc-c w-100 f-mcolor-300"
        >
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-600"
            v-if="pool == 'GENS-HGEN'"
          >
            {{
              getPoolInfo.tokenAmountA +
                getPoolInfo.tokenAmountB *
                  (getPoolInfo.tokenAmountA / getPoolInfo.tokenAmountB) || 0
            }}
          </div>

          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-600"
            v-if="pool == 'GENS-SOL'"
          >
            {{
              getPoolInfo.tokenAmountGensGS +
                getPoolInfo.tokenAmountSOLGS *
                  (getPoolInfo.tokenAmountGensGS /
                    getPoolInfo.tokenAmountSOLGS) || 0
            }}
          </div>
          <div
            class="w-100 h-100 fd-r ai-c jc-c ta-c fw-600"
            v-if="pool == 'HGEN-SOL'"
          >
            {{
              (getPoolInfo.tokenAmountHgenHS / getPoolInfo.tokenAmountSOLHS) *
                getPoolInfo.tokenAmountSOLHS +
                getPoolInfo.tokenAmountHgenHS || 0
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

export default {
  components: {
    Loading,
    Tooltip,
    Icon,
  },
  layout: "my",
  computed: {
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getPoolInfo() {
      return {
        tokenAmountA: this.$accessor.swapPool.tokenAmountA || 0,
        tokenAmountB: this.$accessor.swapPool.tokenAmountB || 0,
        tokenAmountGensGS: this.$accessor.swapPool.tokenAmountGensGS || 0,
        tokenAmountSOLGS: this.$accessor.swapPool.tokenAmountSOLGS || 0,
        tokenAmountHgenHS: this.$accessor.swapPool.tokenAmountHgenHS || 0,
        tokenAmountSOLHS: this.$accessor.swapPool.tokenAmountSOLHS || 0,
      };
    },
  },
  data() {
    return {
      headers: ["Pool name", "Token A", "Token B", "Liquidity"],
      pools: ["GENS-HGEN", "GENS-SOL", "HGEN-SOL"],
    };
  },
  watch: {},
  methods: {
    createSwapPool() {
      this.$accessor.swapPool.createTokenSwapPool();
    },
  },
  mounted() {
    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();
  },
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
