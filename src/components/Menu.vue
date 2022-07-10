<template>
  <div class="w-100 fd-c jc-c">
    <div
      class="w-100 mcolor-1000 f-orange-400 fw-600 py-3-S py-10-XS jc-c ai-c ta-c"
      v-if="getPriceStatus"
    >
      {{ warningMsg }}
    </div>
    <div
      class="w-100 w-100-XS h-a-S h-100-XS fd-r py-3-S py-5-XS px-10 z-10 bs-menu"
    >
      <span
        class="w-100 h-100 p-f t-0 gradient-400 d-n-S ts-3"
        :class="{ 'l-100': !open, 'l-0': open }"
      ></span>
      <div
        class="w-100 h-a-S h-100-XS fd-r-S fd-c-XS ai-c p-r-S p-f-XS l-0 t-0 ts-3 ovh-y-v-S ovh-y-a-XS"
        :class="{ 'l-100': !open, 'l-0': open }"
      >
        <div class="w-100 fd-r-S fd-c-XS p-0-S p-20-XS pt-0-S pt-40-XS ai-c">
          <div
            class="w-a-S w-100-XS fsh-0 px-0-S px-20-XS mr-4 fd-r jc-c mb-5-XS"
          >
            <nuxt-link to="/" @click.native="turnOffLogo">
              <img
                src="@/assets/svg/symbol-hgen.png"
                class="h-fix-15-S h-fix-55-XS"
                v-if="getLogo"
            /></nuxt-link>
          </div>
          <!-- <nuxt-link
            class="w-a f-gray-600 fw-500 fs-5-M fs-7-S fs-25-XS link hv ts-3 mr-4 my-0-S my-10-XS"
            :to="{ path: '/my' }"
            @click.native="
              togglemenu();
              turnOnLogo();
            "
          >
            Dashboard
          </nuxt-link> -->
          <a
            class="w-a f-gray-600 fw-500 fs-5-M fs-7-S fs-25-XS link hv ts-3 mr-4 my-0-S my-10-XS"
            v-for="(item, i) in items"
            :key="i"
            :href="item.to"
            @click="togglemenu"
          >
            {{ item.title }}
          </a>
          <nuxt-link
            class="w-a f-gray-600 fw-500 fs-5-M fs-7-S fs-25-XS link hv ts-3 mr-4 my-0-S my-10-XS"
            :to="{ path: '/', hash: '#tokenomics' }"
            @click.native="togglemenu"
          >
            Tokenomics
          </nuxt-link>
          <a
            class="w-a f-gray-600 fw-500 fs-5-M fs-7-S fs-25-XS link hv ts-3 mr-4 my-0-S my-10-XS"
            href="https://drive.google.com/file/d/1BFL66WIzFpEjyrLbBtPUEx9vV7Si0RDp/view?usp=sharing"
            @click="togglemenu"
            target="_blank"
          >
            Whitepaper
          </a>
        </div>
        <div class="w-a-S w-100-XS fsh-0 px-0-S px-20-XS">
          <AmButton
            color="mcolor-100"
            opacityEffect
            scaleEffect
            :full="mobile"
            @click="$emit('connect', 'connect')"
            v-if="!publicKey"
          >
            <span class="fw-800 pr-1 f-mcolor-300">SOL</span> Connect Wallet
          </AmButton>
          <div
            class="w-a-S w-100-XS d-ib rad-fix-2 br-4 brs-s mcolor-100 shadow-purple-100 br-purple-700 f-white-200 px-0-S px-10-XS"
            v-if="publicKey"
          >
            <span
              class="w-a-S w-100-XS d-f fd-c-S fd-r-XS ai-c jc-c ta-c px-6 fs-4-S fs-20-XS fw-500 z-2 h-fix-s-28min-S h-fix-s-100min-XS"
            >
              <nuxt-link class="w-100 fd-r tt-u" to="/my">
                <span class="fw-800 pr-1-S pr-5-XS f-mcolor-300">SOL</span>
                {{ publicKey.substr(0, 6) }} ...... {{ publicKey.substr(-4) }}
              </nuxt-link>
              <div class="w-100 fd-r jc-r pt-1 fs-5-S fs-20-XS">
                <span class="hv ts-3" @click="$emit('logout')">
                  Disconnect
                </span>
              </div>
            </span>
          </div>
        </div>
      </div>
      <svg
        @click="open = !open"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        class="z-12 w-fix-40 p-a r-fix-s-25 t-fix-s-25 d-n-S d-b-s d-b-XS"
      >
        <rect width="20" height="2" rx="1" fill="white" />
        <rect x="4" y="8" width="16" height="2" rx="1" fill="white" />
        <rect y="16" width="20" height="2" rx="1" fill="white" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    publicKey: { type: String, default: null },
  },
  data() {
    return {
      warningMsg:
        "SOL price has decreased by more than 7%. Borrowing and lending will be halted in few hours.",
      items: [
        {
          title: "Beginners Guide",
          to: "https://docs.hgen.finance/beginners-guide",
        },
        { title: "Documentation", to: "https://docs.hgen.finance" },
      ],
      languages: {
        theme: "default",
        value: 1,
        items: [
          { label: "English", value: 1 },
          { label: "Russian", value: 2 },
        ],
        colorDefault: "mcolor-100",
        colorBackground: "mcolor-200",
        colorTitle: "white-200",
      },
      mobile: false,
      open: true,
    };
  },
  computed: {
    getLogo() {
      return this.$accessor.dashboard.logo;
    },
    getPriceStatus() {
      return this.$accessor.priceStat;
    },
  },
  watch: {
    open(val) {
      if (this.mobile) {
        if (val) {
          document.documentElement.style.overflow = "hidden";
        } else {
          document.documentElement.style.overflow = "auto";
        }
      }
    },
    // '$route' () {
    //     if (this.mobile){
    //          this.open  = false
    //     }
    //  }
    $route() {
      if (
        this.$route.fullPath === "/" ||
        this.$route.fullPath === "/#tokenomics"
      ) {
        this.$accessor.dashboard.changeLogoVis(false);
      } else {
        this.$accessor.dashboard.changeLogoVis(true);
      }
      console.log(this.$route.fullPath);
      //   console.log("the value changes", this.showLogo);
    },
  },
  methods: {
    resize() {
      if (window.innerWidth < 768) {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
      if (window.innerWidth < 768) {
        this.open = false;
      } else {
        this.open = true;
      }
    },
    togglemenu() {
      if (this.mobile) {
        this.open = !open;
      }
    },
    turnOnLogo() {
      this.$accessor.dashboard.changeLogoVis(true);
    },
    turnOffLogo() {
      this.$accessor.dashboard.changeLogoVis(false);
    },
  },
  mounted() {
    this.resize();
    this.getPriceStatus;
    window.addEventListener("resize", this.resize);
  },
};
</script>

// custom css for menu
<style lang="scss">
.bs-menu {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
</style>
