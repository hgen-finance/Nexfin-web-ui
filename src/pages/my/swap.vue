<template>
  <div class="w-100 ovh-h">
    <div class="w-100 d-n-S d-b-XS">
      <Balance />
    </div>
    <div class="w-100 fd-r-S fd-c-XS jc-se">
      <div class="w-35-S w-100-XS pt-0-S pt-30-XS">
        <Raydium @createRayFunc="createRayFunc" />
      </div>
      <div class="w-25-S w-100-XS pt-30-XS">
        <Info />
      </div>
    </div>
    <!-- <img src="@/static/swap.png" class="p-a b-0 w-30 d-b-M d-n-S d-n-XS" /> -->
  </div>
</template>

<script>
import Balance from "@/components/my/swap/Balance.vue";
import Raydium from "@/components/my/swap/Raydium.vue";
import Info from "@/components/my/swap/Info.vue";

export default {
  layout: "my",
  head() {
    return {
      bodyAttrs: {
        class: "isSwap",
      },
    };
  },
  components: {
    Balance,
    Raydium,
    Info,
  },
  methods: {
    swapFunc() {
      this.$accessor.swap.swap();
    },
    createRayFunc() {
      this.$accessor.swap.createRay();
    },
  },
};
</script>

<style lang="scss">
.isSwap .swap-bg {
  background-image: url("/img/XMLID.png");
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 320px;
}
</style>
