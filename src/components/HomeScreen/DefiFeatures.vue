<template>
  <div class="container pt-20-M pt-20-S pt-40-XS mb-0-S mb-10-XS">
    <div
      class="w-100 tt-u fs-17-S fs-30-XS fw-800 f-white-200 ta-c glow"
      data-aos="zoom-in"
    >
      <i>Growth With Purpose</i>
    </div>
    <!-- <div
      class="
        w-100
        pt-6-M pt-4-S pt-15-XS
        fs-8-S fs-20-XS
        fw-600
        f-white-200
        ta-c
      "
      data-aos="zoom-in"
      data-aos-duration="500"
    >
      $HGEN DeFi Platform
    </div> -->

    <div
      class="w-100 pt-30-XS fd-r jc-c px-0-M pt-5-S pb-0-S px-20-XS"
      data-aos="fade"
      data-aos-ease="ease"
    >
      <div class="w-100-S w-100-XS rad-fix-10 fd-r-S fd-c-XS ai-s my-col-3">
        <div
          class="w-100 fd-c p-10-S p-20-XS jc-l"
          data-aos="fade"
          data-aos-ease="ease"
          data-aos-delay="200"
        >
          <div class="w-100 f-white-200 mb-5-S mb-10-XS">
            We have a strong integrated solution to bring our world to DeFi
            online platform, greatly reduces risks and environmental pollution,
            and results in more reliable power through the utilization of
            existing hydrogen engineering art.
          </div>
          <div class="w-100-S w-100-XS">
            <AmButton color="mcolor-100" bColor="mcolor-100" opacityEffect>
              Beginner’s Guide to DeFi
            </AmButton>
          </div>
        </div>
        <div
          class="w-100-M w-100-S w-100-XS p-8-M p-10-S p-20-XS"
          data-aos="fade"
          data-aos-ease="ease"
          data-aos-delay="200"
          v-for="(item, i) in hydrogenItems"
          :key="i"
        >
          <!-- <div
          class="w-33-M w-100-S w-100-XS p-8-M p-10-S p-20-XS"
          v-for="(item, i) in hydrogenItems"
          :key="i"
          :class="{ 'mcolor rad-fix-10 shadow-purple-100': i === 0 }"
        > -->
          <!-- <img
            :src="require('@/static/' + item.img)"
            class="w-fix-40-M w-fix-45-S w-fix-100-XS p-a r-0 b-90-S b-90-XS"
          /> -->
          <div
            class="w-100 fs-8-M fs-10-S fs-25-XS f-white-200 fw-600"
            v-html="item.name"
          />
          <p
            v-html="item.text"
            class="f-white-200 pt-3-S pt-10-XS fs-5-M fs-8-S fs-18-XS"
          />
          <div class="w-100 pt-4-S pt-10-XS">
            <div
              class="w-100 fd-r ai-t py-2-M py-3-S py-5-XS fs-5-M fs-8-S fs-18-XS f-white-200"
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
      hydrogenItems: [
        {
          name: "Borrow & Staking",
          text: "The borrowing & Staking will be a critical component to the $HGEN DeFi Project Financing Platform",
          img: "roadMap1.png",
          items: [
            {
              img: "checkOn.svg",
              name: "Get an interests-free loan with Borrow",
            },
            { img: "checkOn.svg", name: "Get triple earnings with Staking" },
            {
              img: "checkOn.svg",
              name: "Leverage investments possible through",
            },
            { img: "checkOn.svg", name: "minting $GENS stablecoin" },
          ],
        },
        {
          name: "Farms",
          text: "The farming will give you additional benefit.",
          img: "roadMap2.png",
          items: [
            {
              img: "checkOn.svg",
              name: "Fund to earn transaction fees profit",
            },
            {
              img: "checkOn.svg",
              name: "Funding for Hydrogen Industries",
            },
            {
              img: "checkOn.svg",
              name: "Support cross platform",
            },
          ],
        },
        {
          name: "Hydrogen Project Financing",
          text: "The $HGEN DeFi Platform will focus on the growth of the hydrogen market by offering project financing capabilities to entities seeking to be part of, or grow the hydrogen ecosystem.",
          img: "roadMap3.png",
          items: [{ img: "checkOn.svg", name: "PF based staking fund" }],
        },
        {
          name: "Big Data (Hydrogen Focused Data)",
          text: "Hydrogen cars registered on the platform will be connected to the $HGEN network of data. Including hydrogen charging stations, hydrogen consumption usage, and the ability to pay using $HGEN/$GENS Tokens. e.g.",
          img: "roadMap3.png",
          items: [
            {
              img: "checkOn.svg",
              name: " Hydrogen vehicle data aggregator",
            },
            {
              img: "checkOn.svg",
              name: "Vehicle-specific private / public keys provided",
            },
            {
              img: "checkOn.svg",
              name: "Find the location of Hydrogen Recharge",
            },
            { img: "checkOn.svg", name: "View hydrogen fuel prices" },
            {
              img: "checkOn.svg",
              name: "Rechargeable fuel (line) can be settled",
            },
          ],
        },
        {
          name: "Smart (Micro) Grid",
          text: "Green hydrogen based energy can be connected to local ESS (Energy Storage Systems). Thereby allowing individuals to buy green energy directly from the producer, and providing energy providers with a method of selling power.",
          img: "roadMap3.png",
          items: [
            {
              img: "checkOn.svg",
              name: "Real-time energy tracking and measurement capabilities",
            },
            {
              img: "checkOn.svg",
              name: "Power trading system between ESS to prevent energy shortage and overheating",
            },
            {
              img: "checkOn.svg",
              name: "Operating Energy Tracking and Trading system",
            },
            {
              img: "checkOn.svg",
              name: "Activating Aggregator for EVs and Charge stations",
            },
            { img: "checkOn.svg", name: "P2P Energy Trading" },
            { img: "checkOn.svg", name: "More to Announced" },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.my-col-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
