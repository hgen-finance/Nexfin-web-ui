<template>
  <div class="container pt-20-S pt-40-XS fd-r-S fd-c-XS ovh px">
    <div
      class="w-60-L w-60-M w-60-S w-100-XS pr-15-S pr-0-XS px-4-XS"
      data-aos="slide-right"
      data-aos-anchor-placement="center-bottom"
    >
      <div class="w-100">
        <div class="w-100" ref="round1">
          <ProgressCircle :percent="20" :radius="radius[0]" :stroke="stroke" colorFrom="8F00FF" colorTo="8F00FF" text="Development, Team, Reserve" tokens="50.000.000" />
        </div>
        <div class="w-100 p-a l-0 t-0 p-6-L p-6-M p-8-S p-12-XS">
          <div class="w-100" ref="round2">
            <ProgressCircle :percent="40" :radius="radius[1]" :stroke="stroke" colorFrom="A533FF" colorTo="A533FF" text="Partner & Adv" tokens="100.000.000" />
          </div>
        </div>
        <div class="w-100 p-a l-0 t-0 p-12-L p-12-M p-16-S p-24-XS">
          <div class="w-100" ref="round3">
            <ProgressCircle :percent="50" :radius="radius[2]" :stroke="stroke" colorFrom="BC66FF" colorTo="BC66FF" text="Collateral" tokens="150.000.000" />
          </div>
        </div>
        <div class="w-100 p-a l-0 t-0 p-18-L p-18-M p-24-S p-36-XS">
          <div class="w-100" ref="round4">
            <ProgressCircle :percent="60" :radius="radius[3]" :stroke="stroke" colorFrom="D299FF" colorTo="D299FF" text="Eco" tokens="250.000.000"/>
          </div>
        </div>
        <div class="w-100 p-a l-0 t-0 p-24-L p-24-M p-32-S p-48-XS">
          <div class="w-100" ref="round5">
            <ProgressCircle :percent="70" :radius="radius[4]" :stroke="stroke" colorFrom="E9CCFF" colorTo="E9CCFF" text="Sale" tokens="300.000.000" />
          </div>
        </div>
        <div class="w-100 h-100 p-a l-0 t-0 fd-c ai-c jc-c">
          <div class="fs-8-S fs-20-XS f-gray-500">
            Total Supply
          </div>
          <div class="fs-7-S fs-15-XS f-gray-200 pt-2-S pt-10-XS fw-600">
            000,000,000 HGEN
          </div>
        </div>
      </div>
      <div class="w-100 fd-r jc-c pt-10-S pt-30-XS px-0-S px-20-XS">
        <AmButton color="mcolor-100" bColor="mcolor-100" opacityEffect>
          Beginner’s Guide to DeFi
        </AmButton>
      </div>
    </div>
    <div class="w-40-S w-100-XS fd-c-S fd-c-XS ai-c">
      <span
        class="fw-800  fs-13-S fs-30-XS f-white-200 mt-30-XS mb-3-S mb-10-XS"
        data-aos="zoom-in"
        data-aos-ease="ease"
        ><i>Slippage</i></span
      >
      <div class="w-100 fd-r-S fd-c-XS jc-sb">
        <div
          class="
        w-45-S w-100-XS
        px-20-XS
        pt-0-M pt-8-S pt-30-XS
      "
          data-aos="fade-in"
          data-aos-ease="ease"
        >
          <div class="fd-c ai-c f-white-200 mb-5-S mb-10-XS">
            <span class="fs-10-S fs-30-XS fw-600 f-purple-500">
              <i>{{ buyTax.value }} %</i>
            </span>
            <span class="fs-10-S fs-30-XS fw-600"><i>Buy Tax</i></span>
          </div>
          <div
            class="
          w-100
          shadow-purple-200
          rad-fix-6
          p-3-S p-10-XS
          br-6
          brs-s
          br-mcolor-100
        "
            v-for="(item, i) in items"
            :key="i"
            :class="{ 'mt-3-S mt-10-XS': i > 0 }"
          >
            <div
              class="w-100 ta-c f-mcolor-400 fw-600 fs-6-M fs-10-S fs-25-XS pt-5-S pb-5-S pt-10-XS pb-10-XS"
            >
              {{ item.name }} {{ item.count }}%
            </div>
          </div>
        </div>
        <div
          class="
        w-45-S w-100-XS
        px-20-XS
        pt-0-M pt-8-S pt-30-XS
      "
          data-aos="fade-in"
          data-aos-ease="ease"
        >
          <div class="fd-c ai-c f-white-200 mb-5-S mb-10-XS">
            <span class="fs-10-S fs-30-XS fw-600 f-purple-500">
              <i>{{ sellTax.value }} %</i>
            </span>
            <span class="fs-10-S fs-30-XS fw-600"><i>Sell Tax</i></span>
          </div>
          <div
            class="
          w-100
          shadow-purple-200
          rad-fix-6
          p-3-S p-10-XS
          br-6
          brs-s
          br-mcolor-100
        "
            v-for="(item, i) in items2"
            :key="i"
            :class="{ 'mt-3-S mt-10-XS': i > 0 }"
          >
            <div
              class="w-100 ta-c f-mcolor-400 fw-600 fs-6-M fs-10-S fs-25-XS pt-5-S pb-5-S pt-10-XS pb-10-XS"
            >
              {{ item.name }} {{ item.count }}%
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressCircle from '@/components/ProgressCircle'

export default {
  components: {
    ProgressCircle
  },
  data () {
    return {
      sellTax: { value: 11 },
      buyTax: { value: 9 },
      items: [
        { name: "BuyBack", count: 3 },
        { name: "Marketing", count: 3 },
        { name: "Burn", count: 3 }
      ],
      items2: [
        { name: "BuyBack", count: 3 },
        { name: "Rewards", count: 5 },
        { name: "Burn", count: 3 }
      ],
      radius: [],
      stroke: 12
    }
  },
  methods: {
    resize () {
      this.radius = []
      if (window.innerWidth < 600) {
        this.stroke = 12 / 2
      } else if (window.innerWidth < 1000) {
        this.stroke = Math.round(12 / 1.5)
      } else {
        this.stroke = 12
      }
      this.radius.push(this.$refs.round1.clientWidth)
      this.radius.push(this.$refs.round2.clientWidth)
      this.radius.push(this.$refs.round3.clientWidth)
      this.radius.push(this.$refs.round4.clientWidth)
      this.radius.push(this.$refs.round5.clientWidth)
    }
  },
  mounted () {
    this.resize()
    window.addEventListener('resize', this.resize)
  }
}
</script>
