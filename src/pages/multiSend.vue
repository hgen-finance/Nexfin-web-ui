<template>
  <div class="w-100">
    <div class="w-100 d-n-S d-b-XS">
      <Balance />
    </div>
    <div class="w-100 d-f jc-se fd-c-XS">
      <div class="w-100-XS w-50-S pt-30-XS">
        <!-- <div class="w-100 fd-r jc-sb ai-c my-3-S"> -->
        <MultiSend />
        <!-- </div> -->
      </div>
      <div class="w-25-S d-n-XS w-100-XS pt-30-XS">
        <Info />
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/Balance.vue";

import Info from "@/components/my/multiSend/info.vue";
import MultiSend from "@/components/my/multiSend/multiSend.vue";

export default {
  layout: "my",

  components: {
    Info,
    MultiSend,
    Balance
  },
  methods: {},
};
</script>

<style lang="scss">
.CodeMirror-scroll {
  padding-bottom: 0px !important;
}
</style>
