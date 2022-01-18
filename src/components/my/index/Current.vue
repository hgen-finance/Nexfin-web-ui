<template>
  <div class="w-100">
    <div class="w-100" :class="{ 'op-0': getLoading }">
      <div
        class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-2-S pb-10-XS ta-l-L ta-c-S ta-c-XS"
      >
        Your current earnings
      </div>
      <div class="w-100 fd-r ai-c mt-0-S mt-5-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 py-6-S py-15-XS">
          Safe pool
        </div>
        <div class="w-45 fsh-0">
          <AmButton
            :height="false"
            color="mcolor-200"
            bColor="mcolor-100"
            opacityEffect
            full
            @click="claimFunc"
            v-if="getDepositKey"
          >
            claim
          </AmButton>
          <AmButton
            :height="false"
            color="gray-900"
            bColor="gray-900"
            colorText="gray-500"
            disabled
            full
            v-if="!getDepositKey"
          >
            claim
          </AmButton>
        </div>
      </div>
      <div class="w-100 fd-r ai-c py-2-S py-5-XS mt-0-S mt-10-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
          Liquidation Incentive
        </div>
        <div class="w-45 fs-5-S fs-20-XS fsh-0 f-white-200 fw-600">
          <span class="f-mcolor-100 mr-1">{{ getCoin }}</span> SOL
        </div>
      </div>
      <div class="w-100 fd-r ai-c py-2-S py-5-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">
          Transaction Fee
        </div>
        <div class="w-45 fs-5-S fs-20-XS fsh-0 f-white-200 fw-600">
          <span class="f-mcolor-100 mr-1">{{ getGens }}</span> GENS
        </div>
      </div>
      <div class="w-100 fd-r ai-c py-2-S py-5-XS">
        <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200">Rewards</div>
        <div class="w-45 fs-5-S fs-20-XS fsh-0 f-white-200 fw-600">
          <span class="f-mcolor-100 mr-1">{{ getHgen }}</span> HGEN
        </div>
      </div>
    </div>
    <div class="w-100 h-100 p-a l-0 t-0 fd-r ai-c jc-c" v-if="getLoading">
      <Loading />
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import {
  DEPOSIT_ACCOUNT_DATA_LAYOUT,
  DepositLayout,
} from "../../../utils/layout";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

export default {
  components: {
    Loading,
  },
  props: {
    depositKey: { type: String, default: null },
    deposit: { type: DEPOSIT_ACCOUNT_DATA_LAYOUT, default: {} },
  },
  computed: {
    getLoading() {
      return this.$accessor.dashboard.loading;
    },
    getDepositKey() {
      return this.$accessor.pool.depositKey;
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
