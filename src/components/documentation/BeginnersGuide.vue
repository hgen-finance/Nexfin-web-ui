<template>
  <div class="w-100 d-f fd-r-L fd-r-M fd-c-S fd-c-XS">
    <div class="w-50-L w-50-M w-100-S w-100-XS">
      <div
        v-for="(bg, index) in beginnersGuide"
        :key="bg.title"
        class="mcolor rad-fix-2 py-2 pl-4 pr-6 br-1 brs-s"
        :class="{
          'br-mcolor-400': activeTab === bg.title,
          'mt-2-L mt-2-M mt-2-S mt-2-XS': index !== 0,
          'br-white-100': activeTab !== bg.title,
        }"
      >
        <div class="ai-c d-f jc-sb">
          <span class="fs-6-L fs-6-M fs-6-S fs-6-XS f-mcolor-300 fw-400 tt-u">
            {{ bg.title }}
          </span>
          <span
            :class="{ 'r-45deg': activeTab === bg.title }"
            class="fs-8-L fs-8-M fs-8-S fs-8-XS f-white-200 fw-400 c-p tr-all-ease"
            @click="activateTab(bg.title)"
          >
            +
          </span>
        </div>
        <div
          class="f-white-200 fw-400 fs-5-L fs-5-M fs-5-S fs-5-XS mt-2"
          v-if="activeTab === bg.title"
        >
          <span>
            {{ bg.description }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="w-50-L w-50-M w-100-S w-100-XS ml-10-L ml-10-M ml-0-S ml-0-XS mt-3-S mt-3-XS mt-0-L mt-0-M"
    >
      <div class="f-white-200 fw-400 fs-6-L fs-6-M fs-5-S fs-5-XS">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
        bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra
        justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque
        penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam
        fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci,
        sed rhoncus pronin sapien nunc accuan eget.
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({ beginnersGuide: "documentation/getBeginnersGuide" }),
  },
  data() {
    return {
      activeTab: "",
    };
  },
  methods: {
    activateTab(tab) {
      this.activeTab = this.activeTab === tab ? "" : tab;
    },
  },
};
</script>
