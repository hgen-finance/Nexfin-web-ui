<template>
  <div class="w-100">
    <div class="w-100 d-n-S d-b-XS">
      <Balance />
    </div>
    <div class="w-100 fd-r fw-w pt-0-S jc-se">
      <div class="w-35-S w-100-XS pt-30-XS">
        <Farm @confirmFunc="confirmFunc" />
      </div>
      <div class="w-25-S w-100-XS pt-30-XS">
        <Info />
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/farming/Balance.vue";
import Farm from "@/components/my/farming/farm.vue";
import Info from "@/components/my/farming/Info.vue";

export default {
  layout: "my",
  components: {
    Balance,
    Farm,
    Info,
  },
  methods: {
    confirmFunc(value) {},
  },
};
</script>
