<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100"
  >
    <div class="w-100" :class="{ 'op-0': getLoading }">
      <div
        class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-2-S pb-10-XS ta-c-XS"
      >
        Lend
      </div>
      <div
        class="w-100 fs-5-S fs-20-XS f-gray-500 pb-1-S pb-5-XS ta-c-XS"
        v-if="getDepositKey"
      >
        Your current pool share
      </div>
      <div
        class="w-100 fs-7-S fs-20-XS f-white-200 ta-c-XS pb-2-S pb-10-XS ta-c-XS mb-10-XS fw-600"
        v-if="getDepositKey"
      >
        <span class="fs-7-S fs-25-XS f-mcolor-100 fw-800">{{
          getDepositAmount.toLocaleString()
        }}</span>
        <span class="mr-1"> GENS </span>(<span class="fw-800 f-mcolor-100 ">{{
          getPercent.toLocaleString()
        }}</span>
        <span class="fw-600 pr-1">% </span>CR)
      </div>
      <div class="w-100 pt-6-S pb-15-XS fd-r-S fd-r-XS">
        <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS">
          <AmButton
            shadow="shadow-green-100"
            color="green-500"
            bColor="green-500"
            opacityEffect
            scaleEffect
            full
            v-if="!getWithdrawOrDeposit"
            @click="changeWithdrawFunc"
          >
            Deposit
          </AmButton>
          <AmButton
            color="green-500"
            bColor="green-500"
            colorText="white-200"
            full
            disabled
            v-if="getWithdrawOrDeposit"
          >
            Deposit
          </AmButton>
        </div>
        <div class="w-50-S w-100-XS ml-2-L ml-2-S ml-0-XS">
          <AmButton
            color="red-500"
            bColor="red-500"
            colorText="white-200"
            full
            disabled
            v-if="!getWithdrawOrDeposit"
          >
            Withdraw
          </AmButton>
          <AmButton
            shadow="shadow-red-100"
            color="red-500"
            bColor="red-500"
            full
            opacityEffect
            scaleEffect
            v-if="getWithdrawOrDeposit"
            @click="changeWithdrawFunc"
          >
            Withdraw
          </AmButton>
        </div>
      </div>
      <div
        class="w-100  mt-4 mb-2 mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
        v-if="!getWithdrawOrDeposit"
      >
        <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">
          Set amount you want to withdraw
        </div>
        <div class="w-100 fd-r ai-c">
          <span class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
            >GENS</span
          >
          <input
            type="text"
            class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300"
            placeholder="0"
            v-model="from"
          />
          <span class="fs-6 f-mcolor-100 td-u ts-3 hv d-n-XS fsh-0"
            >Close Lend</span
          >
        </div>
      </div>
      <div
        class="w-100  mt-4 mb-2 mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
        v-if="getWithdrawOrDeposit && getDepositKey"
      >
        <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">
          Set amount to deposit
        </div>
        <div class="w-100 fd-r ai-c">
          <span class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
            >GENS</span
          >
          <input
            type="text"
            class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-mcolor-300"
            placeholder="0"
            v-model="from"
          />
          <span
            class="fs-6 f-mcolor-100 td-u ts-3 hv d-n-XS fsh-0"
            @click="setMax"
            >Max</span
          >
        </div>
      </div>
      <div
        class="w-100 fd-r-S fd-c-XS pt-4-S pt-20-XS"
        v-if="getDepositKey && getWithdrawOrDeposit"
      >
        <div class="w-50-S w-100-XS mr-2-S mr-0-XS">
          <AmButton
            color="mcolor-200"
            bColor="mcolor-100"
            opacityEffect
            full
            @click="reset"
            v-if="getDepositKey && getWithdrawOrDeposit"
          >
            Reset
          </AmButton>
        </div>
        <div
          class="w-50-S w-100-XS ml-2-S ml-0-XS mt-0-S mt-4-XS mt-0-S mt-10-XS"
        >
          <AmButton
            color="mcolor-100"
            bColor="mcolor-100"
            opacityEffect
            full
            @click="depositFunc"
            v-if="getDepositKey && getWithdrawOrDeposit"
          >
            confirm
          </AmButton>
        </div>
      </div>
      <div
        class="w-100 fd-r-S fd-c-XS pt-4-S pt-20-XS"
        v-if="!getWithdrawOrDeposit"
      >
        <div class="w-50-S w-100-XS mr-2-S mr-0-XS">
          <AmButton
            color="mcolor-200"
            bColor="mcolor-100"
            opacityEffect
            full
            @click="reset"
            v-if="!getWithdrawOrDeposit"
          >
            Reset
          </AmButton>
        </div>
        <div
          class="w-50-S w-100-XS ml-2-S ml-0-XS mt-0-S mt-4-XS mt-0-S mt-10-XS"
        >
          <AmButton
            color="mcolor-100"
            bColor="mcolor-100"
            opacityEffect
            full
            @click="closeDepositFunc"
            v-if="!getWithdrawOrDeposit"
          >
            confirm
          </AmButton>
        </div>
      </div>
    </div>
    <div class="w-100 h-100 p-a l-0 t-0 fd-r ai-c jc-c" v-if="getLoading">
      <Loading />
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";

export default {
  components: {
    Loading
  },
  data() {
    return {
      gen: "",
      hgen: "",
      from: null
    };
  },
  computed: {
    getDepositKey() {
      console.log(this.$accessor.pool.depositKey);
      return this.$accessor.pool.depositKey;
    },
    getLoading() {
      return this.$accessor.pool.loading;
    },
    getDepositAmount() {
      return this.$accessor.pool.depositAmount;
    },
    getPercent() {
      return Number.parseInt(
        (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit || 0) *
          100
      );
    },
    getDepositeTotal() {
      return this.$accessor.totalDeposit || 0;
    },
    getWithdrawOrDeposit() {
      return this.$accessor.pool.depositOrWithdraw;
    }
  },
  watch: {
    from(val) {
      if (val) {
        this.from = val.toString().replace(/[^+\d]/g, "");
        if (this.from.length > 1 && this.from.substr(0, 1) === "0") {
          this.from = 1;
        }
      }
    }
  },
  methods: {
    setMax() {
      // TODO change the deposit set max to add certain value
      if (this.$accessor.wallet.balanceGENS > 0) {
        this.from = this.$accessor.wallet.balanceGENS
          ? Number(this.$accessor.wallet.balanceGENS).toFixed(0) - 1
          : 0;
      } else {
        this.form = null;
      }
    },
    reset() {
      this.from = null;
      this.to = null;
    },
    depositFunc() {
      if (this.getDepositKey) {
        this.$accessor.pool.addDeposit({ from: this.from });
      } else {
        this.$accessor.pool.newDeposit({
          from: this.from,
          gen: "Dgb9x1ay5qEFHPimLJY9JZpTHcssdvYgM7aC5c2DVA73",
          hgen: "C52NZgDTrdevk8YY1Pq2bWxVqd2PteshuyXKavd6E6iz"
        });
      }
      this.from = null;
    },
    closeDepositFunc() {
      this.$accessor.pool.closeDeposit(this.from);
      this.from = null;
    },
    changeWithdrawFunc() {
      this.$accessor.pool.changeWithdrawAndDeposit(
        this.$accessor.pool.depositOrWithdraw
      );
    }
  }
};
</script>
