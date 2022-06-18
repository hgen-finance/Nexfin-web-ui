<template>
  <div class="w-90 p-5-S p-10-XS mcolor-500 rad-fix-8 bs-sb-all ft-h inner">
    <div class="w-100">
      <div class="w-100 fd-r jc-sb ai-c my-3-S">
        <MultiSend />
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/multiSend/Balance.vue";
import MultiSend from "@/components/my/multiSend/multiSend.vue";

export default {
  layout: "my",

  components: {
    Balance,
    MultiSend,
  },
  methods: {},
};
</script>

<style lang="scss"></style>
