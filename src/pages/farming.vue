<template>
  <div class="w-100">
    <div class="w-100 fd-c ai-c">
      <div class="w-100 fd-r fw-w pt-0-S jc-se mb-10-S mb-20-XS">
        <div class="w-35-S w-100-XS pt-30-XS">
          <Farm
            @confirmFunc="confirmFunc"
            @lp="depositedLp = $event"
            @day="day = $event"
          />
        </div>
        <div class="w-25-S w-100-XS pt-30-XS">
          <Info :depositedLp="Number(depositedLp)" :day="Number(day)" />
        </div>
      </div>
      <div class="w-75-S w-100-XS">
        <Rewards />
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/farming/Balance.vue";
import Farm from "@/components/my/farming/farm.vue";
import Info from "@/components/my/farming/Info.vue";
import Rewards from "@/components/my/farming/rewards.vue";

export default {
  layout: "my",
  components: {
    Balance,
    Farm,
    Info,
    Rewards,
  },
  data() {
    return {
      depositedLp: { type: Number, default: 0 },
      day: { type: Number, default: 0 },
    };
  },
  computed: {
    async farmChange() {},
  },

  methods: {
    confirmFunc(value) {},
  },
  mounted() {},
};
</script>
