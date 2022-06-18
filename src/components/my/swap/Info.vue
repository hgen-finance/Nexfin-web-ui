<template>
  <div class="w-100">
    <div
      class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS"
    >
      <Balance />
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/swap/Balance.vue";

export default {
  components: {
    Balance,
  },
  layout: "my",
};
</script>
