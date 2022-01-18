<template>
  <div class="w-10 fd-c my-2 mx-3">
    <div class="fs-4 fw-400 f-gray-600 as-c">Daily Range</div>
    <div class="fs-4 fw-600 fd-r ai-c">
      <div class="fs-4 fw-600 f-white-200">${{ low }}</div>
      <div class="rad-fix-5 w-100 my-h bg-main mx-1">
        <div
          v-bind:style="{ width: rangePercent + '%' }"
          class="my-h rad-fix-5 bg-prog"
        ></div>
      </div>
      <div class="fs-4 fw-600 f-white-200">${{ high }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    high: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
    latest: { type: Number, default: 0 },
  },
  data() {
    return {};
  },
  computed: {
    rangePercent() {
      return (
        ((parseFloat(this.latest) - parseFloat(this.low)) * 100) /
        (parseFloat(this.high) - parseFloat(this.low))
      );
    },
  },
  watch: {},
  methods: {},
  mounted() {},
};
</script>
<style>
.bg-prog {
  background: #8f00ff;
}
.bg-main {
  background: #2a2440;
}
.my-h {
  height: 0.375rem;
}
.as-c {
  align-self: center;
}
</style>
