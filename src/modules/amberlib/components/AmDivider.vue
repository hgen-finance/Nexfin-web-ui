<template>
  <div class="w-100" :class="[getSize, getColor]" />
</template>

<script>
export default {
  props: {
    size: { type: Number, default: 1 },
    color: { type: String, default: "gray-900" },
  },
  computed: {
    getSize() {
      return `h-fix-s-${this.size}`;
    },
    getColor() {
      return this.color;
    },
  },
};
</script>
