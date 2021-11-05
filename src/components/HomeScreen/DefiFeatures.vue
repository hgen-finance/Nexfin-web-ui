<template>
  <div class="container pt-20-M pt-20-S pt-40-XS mb-10-S mb-20-XS">
    <div
      class="w-100 tt-u fs-14-S fs-30-XS fw-600 f-white-200 ta-c"
      data-aos="zoom-in"
    >
      DeFi FEATURES
    </div>
    <div class="w-100 fd-r jc-c pt-0-S pt-30-XS">
      <div class="w-80-S w-100-XS fd-r ai-t jc-c fw-w">
        <div
          class="w-33-S w-60-XS fd-c jc-c ai-c p-10-S p-15-XS"
          v-for="(item, i) in items"
          :key="i"
          data-aos="zoom-in"
          data-aos-duration="500"
        >
          <div
            class="
              w-90
              fd-r
              ai-c
              jc-c
              shadow-purple-100
              rad-fix-4-S rad-fix-20-XS
              py-6-M py-4-S py-15-XS
            "
          >
            <img
              :src="require('@/assets/svg/' + item.img)"
              class="h-fix-40-M h-fix-30-S h-fix-100-XS"
            />
          </div>
          <div
            class="
              w-100
              pt-6-M pt-4-S pt-15-XS
              fs-8-S fs-20-XS
              fw-600
              f-white-200
              ta-c
            "
          >
            {{ item.name }}
          </div>
          <div
            class="w-100 pt-2-S pt-10-XS fs-6-S fs-20-XS fw-400 f-gray-500 ta-c"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 fd-r jc-c pt-5-M pt-4-S pt-15-XS px-0-M px-3-S px-20-XS">
      <AmButton color="mcolor-100" bColor="mcolor-100" opacityEffect>
        Beginner’s Guide to DeFi
      </AmButton>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          img: "defiFuture1.svg",
          name: "Borrowing",
          text: "Get an interes-free loan",
        },
        {
          img: "defiFuture2.svg",
          name: "Safe Pool",
          text: "We have triple earnings.",
        },
        {
          img: "defiFuture3.svg",
          name: "Farming",
          text: "Fund to earn transaction fees profit.",
        },
      ],
    };
  },
};
</script>
