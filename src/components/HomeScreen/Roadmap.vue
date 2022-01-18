<template>
  <div class="container pt-20-S pt-40-XS">
    <div
      class="w-100 ta-c fs-17-S fs-30-XS f-white-200 fw-800 glow"
      data-aos="zoom-in"
    >
      <i>ROADMAP</i>
    </div>
    <div
      class="w-100 pt-15-S pt-30-XS fd-r jc-c px-0-M px-20-S px-20-XS"
      data-aos="zoom-in"
      data-aos-delay="500"
      data-aos-ease="ease"
      data-aos-anchor-placement="center-bottom"
    >
      <div
        class="w-100-S w-100-XS gradient-1000 rad-fix-10 fd-r-S fd-c-XS ai-s"
      >
        <div
          class="w-33-M w-100-S w-100-XS p-8-M p-10-S p-20-XS"
          v-for="(item, i) in items"
          :key="i"
          :class="{ 'mcolor rad-fix-10 shadow-purple-100': i === 0 }"
        >
          <!-- <img
            :src="require('@/static/' + item.img)"
            class="w-fix-40-M w-fix-45-S w-fix-100-XS p-a r-0 b-90-S b-90-XS"
          /> -->
          <div
            class="w-100 fs-8-M fs-10-S fs-25-XS f-white-200 fw-600"
            v-html="item.name"
          />
          <div class="w-100 pt-4-S pt-10-XS">
            <div
              class="
                w-100
                fd-r
                ai-t
                py-2-M py-3-S py-5-XS
                fs-5-M fs-8-S fs-18-XS
                f-white-200
              "
              v-for="(item2, i2) in item.items"
              :key="i2"
            >
              <img
                :src="require('@/assets/svg/' + item2.img)"
                class="h-fix-s-9-M h-fix-s-7-S h-fix-s-20-XS mr-2-S mr-5-XS"
              />
              <span v-html="item2.name" />
            </div>
          </div>
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
          name: "2021 second half<br/>(Launch)",
          img: "roadMap1.png",
          items: [
            { img: "checkOn.svg", name: "DeFi Platform Launch" },
            { img: "checkOn.svg", name: "Multi-channel Marketing" },
            { img: "checkOff.svg", name: "Security Audit" },
            { img: "checkOff.svg", name: "1.5 Million+ Market Cap" },
            { img: "checkOff.svg", name: "Exchange Listings (DEX)" }
          ]
        },
        {
          name: "2022 (Growth)",
          img: "roadMap2.png",
          items: [
            {
              img: "checkOffBlack.svg",
              name: "Cross platform with<br/>ERC20 (Ethereum)"
            },
            {
              img: "checkOffBlack.svg",
              name: "Funding for Hydrogen Industries"
            },
            {
              img: "checkOffBlack.svg",
              name:
                "Governance capabilities for holders to operate the NEXTFIN platform"
            },
            { img: "checkOffBlack.svg", name: "5 Million+ Market Cap" },
            { img: "checkOffBlack.svg", name: "Exchange Listings (CEX)" },
            {
              img: "checkOffBlack.svg",
              name: "Farming for Hydrogen Industries"
            }
          ]
        },
        {
          name: "2023 (Expansion)",
          img: "roadMap3.png",
          items: [
            { img: "checkOffBlack.svg", name: "80 Million+ Market Cap" },
            { img: "checkOffBlack.svg", name: "Development of Own Pool" },
            {
              img: "checkOffBlack.svg",
              name: "Operating Energy Tracking and Trading system"
            },
            {
              img: "checkOffBlack.svg",
              name: "Activating Aggregator for EVs and Charge stations"
            },
            { img: "checkOffBlack.svg", name: "P2P Energy Trading" },
            { img: "checkOffBlack.svg", name: "More to Announced" }
          ]
        }
      ]
    };
  }
};
</script>
