<template>
  <div class="w-100 h-100min">
    <div class="w-100 h-100min p-f l-0 t-0 ovh-y-a bg-l" />
    <Menu @connect="setModalFunc" :publicKey="publicKey" @logout="logout" />
    <Nuxt />
    <Footer />
    <!-- <AmModal
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
    </AmModal> -->
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import ConnectWallet from "@/components/modals/ConnectWallet";
import ConnectError from "@/components/modals/ConnectError";

export default {
  components: {
    Menu,
    Footer,
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
