<template>
  <div
    class="w-100 br-sb bs-sb gradient-200 p-r-S p-f-XS l-0 t-0-S t-a-XS b-a-S b-0-XS pl-10-M pl-5-S pl-0-XS fd-c-S fd-r-XS mt-2-XS py-2-XS"
  >
    <span class="w-100 h-100 bg-r p-a l-0 t-0 d-n-S d-f-XS" />
    <div class="w-100" v-for="item in items" :key="item.class">
      <nuxt-link
        :to="item.to"
        class="w-a-M w-100-S w-100-XS fd-r-S fd-c-XS ai-c hv ts-3 my-2-S my-10-XS"
      >
        <div class="w-fix-s-15-S w-100-XS mr-2-S fd-r ai-c jc-l-S jc-c-XS">
          <HomeSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 1 && !getActive(item)"
          />
          <HomeActiveSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 1 && getActive(item)"
          />
          <WalletSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 2 && !getActive(item)"
          />
          <WalletActiveSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 2 && getActive(item)"
          />
          <SwitchSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 3 && !getActive(item)"
          />
          <SwitchActiveSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 3 && getActive(item)"
          />
          <PieSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 4 && !getActive(item)"
          />
          <PieActiveSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 4 && getActive(item)"
          />
          <CoinsSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 5 && !getActive(item)"
          />
          <CoinsActiveSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 5 && getActive(item)"
          />
          <CoinsSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 6 && !getActive(item)"
          />
          <CoinsActiveSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 6 && getActive(item)"
          />
          <CoinsSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 7 && !getActive(item)"
          />
          <CoinsActiveSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 7 && getActive(item)"
          />
          <CoinsSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 8 && !getActive(item)"
          />
          <CoinsActiveSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 8 && getActive(item)"
          />
          <CoinsSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 9 && !getActive(item)"
          />
          <CoinsActiveSvg
            class="w-fix-10-S w-80-XS"
            v-if="item.id === 9 && getActive(item)"
          />
          <!-- <SwitchSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 10 && !getActive(item)"
          />
          <SwitchActiveSvg
            class="w-fix-10-S w-40-XS"
            v-if="item.id === 10 && getActive(item)"
          /> -->
        </div>
        <span
          class="fs-5-S fs-4-XS ts-3 pt-0-M pt-0-S pt-2-XS d-f-S d-n-XS"
          :class="{
            'f-mcolor-300 fw-600': getActive(item),
            'f-white-200 fw-400': !getActive(item),
          }"
        >
          {{ item.name }}
        </span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import HomeSvg from "@/assets/svg/my/home.svg?inline";
import HomeActiveSvg from "@/assets/svg/my/homeActive.svg?inline";
import WalletSvg from "@/assets/svg/my/wallet.svg?inline";
import WalletActiveSvg from "@/assets/svg/my/walletActive.svg?inline";
import SwitchSvg from "@/assets/svg/my/switch.svg?inline";
import SwitchActiveSvg from "@/assets/svg/my/switchActive.svg?inline";
import PieSvg from "@/assets/svg/my/pie.svg?inline";
import PieActiveSvg from "@/assets/svg/my/pieActive.svg?inline";
import CoinsSvg from "@/assets/svg/my/coins.svg?inline";
import CoinsActiveSvg from "@/assets/svg/my/coinsActive.svg?inline";
import DiggingSvg from "@/assets/svg/my/digging.svg?inline";
import DiggingActiveSvg from "@/assets/svg/my/diggingActive.svg?inline";
import ExitSvg from "@/assets/svg/my/exit.svg?inline";

export default {
  components: {
    HomeSvg,
    HomeActiveSvg,
    WalletSvg,
    WalletActiveSvg,
    SwitchSvg,
    SwitchActiveSvg,
    PieSvg,
    PieActiveSvg,
    CoinsSvg,
    CoinsActiveSvg,
    DiggingSvg,
    DiggingActiveSvg,
    ExitSvg,
  },
  methods: {
    getActive(item) {
      return $nuxt.$route.name === item.class || false;
    },
  },
  data() {
    return {
      items: [
        { id: 1, name: "Dashboard", to: "/", class: "my" },

        { id: 2, name: "Borrow", to: "/borrowing", class: "my-borrowing" },

        { id: 4, name: "GENS Staking", to: "/pool", class: "my-pool" },

        { id: 3, name: "Swap", to: "/swap", class: "my-swap" },

        {
          id: 8,
          name: "Liquidity",
          to: "/liquidity",
          class: "my-liquidity",
        },
        { id: 6, name: "Farm", to: "/farming", class: "my-farming" },

        {
          id: 7,
          name: "PF Stake Pool",
          to: "/PFStakePool",
          class: "my-projectfarm",
        },

        {
          id: 5,
          name: "Liquidation",
          to: "/liquidation",
          class: "my-risky",
        },

        {
          id: 9,
          name: "Liquidity Pool",
          to: "/liquidityPool",
          class: "my-liquidityPool",
        },
        // {
        //   id: 10,
        //   name: "Multi Send",
        //   to: "/multiSend",
        //   class: "my-multiSend",
        // },
      ],
    };
  },
};
</script>

// custom css for sidebar
<style lang="scss">
.bs-sb {
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}
.br-sb {
  border-radius: 15px;
}
</style>
