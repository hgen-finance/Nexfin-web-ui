<template>
  <div class="w-100 pt-4-S pt-0-XS">
    <div
      class="w-100 fs-8-S fs-40-XS fw-600 f-white-200 pb-5-L pb-5-M pb-10-S pb-30-XS ta-c-XS fd-r"
    >
      <div
        class="w-70 fs-8-L fs-8-M fs-8-S fs-4-M fs-40-XS fw-600 f-white-200 fd-r ai-c"
      >
        Your Wallet Balance
      </div>
      <div
        class="w-30 fs-4-L fs-4-M fs-6-S fs-20-XS fw-400 f-gray-500 fd-r ai-c jc-r"
      >
        <span class="f-mcolor-100 pr-1-S pl-1-S pr-1-XS pl-5-XS"
          >Chainlink</span
        >
        Price
      </div>
    </div>
    <div class="w-100 fd-c fw-w">
      <div class="w-100-L w-100-M w-100-S w-100-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 fd-r">
          <div class="w-20 fs-6-S fs-20-XS fw-600 f-mcolor-100 fd-r ai-c">
            SOL
          </div>
          <div class="w-80 fs-5-S fs-20-XS fw-500 f-gray-600  fd-r jc-r">
            {{ getBalance > 0 ? getBalance : 0 }}
            ($ {{ getBalance > 0 ? getUsdBalance : 0 }})
          </div>
        </div>
      </div>
      <div class="w-100-L w-100-M w-100-S w-100-XS my-2 my-5-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
          <div class="w-20 fs-6-S fs-20-XS fw-600 f-mcolor-100 fd-r ai-c">
            HGEN
          </div>
          <div class="w-80 fs-5-S fs-20-XS fw-500 f-gray-600 fd-r jc-r">
            {{ getBalanceHGEN > 0 ? getBalanceHGEN.toLocaleString() : 0 }}
            ($ {{ getBalance > 0 ? getUsdBalance : 0 }})
          </div>
        </div>
      </div>
      <div class="w-100-L w-100-M w-100-S w-100-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 pb-3 fd-r">
          <div class="w-20 fs-6-S fs-20-XS fw-600 f-mcolor-100 fd-r ai-c">
            GENS
          </div>
          <div class="w-80 fs-5-S fs-20-XS fw-500 f-gray-600 fd-r jc-r">
            {{ getBalanceGENS > 0 ? getBalanceGENS.toLocaleString() : 0 }}
            ($ {{ getBalance > 0 ? getUsdBalance : 0 }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getBalance() {
      return this.$accessor.wallet.balance || 0;
    },
    getBalanceHGEN() {
      return this.$accessor.wallet.balanceHGEN || 0;
    },
    getBalanceGENS() {
      return this.$accessor.borrowing.trove?.borrowAmount || 0;
    },
    getUsdBalance() {
      let result = 0;
      if (this.getBalance) {
        result = (Number(this.getBalance) * this.getUsd).toString().split(".");
        result =
          Number(result[0]).toLocaleString() + "," + result[1].substr(0, 2);
      }
      return result.toString();
    },
    getHGENBalance() {
      let result = 0;
      if (this.getBalanceHGEN) {
        result = (Number(this.getBalanceHGEN) * this.getUsd)
          .toString()
          .split(".");
        result =
          Number(result[0]).toLocaleString() + "," + result[1].substr(0, 2);
      }
      return result.toString();
    }
  }
};
</script>
