<template>
  <div
    class="w-100 d-b"
    :style="{ height: `${radius}px` }"
    v-if="stroke && radius"
  >
    <svg class="w-100 h-100" viewbox="0 0 200 200">
      <circle
        :r="getRadius"
        :cx="getSize"
        :cy="getSize"
        fill="none"
        :stroke="`url(#cd${rand})`"
        :stroke-width="stroke"
        :stroke-dasharray="`${getDashArray} ${getDashArray}`"
        stroke-linecap="round"
      />
      <circle
        :filter="`url(#ds${rand})`"
        :r="getRadius"
        :cx="getSize"
        :cy="getSize"
        fill="none"
        :stroke="`url(#cl${rand})`"
        :stroke-width="stroke"
        :stroke-dashoffset="getPercent"
        :stroke-dasharray="`${getDashArray} ${getDashArray}`"
        stroke-linecap="round"
      />
      <circle
        :r="getSmallRadius"
        :cx="getSmallSize + getSmallSize - getSmallRadius * 1.5"
        :cy="getSmallSize"
        fill="black"
        :stroke="`url(#cl${rand})`"
        :stroke-width="stroke / 1.8"
        :stroke-dasharray="`${getSmallDashArray} ${getSmallDashArray}`"
      />
      <defs>
        <linearGradient
          :id="`cd${rand}`"
          gradientUnits="objectBoundingBox"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.02)" />
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0.02)" />
        </linearGradient>
        <linearGradient
          :id="`cl${rand}`"
          gradientUnits="objectBoundingBox"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" :stop-color="`#${colorFrom}`" />
          <stop offset="100%" :stop-color="`#${colorTo}`" />
        </linearGradient>
        <filter :id="`ds${rand}`">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            :flood-color="`#${colorFrom}`"
          />
        </filter>
      </defs>
    </svg>
    <div
      class="w-100 p-a b-0 l-50 pl-6-S pl-10-XS pb-1-L pb-2-M pb-3-S pb-5-XS fs-5-S fs-10-XS f-gray-500"
    >
      {{ text }} <span class="fw-600 f-white-200">{{ tokenpercent }} %</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stroke: { type: Number, default: null },
    radius: { type: Number, default: null },
    percent: { type: Number, default: null },
    colorFrom: { type: String, default: "ffffff" },
    colorTo: { type: String, default: "ffffff" },
    text: { type: String, default: null },
    tokens: { type: String, default: null },
    tokenpercent: { type: String, default: null },
  },
  data() {
    return {
      rand: 0,
    };
  },
  computed: {
    getRadius() {
      return this.radius ? this.radius / 2 - this.stroke * 1.5 : 0;
    },
    getSmallRadius() {
      return this.stroke ? this.stroke * 1 : 0;
    },
    getSmallSize() {
      return this.stroke ? this.radius / 2 : 0;
    },
    getSize() {
      return this.radius ? this.radius / 2 : 0;
    },
    getDashArray() {
      return this.radius ? this.radius * 2 * Math.PI : null;
    },
    getSmallDashArray() {
      return this.stroke ? this.stroke * 2 * Math.PI : null;
    },
    getPercent() {
      return this.radius
        ? this.getDashArray -
            (((((((30 / 100) * this.percent) % 360) + 0.1) / 60) * 100) / 100) *
              this.getDashArray
        : 0;
    },
  },
  mounted() {
    this.rand = Math.round(Math.random() * (999999 - 100000) + 100000);
  },
};
</script>

<style lang="scss" scoped>
svg {
  circle {
    transition: stroke-dashoffset 0.35s;
    transform: rotate(90deg);
    transform-origin: 50% 50%;
  }
}
</style>
