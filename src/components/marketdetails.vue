<template>
  <div class="w-100 fd-r ai-c ">
    <div class=" fd-r ai-c my-2 mx-3 f-white-200">
      <img
        alt=""
        width="24"
        height="24"
        class="mr-2"
        src="@/assets/svg/sol-logo.png"
      />
      <div class="fw-500 pr-1 fs-7-S">{{ symbol }}</div>
      <span class="f-gray-200 fs-6-S fw-200">/ </span>
      <div class="fw-500 pl-1 fs-7-S">{{ quoteSymbol }}</div>
    </div>

    <div class="fd-c my-2 mx-3">
      <div class="fs-4 fw-400 f-gray-600">
        Market Price
      </div>
      <div class="fs-4 fw-600 f-white-200">${{ getPrice }}</div>
    </div>
    <div class="fd-c my-2 mx-3">
      <div class="fs-4 fw-400 f-gray-600">
        Daily Change
      </div>
      <div
        v-bind:class="
          change > 0 ? 'my-green' : change < 0 ? 'f-red-700' : 'f-white-200'
        "
        class="fs-4 fw-600"
      >
        {{ change }}%
      </div>
    </div>
    <div class="fd-c my-2 mx-3">
      <div class="fs-4 fw-400 f-gray-600">
        24hr Volume
      </div>
      <div class="fs-4 fw-600 f-white-200">${{ volume }}</div>
    </div>
    <DailyHighAndLow :high="260" :low="180" :latest="getPrice" />
  </div>
</template>

<script>
import DailyHighAndLow from "@/components/dailyhighandlow.vue";
export default {
  components: {
    DailyHighAndLow
  },
  data() {
    return {
      change: 0.2,
      symbol: "SOL",
      quoteSymbol: "USD",
      volume: 0, // based on 24hrs
      status: null,
      pollInterval: null // polling interval for fetching the data from the coin gecko
    };
  },
  created() {
    this.pollPricValue();
  },
  methods: {
    pollPricValue() {
      setInterval(() => {
        this.$store.dispatch("getInfo", { self: this });
      }, 15000);
    }
  },
  mounted() {},
  computed: {
    getPrice() {
      return this.$store.state.usd;
    }
  },
  watch: {}
};
</script>
<style>
.my-green {
  color: #afd803;
}
.my-bg-mark {
  background: #1c1c3d;
}
</style>
