<template>
  <div class="w-100 h-100min fd-c jc-c">
    <div class="w-100 fd-r jc-sb">
      <!-- <span class="fs-6 f-mcolor-100  ts-3 hv d-n-XS fsh-0">Close</span> -->
      <div
        class="w-80 fs-8-S fs-25-XS fw-600 f-white-200 pb-4-S pb-10-XS ta-l-S ta-l-XS"
      >
        Farms
      </div>
      <!-- <span
        class="fs-6-S fs-25-XS f-white-200  ts-3 hv fsh-0 ta-r-S"
        @click="closeList"
        v-if="getToggleValue"
        ><Tooltip placement="bottomRight"> Close </Tooltip></span
      > -->
      <span class="fs-6-S fs-25-XS f-white-200 ts-3 hv fsh-0 ta-r-S"
        ><Tooltip placement="bottomRight" class="f-green-600"> Open </Tooltip>
      </span>
    </div>
    <div class="w-100" v-if="getToggleValue">
      <div
        class="w-100 fs-6-S fs-20-XS fw-600 f-gray-600 pb-2-S pb-10-XS fd-r ai-c pt-0 jc-l-S jc-l-XS"
      >
        Your Current Farming
      </div>
      <div class="w-100">
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200">
            Farming Date
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ta-r"
          >
            <span class="f-white-200 pl-1-S pl-5-XS">{{ getNow }}</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Redemption Date
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            <span class="f-white-200 pl-1-S pl-5-XS">{{ getNow }}</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Deposited SOL
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            0 <span class="f-white-200 pl-1-S pl-5-XS">GENS</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Deposited HGEN
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            0 <span class="f-white-200 pl-1-S pl-5-XS">HGEN</span>
          </div>
        </div>
        <div class="w-100 fd-r py-1-M py-2-S py-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Your Liquidity
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            (0<span class="f-white-200 pl-1-S pl-5-XS">%</span>)<span
              class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS pl-1-S pl-5-XS"
              >$</span
            >0
          </div>
        </div>
        <div class="w-100 fd-r pt-1-M pt-2-S pt-10-XS">
          <div
            class="w-100 fs-5-M fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c"
          >
            Total Liquidity
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-mcolor-100 fd-r ai-c"
          >
            <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span>0
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS my-2-S my-10-XS">
          <div class="w-100 fs-6-S fs-20-XS fw-600 f-gray-600 fd-r ai-c">
            Current Earnings (<span class="f-mcolor-100 fw-600">SOL</span>)
          </div>
          <div
            class="w-a fs-5-M fs-5-S fs-20-XS fsh-0 fw-600 f-green-600 fd-r ai-c"
          >
            <span class="f-white-200 pr-1-L pr-1-M pr-1-S pr-5-XS">$</span>0
          </div>
        </div>
      </div>
      <div
        class="w-100 fs-6-S fs-20-XS fw-600 f-gray-600 pb-2-S pb-10-XS fd-r ai-c pt-0 jc-l-S jc-l-XS"
      >
        Rewards
        <Hint>
          ARP (Annual Percentage Rate) is just a simple interest that you will
          be receiving every year paid in the token of your choice. But the APR
          is subject to change and fluctuations. The “Monthly” and “Daily” are
          simply calculated to show how much you will be receiving at the term.
        </Hint>
      </div>
      <div
        class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-0 jc-l-S jc-l-XS pb-1-S pb-10-XS"
      >
        <span class="f-mcolor-300 pr-2">{{ getHgen }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">32.50%</span> APR)</span
        >
      </div>
      <div
        class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-0 jc-l-S jc-l-XS pb-1-S pb-10-XS"
      >
        <span class="f-mcolor-300 pr-2">{{ getHgen }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">32.50%</span> Monthly)</span
        >
      </div>
      <div
        class="w-100 fs-6-S fs-20-XS f-white-200 fd-r ai-b fd-600 py-1 pl-0 jc-l-S jc-l-XS pb-1-S pb-10-XS"
      >
        <span class="f-mcolor-300 pr-2">{{ getHgen }}</span> HGEN
        <span class="fs-5-S fs-20-XS pl-2"
          >(<span class="f-mcolor-100">1.50%</span> Daily)</span
        >
      </div>

      <div class="w-100 pb-4-S pb-15-XS fd-c-L fd-r-S fd-c-XS">
        <div class="w-100 mr-0-L mr-2-S mr-0-XS mt-6-S pt-15-XS" v-if="true">
          <AmButton
            color="mcolor-100"
            bColor="mcolor-100"
            opacityEffect
            full
            to="/my/farming"
          >
            GO
          </AmButton>
        </div>
      </div>
      <!-- <div class="w-100 fs-6-S fs-20-XS fw-400 f-white-200 pb-6-S pb-15-XS">
      You will receive GENS stable coin.
    </div>
    <div class="w-100 fs-6-S fs-20-XS fw-400 f-white-200 pb-2-S pb-10-XS">
      current debt
    </div>
    <div class="w-100 fs-11-S fs-30-XS fw-700 f-white-200 pb-6-S pb-15-XS">
      $ 201,000
    </div>
    <div class="w-60">
      <AmButton color="white-200" bColor="white-100" colorText="mcolor-100" opacityEffect full to="/my">
        <span class="fw-800">Borrow</span>
      </AmButton>
    </div> -->
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import { Icon, Tooltip } from "ant-design-vue";

export default {
  data() {
    return {
      timestamp: "",
      open: true,
    };
  },
  components: {
    Hint,
    Icon,
    Tooltip,
  },
  computed: {
    getPercent() {
      return Number.parseInt(
        (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) *
          100
      );
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
    getNow() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;
      return dateTime;
    },
    getToggleValue() {
      return this.open;
    },
  },
  methods: {
    openList() {
      this.open = true;
    },
    closeList() {
      this.open = false;
      console.log(this.open);
    },
  },
};
</script>
