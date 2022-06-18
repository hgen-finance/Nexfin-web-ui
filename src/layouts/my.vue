<template>
  <div class="w-100 h-100min">
    <div class="w-100 h-100min p-f l-0 t-0 ovh-y-a bg-r" />
    <Menu @connect="setModalFunc" :publicKey="publicKey" @logout="logout" />
    <!-- <div class="w-100 fd-r jc-c pt-0" v-if="publicKey && wallet"> -->

    <MarketDetails />
    <div class="w-100 fd-r jc-c pt-0" v-if="true">
      <div class="w-100-L w-100-M w-100-S w-100-XS fd-r jc-c">
        <div class="w-15-L w-15-M w-15-S w-0-XS fsh-0 z-10 pt-0-S pt-5-XS">
          <Sidebar class="r-fix-s-15-M" />
        </div>
        <div class="w-95-L w-95-M w-95-S w-100-XS fd-r jc-c">
          <div
            class="w-100-L w-100-M w-100-S w-100-XS px-0-S px-20-XS pt-0-S pt-50-XS fd-r jc-c"
          >
            <Nuxt />
          </div>
        </div>
      </div>
    </div>
    <div class="w-100 pb-0-S pb-40-XS">
      <Footer />
    </div>
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
</template>

<script>
import Balance from "@/components/my/Balance.vue";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import MarketDetails from "@/components/marketdetails.vue";

import ConnectWallet from "@/components/modals/ConnectWallet";
import ConnectError from "@/components/modals/ConnectError";

import { AccountInfo } from "@solana/web3.js";
import Marketdetails from "@/components/marketdetails.vue";
export default {
  // change that later
  //   fetch() {
  //     if (!this.$store.$wallet && !this.publicKey) {
  //       this.logout();
  //     }
  //   },
  components: {
    Balance,
    Menu,
    Footer,
    Sidebar,
    ConnectWallet,
    ConnectError,
    MarketDetails,
  },
  computed: {
    publicKey() {
      return this.$accessor.wallet.publicKey || null;
    },
    wallet() {
      return this.$store.$wallet || null;
    },
    modal() {
      return this.$accessor.modal;
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
    logout() {
      this.$accessor.wallet.logout();
    },
  },
  mounted() {
    this.$accessor.pool.getDeposit();
    this.$accessor.borrowing.getTrove();
    this.$accessor.wallet.getBalance();
    this.$accessor.wallet.getHGENBalance();
    this.$accessor.wallet.getGENSBalance();
    this.$accessor.getInfo();
  },
};
</script>
