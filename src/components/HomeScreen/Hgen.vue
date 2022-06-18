<template>
  <div class="container">
    <div class="w-100 fd-r fd-c-XS jc-c ai-c">
      <div class="w-20 fd-c jc-c">
        <div class="w-100 fs-5-S fs-10-XS ta-c f-white-200 fw-600">
          Governance & IDO Token
        </div>
        <div
          class="w-100-S w-100-XS fd-r fs-12-S fs-25-XS f-white-200 fw-600 ai-c jc-c"
        >
          <img
            src="@/assets/svg/symbol-hgen.png"
            class="h-fix-20-S h-fix-20-S h-fix-35-XS mr-2-S mr-5-XS"
          />
          $HGEN
        </div>
      </div>
      <div class="w-20-S w-100-XS">
        <AmButton
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          scaleEffect
          class="ml-2 ml-0-XS mt-0-S mt-10-XS fw-600"
        >
          <div class="w-100 tt-n fs-6-S fs-18-XS fw-600">Buy $HGEN</div>
        </AmButton>
      </div>
    </div>
    <!-- <div
      class="w-100 fd-r jc-c ai-c fs-14-S fs-30-XS f-white-200 fw-600"
      data-aos="zoom-in"
    >
      <img
        src="@/assets/svg/symbol-hgen.png"
        class="h-fix-20-S h-fix-20-S h-fix-35-XS mr-2-S mr-5-XS"
      />
      $HGEN
    </div>
    <div
      class="w-100 fs-5-M fs-6-S fs-15-XS ta-c f-gray-500 pt-3-S pt-10-XS"
      data-aos="fade"
      data-aos-duration="1500"
    >
      Token of the Solana
    </div>
    <div
      class="w-100 fd-r-S fd-c-XS ai-c jc-c pt-6-S pt-15-XS px-0-S px-20-XS"
      data-aos="zoom-in"
    >
      <AmButton
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        scaleEffect
        class="mr-2-S mr-0-XS"
      >
        <div class="w-100 ta-c pt-1 fs-7-S fs-18-XS fw-600">IDO</div>
        <div class="w-100 tt-n pt-2 pb-1 fs-5-S fs-15-XS">
          You can trade $HGEN
        </div>
      </AmButton>
      <AmButton
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        scaleEffect
        class="ml-2 ml-0-XS mt-0-S mt-10-XS"
      >
        <div class="w-a ta-c pt-1 fs-7-S fs-18-XS fw-600">GOVERNANCE</div>
        <div class="w-a tt-n pt-2 pb-1 fs-5-S fs-15-XS">
          You can vote as a holder
        </div>
      </AmButton>
    </div> -->
    <!-- <div
      class="
        w-100
        ta-c
        fs-8-S fs-15-XS
        fw-600
        f-white-200
        pt-6-S pt-15-XS
        px-0-S px-20-XS
      "
      data-aos="fade"
      data-aos-duration="1500"
      data-aos-ease="ease"
      data-aos-delay="1000"
    >
      $HGEN token to invest in your family’s future
    </div> -->
    <!-- <div
      class="
        w-100-L w-100-M w-100-S w-100-XS
        pl-10-M pl-10-S pl-0-XS
        px-20-XS
        mt-10-M mt-8-S mt-30-XS
        fd-r-S fd-c-XS
        ai-c        
      "
    >
      <div
        class="
          w-100
          shadow-purple-200
          rad-fix-6
          pt-30-XS pt-10-S
          pb-30-XS pb-10-S
          p-3-S p-10-XS
          br-6
          brs-s
          br-mcolor-100
          m-5-S m-20-XS
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
    </div> -->
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
