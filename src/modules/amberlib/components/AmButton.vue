<template>
  <!-- { disabled: disabled, 'shadow-purple-100': !disabled }, -->
  <!-- <div
    class="w-100-XS d-ib tt-u rad-fix-2 amButton br-4 brs-s" -->
  <div
    class="w-100-XS d-ib tt-u rad-fix-3 amButton br-4"
    :class="[
      { disabled: disabled, 'shadow-purple-100': !disabled },
      { disableShadow: disableShadow, 'bs-sb-all': disableShadow },
      color,
      `f-${colorText}`,
      `br-${bColor}`,
      {
        'w-100-S': full,
        'w-a-S': !full,
        opacity: opacityEffect,
        scale: scaleEffect,
      },
    ]"
  >
    <span
      class="w-100 h-100 p-a l-0 t-0 amButtonHover"
      :class="[colorHover, `f-${colorTextHover}`]"
      v-if="hover"
    />
    <nuxt-link
      :to="to"
      v-if="to"
      class="w-100-S w-100-XS d-f ai-c jc-c ta-c px-8 py-1-S py-10-XS fs-5-S fs-20-XS fw-500 z-2"
      :class="{ 'h-fix-s-28min': height, 'w-100-M': full, 'w-a-M': !full }"
    >
      <span v-if="label">
        {{ label }}
      </span>
      <span v-else>
        <slot />
      </span>
    </nuxt-link>
    <a
      :href="link"
      v-else-if="link"
      class="w-100-S w-100-XS d-f ai-c jc-c ta-c px-8 py-1-S py-10-XS fs-5-S fs-20-XS fw-500 z-2"
      :class="{ 'h-fix-s-28min': height, 'w-100-M': full, 'w-a-M': !full }"
    >
      <span v-if="label">
        {{ label }}
      </span>
      <span v-else>
        <slot />
      </span>
    </a>
    <span
      class="w-a-M w-100-S w-100-XS d-f ai-c jc-c ta-c px-6 py-1-S py-10-XS fs-5-S fs-20-XS fw-500 z-2"
      v-else
      @click="$emit('click')"
      :class="[
        getHover,
        { 'h-fix-s-28min': height, 'w-100-M': full, 'w-a-M': !full },
      ]"
    >
      <span v-if="label">
        {{ label }}
      </span>
      <span v-else>
        <slot />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    colorText: { type: String, default: "white-200" },
    color: { type: String, default: "purple-700" },
    bColor: { type: String, default: "purple-700" },
    hover: { type: Boolean, default: false },
    colorTextHover: { type: String, default: "white-200" },
    colorHover: { type: String, default: "purple-700" },
    label: { type: String, default: null },
    to: { type: String, default: null },
    link: { type: String, default: null },
    opacityEffect: { type: Boolean, default: false },
    scaleEffect: { type: Boolean, default: false },
    height: { type: Boolean, default: true },
    full: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    shadow: { type: String, default: "shadow-purple-100" },
    disableShadow: { type: Boolean, default: false },
  },
  computed: {
    getHover() {
      return this.hover ? `f-${this.colorTextHover}` : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.amButton {
  transition: 0.3s;
  cursor: pointer;
  user-select: none;
  .amButtonHover {
    opacity: 0;
    transition: 0.3s;
  }
  &.disabled {
    cursor: default;
  }
  &:hover {
    &.opacity {
      opacity: 0.8;
    }
    &.scale {
      transform: scale(0.98);
    }
    .amButtonHover {
      opacity: 1;
    }
  }
}
</style>
