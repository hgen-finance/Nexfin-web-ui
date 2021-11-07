<template>
  <div class="container pt-20-S pt-40-XS pb-10-S pb-0-XS">
    <div
      class="w-100 fd-r jc-c ai-c fs-17-S fs-30-XS f-white-200 fw-800 tt-u glow"
      data-aos="zoom-in"
    >
      <i>Advisors</i>
    </div>
    <div class="w-100 pt-15-S pt-20-XS fd-r jc-c fw-w px-5-S px-0-XS">
      <div
        class="w-25-S w-100-XS fd-c ai-c p-2-S p-20-XS"
        v-for="(item, i) in items"
        :key="i"
      >
        <div
          class="w-70-S w-60-XS h-fix-65-M h-fix-s-150-XS brs-s br-mcolor-100 shadow-purple-100 ovh rad-fix-6"
        >
          <img :src="require('@/static/' + item.img)" class="w-100 h-100min" />
        </div>
        <div
          class="w-100 fs-8-M fs-10-S fs-25-XS fw-600 ta-c pt-6-M pt-10-S pt-20-XS f-white-200"
        >
          {{ item.name }}
        </div>
        <div
          class="w-100 fs-6-M fs-8-S fs-20-XS fw-400 ta-c pt-2-M pt-5-S pt-10-XS f-mcolor-100 tt-u"
        >
          {{ item.position }}
        </div>
        <div
          class="w-100 fs-5-M fs-8-S fs-20-XS ta-c pt-2-M pt-5-S pt-10-XS f-white-200 px-0-S px-10-XS f-lh-15-S f-lh-45-XS"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          img: "user.png",
          name: "Name",
          position: "Position",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
        },
        {
          img: "user.png",
          name: "Name",
          position: "Position",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
        },
        {
          img: "user.png",
          name: "Name",
          position: "Position",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
        },
        {
          img: "user.png",
          name: "Name",
          position: "Position",
          text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
        }
      ]
    };
  }
};
</script>
