<template>
  <div id="tokenomics" class="container m-10-S m-10-XS">
    <div
      class="
        w-100
        fd-r
        jc-c
        ai-c
        fs-14-S fs-30-XS
        f-white-200
        fw-600
        mb-5-S mb-10-XS
      "
      data-aos="zoom-in"
    >
      Tokenomics
    </div>
    <div
      class="
        w-100-L w-100-M w-100-S w-100-XS
        pl-10-M pl-10-S pl-0-XS
        px-20-XS
        pt-0-M pt-8-S pt-30-XS
        fd-r-S fd-c-XS
        h-fix-150
      "
    >
      <div
        class="
          w-100
          shadow-purple-200
          rad-fix-6
          p-3-S p-10-XS
          br-6
          brs-s
          br-mcolor-100
          m-5-S m-20-XS
          fd-c
          jc-c
        "
        v-for="(item, i) in items"
        :key="i"
        :class="{ 'mt-3-S mt-10-XS': i > 0 }"
        data-aos="fade"
        data-aos-duration="1500"
      >
        <div class="w-100 ta-c f-mcolor-400 fw-600 fs-15-M fs-10-S fs-25-XS">
          <i>{{ item.name }}</i>
        </div>
        <div
          class="
            w-100
            ta-c
            f-white-200
            fw-600
            fs-15-M fs-8-S fs-20-XS
            pt-2-S pt-5-XS
          "
        >
          {{ item.count }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      items: [
        { name: "Buyback", count: 30 },
        { name: "Marketing", count: 25 },
        { name: "Bnb", count: 15 },
      ],
      show: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
