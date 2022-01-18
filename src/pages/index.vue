<template>
  <div class="w-100 fd-c ai-c py-6">
    <Particles
      id="tsparticles"
      :options="{
        fpsLimit: 60,
        particles: {
          color: {
            value: '#8E24AA',
          },
          move: {
            enable: true,
          },
          links: {
            enable: true,
            color: '#ba63ff',
          },
        },
      }"
    />
    <div class="w-75 fd-c ai-c py-6">
      <Header @connect="setModalFunc" :publicKey="publicKey" />
      <Future />
      <DefiFeatures />
      <Tax />
      <Hgen />
      <Statistic />
      <Gens />
      <Roadmap />
      <Advisors />
      <AmModal
        :show="modal === 'connect'"
        :shadow="errorConnect ? 'shadow-red-100' : 'shadow-purple-300'"
        max="w-fix-250-S w-90-XS"
        @closed="setModalFunc"
      >
        <ConnectWallet
          @cancel="setModalFunc"
          @set="connectWalletFunc"
          :wallets="wallets"
          :error="errorConnect"
          :loader="loaderConnect"
        />
      </AmModal>
      <AmModal
        :show="modal === 'connectError'"
        shadow="shadow-red-100"
        max="w-fix-250-S w-90-XS"
        @closed="setModalFunc"
      >
        <ConnectError />
      </AmModal>
    </div>
  </div>
</template>

<script>
import Header from "@/components/HomeScreen/Header";
import Future from "@/components/HomeScreen/Future";
import DefiFeatures from "@/components/HomeScreen/DefiFeatures";
import Hgen from "@/components/HomeScreen/Hgen";
import Gens from "@/components/HomeScreen/Gens";
import Statistic from "@/components/HomeScreen/Statistic";
import Roadmap from "@/components/HomeScreen/Roadmap";
import Advisors from "@/components/HomeScreen/Advisors";
import Tax from "@/components/HomeScreen/Tax";
import AOS from "aos";
import "aos/dist/aos.css";

import ConnectWallet from "@/components/modals/ConnectWallet";
import ConnectError from "@/components/modals/ConnectError";

import Vue from "vue";
import Particles from "particles.vue";

// must add it to run the particles
Vue.use(Particles);

export default {
  components: {
    Header,
    Future,
    DefiFeatures,
    Tax,
    Hgen,
    Gens,
    Statistic,
    Roadmap,
    Advisors,
    ConnectWallet,
    ConnectError,
  },
  computed: {
    modal() {
      return this.$accessor.modal;
    },
    publicKey() {
      return this.$accessor.wallet.publicKey;
    },
    wallets() {
      return this.$accessor.wallet.wallets;
    },
    errorConnect() {
      return this.$accessor.wallet.errorConnect;
    },
    loaderConnect() {
      return this.$accessor.wallet.loaderConnect;
    },
  },
  methods: {
    setModalFunc(value) {
      if (this.loaderConnect) {
        this.$accessor.wallet.setLoaderConnect(false);
      } else {
        this.$accessor.setModal(value);
      }
    },
    connectWalletFunc(value) {
      this.$accessor.wallet.connectWallet(value);
    },
  },
  mounted() {
    this.$accessor.getInfo();
    AOS.init();
    this.$nextTick(() => {
      window.$nuxt.$root.$loading.percent;
      setTimeout(() => window.$nuxt.$root.$loading.finish(), 500);
    });
  },
};
</script>
