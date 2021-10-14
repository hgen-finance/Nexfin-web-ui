<template>
  <div class="w-100">
    <div class="w-100 d-n-S d-b-XS">
      <Balance />
    </div>
    <div class="w-100 fd-r fw-w pt-0-S">
      <div class="w-55-S w-100-XS pt-30-XS">
        <Safe @confirmFunc="confirmFunc" />
      </div>
      <div class="w-45-S w-100-XS pl-8-S pl-0-XS pt-4-S pt-30-XS">
        <Info />
      </div>
    </div>
    <!-- <div class="w-100 fd-r jc-c pt-10-S pt-30-XS">
      <AmButton color="mcolor-200" bColor="mcolor-100" opacityEffect>
        How to use Safe Pool <img src="@/assets/svg/my/arrow-r.svg" class="w-fix-s-3 ml-1" />
      </AmButton>
    </div> -->
  </div>
</template>

<script>
import Balance from "@/components/my/pool/Balance.vue";
import Safe from "@/components/my/pool/Safe.vue";
import Info from "@/components/my/pool/Info.vue";

export default {
  layout: "my",
  components: {
    Balance,
    Safe,
    Info
  },
  methods: {
    confirmFunc(value) {
      this.$accessor.pool.confirm(value);
    }
  }
};
</script>
