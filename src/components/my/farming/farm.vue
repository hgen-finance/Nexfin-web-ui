<template>
  <div class="w-100 br-6 gradient-200 rad-fix-8 p-8-S p-20-XS">
    <div class="w-100" :class="{ 'op-0': getLoading }">
      <div class="w-100 fd-r">
        <!-- <span class="fs-6 f-mcolor-100  ts-3 hv d-n-XS fsh-0">Close</span> -->
        <div
          class="w-80 fs-8-S fs-25-XS fw-600 f-white-200 pb-4-S pb-10-XS ta-l-S ta-l-XS"
        >
          Farms
        </div>
        <span
          class="w-20 fs-6-S fs-25-XS f-mcolor-100  ts-3 hv fsh-0 ta-r-S"
          @click="closeList"
          v-if="getToggleValue"
          >Close</span
        >
        <span
          class="w-20 fs-6-S fs-25-XS f-mcolor-100  ts-3 hv fsh-0 ta-r-S"
          @click="openList"
          v-if="!getToggleValue"
          >Open</span
        >
      </div>
      <div class="w-100" v-if="getToggleValue">
        <div
          class="w-100 fs-5-S fs-20-XS f-gray-500 pb-2-S pb-10-XS ta-c-XS jc-c-XS fd-r"
          v-if="getDepositKey"
        >
          <div class="fd-r ai-c">
            <span class="fw-600"
              ><img
                src="@/assets/svg/sol-logo.png"
                class="h-fix-10-S h-fix-55-XS mr-2"
              />
            </span>
            <span>
              SOL
            </span>
          </div>

          <span
            class="fw-600 fs-6-L fs-5-S fs-20-XS f-mcolor-100 mr-2 ml-2 my-10-XS ml-10-XS mr-10-XS"
            >:</span
          >

          <div class="fd-r ai-c">
            <span class="fw-600"
              ><img
                src="@/assets/svg/symbol-hgen.png"
                class="h-fix-10-S h-fix-55-XS mr-2"
            /></span>
            <span>
              HGEN
            </span>
          </div>
        </div>
        <div
          class="w-100 my-2-S my-10-XS mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
          v-if="getDepositKey"
        >
          <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">
            Set amount you want to deposit
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >SOL</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300"
              placeholder="0.0000"
              v-model="from"
              maxlength="12"
            />
            <span class="fs-6 f-mcolor-100 td-u ts-3 hv d-n-XS fsh-0">Max</span>
          </div>
        </div>
        <div
          class="w-100 my-2-S my-10-XS mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
          v-if="getDepositKey"
        >
          <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">
            Set amount you want to deposit
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >HGEN</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300"
              placeholder="0"
              v-model="to"
            />
            <span class="fs-6 f-mcolor-100 td-u ts-3 hv d-n-XS fsh-0">Max</span>
          </div>
        </div>
        <div
          class="w-100 my-2-S my-10-XS mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
          v-if="getDepositKey"
        >
          <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">
            Set farming duration
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >DAY</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300"
              placeholder="0"
            />
            <!-- <span class="fs-6 f-mcolor-100 ts-3 hv d-n-XS fsh-0">Day</span> -->
          </div>
        </div>
        <div class="w-100 fd-r-S fd-c-XS pt-4-S pt-20-XS" v-if="getDepositKey">
          <div class="w-50-S w-100-XS mr-2-S mr-0-XS">
            <AmButton
              color="mcolor-200"
              bColor="mcolor-100"
              opacityEffect
              full
              v-if="getDepositKey"
            >
              cancel
            </AmButton>
          </div>
          <div
            class="w-50-S w-100-XS ml-2-S ml-0-XS mt-0-S mt-4-XS mt-0-S mt-10-XS"
          >
            <AmButton
              color="mcolor-100"
              bColor="mcolor-100"
              opacityEffect
              full
              v-if="getDepositKey"
            >
              confirm
            </AmButton>
          </div>
        </div>
      </div>
      <div class="w-100 h-100 p-a l-0 t-0 fd-r ai-c jc-c" v-if="getLoading">
        <Loading />
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  data() {
    return {
      gen: "",
      hgen: "",
      from: null,
      to: null,
      open: true
    };
  },
  computed: {
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getDepositKey() {
      return true;
      // return this.$accessor.pool.depositKey
    },
    getLoading() {
      return this.$accessor.pool.loading;
    },
    getDepositAmount() {
      return this.$accessor.pool.depositAmount;
    },
    getPercent() {
      return Number.parseInt(
        (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) *
          100
      );
    },
    getDepositeTotal() {
      return this.$accessor.totalDeposit || 0;
    },
    getToggleValue() {
      return this.open;
    }
  },
  watch: {},
  methods: {
    reset() {
      this.from = null;
      this.to = null;
    },
    farmFunc() {},
    openList() {
      this.open = true;
    },
    closeList() {
      this.open = false;
    }
  }
};
</script>
