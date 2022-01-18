<template>
  <transition name="fade">
    <div
      class="w-100 h-100 p-f l-0 t-0 amModal fd-r ai-c jc-c z-10"
      v-if="show"
    >
      <div class="w-100 h-100 p-a l-0 t-0 gradient-600 ts-3" @click="closed" />
      <div
        class="mcolor-500 p-10-S p-20-XS rad-fix-10 amBody ts-3"
        :class="[max, shadow]"
      >
        <slot />
        <img
          src="@/assets/svg/close.svg"
          class="w-fix-10-S w-fix-30-XS p-a r-fix-5-S r-fix-10-XS t-fix-5-S t-fix-10-XS ts-3 hv"
          @click="closed"
        />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    max: { type: String, default: "w-80" },
    shadow: { type: String, default: "shadow-purple-100" },
  },
  methods: {
    closed() {
      this.$emit("update:show", false);
      this.$emit("closed", null);
    },
  },
};
</script>

<style lang="scss" scoped>
.amModal {
  backdrop-filter: blur(0.2rem);
}
.fade-enter-active {
  transition: opacity 0.3s;
  .amBody {
    transform: scale(1);
    animation: 0.2s zoom;
  }
}
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
  .amBody {
    transform: scale(0.9);
    animation: 0.2s zoom reverse;
  }
}
@keyframes zoom {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
