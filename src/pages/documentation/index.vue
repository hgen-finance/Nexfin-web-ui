<template>
  <div class="w-100 fd-c ai-c pt-0-L pt-4-M pt-10-XS pt-10-S">
    <div class="container px-0-L px-0-L px-4-S px-4-XS">
      <div
        class="d-f ta-l fs-12-L fs-10-M fs-8-S fs-8-XS f-gray-600 fw-400 mt-4-M"
      >
        <div
          class="mr-9-L mr-8-M mr-4-S mr-4-XS pb-1 c-p"
          :class="{ 'br-mcolor-400 brbs-s f-white-200': activeTab === 'faq' }"
          @click="activeTab = 'faq'"
        >
          FAQ
        </div>
        <div
          class="mr-9-L mr-8-M mr-4-S mr-4-XS pb-1 c-p"
          :class="{ 'br-mcolor-400 brbs-s f-white-200': activeTab === 'guide' }"
          @click="activeTab = 'guide'"
        >
          Beginners Guide
        </div>
        <div
          class="mr-9-L mr-8-M mr-4-S mr-4-XS pb-1 c-p"
          :class="{ 'br-mcolor-400 brbs-s f-white-200': activeTab === 'audit' }"
          @click="activeTab = 'audit'"
        >
          Audit
        </div>
      </div>
    </div>

    <div
      class="container mt-8-L mt-6-M mt-6-S mt-6-XS px-0-L px-0-L px-4-S px-4-XS"
    >
      <Faq v-if="activeTab === 'faq'" />
      <BeginnersGuide v-if="activeTab === 'guide'" />
      <Audit v-if="activeTab === 'audit'" />
    </div>
  </div>
</template>

<script>
import Faq from "@/components/documentation/Faq";
import BeginnersGuide from "@/components/documentation/BeginnersGuide";
import Audit from "@/components/documentation/Audit";

export default {
  components: {
    Faq,
    BeginnersGuide,
    Audit,
  },
  data() {
    return {
      activeTab: "faq",
    };
  },
};
</script>
