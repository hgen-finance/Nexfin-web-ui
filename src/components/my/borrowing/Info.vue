<template>
  <div class="w-100">
    <div
      class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS"
    >
      <Balance />
    </div>
    <div
      class="w-100 p-4-S p-10-XS  rad-fix-3 mt-5-S  mb-4-S mb-10-XS"
    >
      <div class="w-100">
        <div
          class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 pb-2-S mt-2-S mt-5-XS mb-2-S mb-5-XS brbs-s br-gray-800"
        >
          GENS Total Borrowing of Platform
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c s">
            Total Borrow
          </div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-400 f-white-200 fd-r ai-c"
          >
            {{ getTotalBorrow }}
            <span class="f-white-200 pl-1-S pl-5-XS">GENS</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS  rad-fix-3  mt-2-S mt-10-XS mb-2-S mb-10-XS"
      v-if="withdrawOrDeposit"
    >
      <div
        class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 mt-2-S mt-5-XS mb-2-S mb-5-XS"
      >
        Borrow Calculation
      </div>
      <div class="w-100" v-if="withdrawOrDeposit">
        <div class="w-100">
          <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
            <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
              Debt
              <Hint> Debt = The borrowed amount </Hint>
            </div>
            <div
              class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-600 f-white-200 fd-r ai-c"
            >
              {{ getCurrentDebt }}
              <span class="f-white-200 pl-1-S pr-5-XS">GENS</span>
            </div>
          </div>
        </div>
        <div class="w-100 fd-r brbs-s brb-3 br-gray-800">
          <div class="w-100-S w-100-XS">
            <div class="w-100 fd-r py-2-S py-10-XS">
              <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
                Borrow Fee (<span class="f-white-200 fw-400">1.47 %</span>)
                <Hint
                  >Borrowers have to pay 1.47 % of the borrowed GENS in terms of
                  SOL at current SOL market price.</Hint
                >
              </div>
              <div
                class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-400 f-white-200 fd-r ai-c"
              >
                {{ getFee }}
                <span class="f-white-200 pl-1-S pr-5-XS">SOL</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Collateral Ratio (<span class="f-white-200 fw-400">CR</span>)
          </div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-400 f-white-200 fd-r ai-c"
          >
            {{ getDebt }}
            <span class="f-white-200 pl-1-S pr-5-XS">%</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-600 f-white-200 fd-r ai-c">
            Liquidation CR 115%
            <Hint>
              Trove will be liquidated if the Collateral Ratio drops below
              115%.</Hint
            >
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS  rad-fix-3  mt-2-S mt-10-XS mb-2-S mb-10-XS"
      v-if="!withdrawOrDeposit"
    >
      <div
        class="w-100 fs-6-S fs-20-XS fw-600 f-white-200 mt-2-S mt-5-XS pb-2-S mb-2-S mb-5-XS brbs-s br-gray-800"
      >
        Your Borrow Status
      </div>
      <div class="w-100" v-if="!withdrawOrDeposit">
        <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Collateral SOL
          </div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-400 f-white-200 fd-r ai-c"
          >
            <span class="f-white-200 mr-1">{{ getTroveCollateral || 0 }} </span
            ><span class="mr-1">SOL</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS brbs-s brb-3 br-gray-800">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Debt
          </div>
          <div
            class="w-a fs-5-M fs-8-S fs-25-XS fsh-0 fw-400 f-white-200 fd-r ai-c"
          >
            <span class="f-white-200 mr-1">
              {{ getTroveAmount ? getTroveAmount.toLocaleString() : 0 }} </span
            ><span class="mr-1">GENS</span> (<span class="f-white-200">
              {{ getRatio }}</span
            >% CR)
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 mcolor-800 p-4-S p-15-XS mt-4-S mt-10-XS rad-fix-4 fs-5-S fs-20-XS f-"
      v-if="
        (Number(getDebt) < getMaxRatio || Number(to) < 100) &&
        from &&
        to &&
        !getIsBorrow
      "
    >
      <!-- change the minimum borrow later -->
      <div class="w-100 pb-2-S pb-10-XS" v-if="Number(to) < 100">
        The minimum borrowing amount is <span class="fw-600">100 GENS</span>
      </div>
      <div class="w-100" v-if="Number(getDebt) < getMaxRatio">
        The CR limit is minimum <span class="fw-600">{{ getMaxRatio }} %</span>
      </div>
    </div>

    <div
      class="w-100 mcolor-800 p-4-S p-15-XS mt-4-S mt-10-XS rad-fix-4 fs-5-S fs-20-XS f- mb-4-S mb-10-XS"
      v-if="disputeDebt < 0"
    >
      <!-- <div
        class="w-100 pb-2-S pb-10-XS"
        v-if="disputeDebt > 0 && getTroveAmount"
      >
        You need <span class="fw-600">{{ disputeDebt }}</span> more to close
        Borrow.
      </div> -->
      <div class="w-100 pb-2-S pb-10-XS" v-if="disputeDebt < 0">
        Exceeded the debt amount.
      </div>
    </div>
    <div
      class="w-100 mcolor-800 p-4-S p-15-XS mt-4-S mt-10-XS rad-fix-4 fs-5-S fs-20-XS f- mb-4-S mb-10-XS"
      v-if="CheckWalletBalance"
    >
      <div class="w-100 pb-2-S pb-10-XS" v-if="CheckWalletBalance">
        You don't have enough GENS for this transaction.
      </div>
    </div>
    <div
      class="w-100 mcolor-800 p-4-S p-15-XS mt-4-S mt-10-XS rad-fix-4 fs-5-S fs-20-XS f- mb-4-S mb-10-XS"
      v-if="getCurrentRatio < 130 && this.repayCr"
    >
      <div class="w-100 pb-2-S pb-10-XS">
        Warning! Collateral Ratio is below 130%. Trove is liquidated at 115%.
      </div>
    </div>
  </div>
</template>

<script>
import Hint from "@/components/Hint";
import Balance from "@/components/my/borrowing/Balance.vue";
import { getCollateral } from "@/utils/layout";
import BN from "bn.js";

export default {
  components: {
    Hint,
    Balance,
  },
  data() {
    return {
      liquidationCR: "114",
    };
  },
  props: {
    to: { type: Number, default: null },
    from: { type: Number, default: null },
    repayTo: { type: Number, default: null },
    repayCr: { type: Number, default: null },
  },
  watch: {
    repayTo: function (newVal, oldVal) {
      // watch the changes to repayTo for the collateral
      console.log("Prop changed: ", newVal, " | was: ", oldVal);
    },
    repayCr: function (newVal, oldVal) {
      console.log("Prop changed cr", newVal, "| was: ", oldVal);
    },
  },
  computed: {
    getCurrentRatio() {
      return this.repayCr;
    },
    getMaxRatio() {
      if (this.$accessor.lightMode) {
        return 115;
      } else {
        return 115;
      }
    },
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getGensBalance() {
      return this.$accessor.wallet.balanceGENS || 0;
    },
    getTotalBorrow() {
      return this.$accessor.troveTotal.toFixed(2) || "0.00";
    },
    getFee() {
      let fee = 0;
      if (this.to > 0) {
        fee = this.to;
        fee = fee ? (this.to * 1.47) / 100 / this.getUsd : 0;

        const MIN_FEE = 5 / this.getUsd;
        fee = fee < MIN_FEE ? MIN_FEE : fee;
        let fee_trim = fee.toString().split(".");
        if (fee_trim.length > 1 && fee_trim[1].length > 9) {
          fee =
            Number(fee_trim[0]).toLocaleString() +
            "." +
            fee_trim[1].substr(0, 9);
        }
      }

      return fee;
    },
    getDebt() {
      //   let currentColl = this.$accessor.borrowing.debt || 0;
      //   let prevColl = Number(this.getRatio);
      //   console.log(currentColl, "|", prevColl);
      //   let totalColl =
      //     prevColl > 0 && currentColl > 0
      //       ? (currentColl + prevColl) / 2
      //       : currentColl;
      //   console.log(totalColl, "totalColl");
      let totalColl = 0;
      if (this.$accessor.borrowing.trove.amountToClose > 0) {
        console.log(this.$accessor.borrowing.trove.amountToClose, "|", this.to);
        console.log(this.$accessor.borrowing.trove.lamports, "|", this.from);
        totalColl = getCollateral(
          (
            Number(this.$accessor.borrowing.trove.amountToClose) +
            parseInt(this.to)
          ).toString(),
          (
            Number(this.$accessor.borrowing.trove.lamports) +
            parseInt(this.from) * 1000000000
          ).toString(),
          parseInt(this.$accessor.usd).toString()
        );
      } else {
        totalColl = this.$accessor.borrowing.debt || 0;
      }

      console.log(totalColl, "totalColl");
      return totalColl;
    },
    getCurrentDebt() {
      return Number(this.to) || 0;
    },
    getIsBorrow() {
      return this.$accessor.borrowing.troveId;
    },
    getTroveCollateral() {
      return (
        ((this.$accessor.borrowing.trove.lamports || 0) / 1e9).toFixed(2) || 0
      );
    },
    getTroveAmount() {
      return this.$accessor.borrowing.trove
        ? this.$accessor.borrowing.trove.amountToClose
        : 0;
    },
    getRatio() {
      return this.$accessor.borrowing.trove.amountToClose > 0
        ? getCollateral(
            this.$accessor.borrowing.trove.amountToClose.toString(),
            this.$accessor.borrowing.trove.lamports.toString(),
            parseInt(this.$accessor.usd).toString()
          )
        : 0;
    },
    withdrawOrDeposit() {
      return this.$accessor.borrowing.borrowOrPay;
    },

    amountReceived() {
      return this.$accessor.borrowing.trove.amountToClose
        ? (this.$accessor.borrowing.trove.amountToClose / this.$accessor.usd)
            .toFixed(2)
            .toString()
        : 0;
    },

    // returns the debt amount remaining in gens
    disputeDebt() {
      return Number(this.$accessor.borrowing.closeAmount);
      //return Number(this.getTroveAmount) - Number(this.repayTo);
    },

    liquidationPrice() {
      return (this.liquidationCR * this.to) / (this.from * 100) || 0;
    },
    CheckWalletBalance() {
      return this.getGensBalance < this.repayTo;
    },
  },
};
</script>
