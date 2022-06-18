<template>
  <div class="w-100 ovh-h">
    <div class="w-100 d-n-S d-b-XS">
      <Balance />
    </div>
    <div class="w-100 fd-r-S fd-c-XS jc-se">
      <div class="w-35-S w-100-XS pt-0-S pt-30-XS" v-if="getLiquidityState">
        <AddLiquidity />
      </div>
      <div class="w-35-S w-100-XS pt-0-S pt-30-XS" v-if="!getLiquidityState">
        <RemoveLiquidity />
      </div>
      <div class="w-25-S w-100-XS pt-30-XS">
        <Info />
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/Balance.vue";
import AddLiquidity from "@/components/my/liquidity/AddLiquidity.vue";
import RemoveLiquidity from "@/components/my/liquidity/RemoveLiquidity.vue";
import Info from "@/components/my/liquidity/Info.vue";

export default {
  layout: "my",
  head() {
    return {
      bodyAttrs: {
        class: "isLiquidity",
      },
    };
  },
  components: {
    AddLiquidity,
    RemoveLiquidity,
    Balance,
    Info,
  },
  computed: {
    getLiquidityState() {
      return this.$accessor.swapPool.withdrawOrDeposit;
    },
  },
  methods: {
    AddFunc() {},
  },
};
</script>

<style lang="scss">
.isLiquidity .liquidity-bg {
  background-image: url("/img/XMLID.png");
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 320px;
}
</style>
