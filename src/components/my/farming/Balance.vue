<template>
  <div class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all pt-0-XS">
    <div
      class="w-100 fs-8-S fs-40-XS fw-600 f-white-200 pb-5-L pb-5-M pb-6-S pb-30-XS ta-c-XS fd-r"
    >
      <div
        class="w-70 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 fd-r ai-c"
      >
        Your Wallet Balance
      </div>
      <div
        class="w-30 fs-4-L fs-4-M fs-6-S fs-15-XS fw-400 f-gray-500 fd-r ai-c jc-r"
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
          <div class="w-80 fs-5-S fs-20-XS fw-500 f-gray-600 fd-r jc-r">
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
            {{ getBalanceHGEN }}
            <!-- ($ {{ getBalance > 0 ? getUsdBalance : 0 }}) -->
            ($ {{ getBalanceHGEN }})
          </div>
        </div>
      </div>
      <div class="w-100-L w-100-M w-100-S w-100-XS">
        <div class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 fd-r">
          <div class="w-20 fs-6-S fs-20-XS fw-600 f-mcolor-100 fd-r ai-c">
            GENS
          </div>
          <div class="w-80 fs-5-S fs-20-XS fw-500 f-gray-600 fd-r jc-r">
            {{ getBalanceGENS }}
            ($ {{ getBalanceGENS }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PublicKey } from "@solana/web3.js";
export default {
  data() {
    return {
      updateSol: this.$accessor.wallet.updateBalance(),
    };
  },
  watch: {
    updateSol(val) {
      console.log(val);
    },
  },
  computed: {
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getBalance() {
      let result = 0;
      if (this.$accessor.wallet.balance) {
        result = Number(this.$accessor.wallet.balance).toString().split(".");
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }
      return result.toString();
    },
    getBalanceHGEN() {
      let result = 0;
      if (this.$accessor.wallet.balanceHGEN) {
        result = Number(this.$accessor.wallet.balanceHGEN)
          .toString()
          .split(".");
        console.log("the gens is", result);
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }

      return result.toString();
    },
    getBalanceGENS() {
      let result = 0;
      if (this.$accessor.wallet.balanceGENS) {
        result = Number(this.$accessor.wallet.balanceGENS)
          .toString()
          .split(".");
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }
      return result.toString();
    },
    getUsdBalance() {
      let result = 0;
      if (this.getBalance) {
        result = (Number(this.getBalance) * this.getUsd).toString().split(".");
        if (result.length > 1) {
          result =
            result[1].length > 1
              ? Number(result[0]).toLocaleString() +
                "." +
                result[1].substr(0, 2)
              : Number(result[0].toLocaleString());
        }
      }
      return result.toString();
    },
    // getHGENBalance() {
    //   let result = 0;
    //   if (this.getBalanceHGEN) {
    //     result = (Number(this.getBalanceHGEN) * this.getUsd)
    //       .toString()
    //       .split(".");
    //     result =
    //       Number(result[0]).toLocaleString() + "." + result[1].substr(0, 2);
    //   }
    //   return result.toString();
    // },
    // getGENSBalance() {
    //   let result = 0;
    //   if (this.getBalanceGENS) {
    //     result = (Number(this.getBalanceGENS) * this.getUsd)
    //       .toString()
    //       .split(".");
    //     result =
    //       Number(result[0]).toLocaleString() + "." + result[1].substr(0, 2);
    //   }
    //   return result.toString();
    // }
  },
};
</script>
