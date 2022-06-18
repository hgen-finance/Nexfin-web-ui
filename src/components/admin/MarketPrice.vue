<template>
  <div class="p-4 d-f fd-c ai-c">
    <span class="f-mcolor-500 mb-3 fw-600 fs-8">
      {{ marketPrice.token }}
    </span>
    <span class="f-white-200 mb-3 fw-700 fs-14">
      {{ marketPrice.price }}
    </span>
    <span class="f-gray-700 fw-500 fs-7"> Market Price </span>
  </div>
</template>

<script>
export default {
  props: {
    marketPrice: { type: Object, required: true },
  },
};
</script>
