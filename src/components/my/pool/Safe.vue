<template>
  <div>
    <div
      class="w-100 br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 ai-c jc-c mb-5-S fd-r"
    >
      <div class="fw-600 f-cyan-1500 mr-3-S">$GENS</div>
      <div class="f-white-200 fs-5-S">
        GENS is a stable coin of HGEN platform designed to be pegged to USD.
        <br />
        GENS is main currency for our borrowing and lending protocol.
      </div>
    </div>
    <div
      class="w-100 br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 fd-c ai-c jc-c"
    >
      <div class="w-70" :class="{ 'op-0': getLoading }">
        <div class="w-100" v-if="getTotalNotifications > 0">
          <NotificaitonsTx />
        </div>

        <div class="fd-r">
          <div
            class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-2-S pb-10-XS ta-c-XS fd-r ai-c jc-sb"
          >
            GENS Staking
          </div>
          <div class="w-50 fd-c ai-r">
            <div
              class="w-100 fs-4-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS ta-r-S ta-c-XS"
            >
              Your current pool share
            </div>
            <div
              class="w-100 fs-7-S fs-20-XS f-white-200 ta-c-XS pb-2-S pb-10-XS ta-c-XS mb-10-XS fw-600"
            >
              <span class="fs-7-S fs-25-XS f-white-200 fw-800">{{
                getDepositAmount.toLocaleString()
              }}</span>
              <span class="mr-1"> GENS </span>(<span
                class="fw-800 f-white-200"
                >{{ getPercent.toLocaleString() }}</span
              >
              <span class="fw-600 pr-1">% </span>)
            </div>
          </div>
        </div>
        <div class="w-100 fd-r-S fd-r-XS mcolor-1000 bs-sb-all rad-fix-10">
          <div class="w-50-S w-100-XS">
            <AmButton
              color=""
              bColor="gradient-5002"
              full
              opacityEffect
              scaleEffect
              disableShadow
              v-if="!getWithdrawOrDeposit"
              @click="changeWithdrawFunc"
              class="rad-fix-10"
            >
              Deposit
            </AmButton>
            <AmButton
              color="gradient-5001"
              bColor="gradient-5001"
              colorText="white-200"
              full
              disabled
              v-if="getWithdrawOrDeposit"
              class="rad-fix-10"
            >
              Deposit
            </AmButton>
          </div>
          <div class="w-50-S w-100-XS">
            <AmButton
              color="gradient-5000"
              bColor="gradient-5000"
              colorText="white-200"
              full
              disabled
              v-if="!getWithdrawOrDeposit"
              class="rad-fix-10"
            >
              Withdraw
            </AmButton>
            <AmButton
              color="mcolor-1000"
              bColor="mcolor-1000"
              full
              opacityEffect
              scaleEffect
              disableShadow
              v-if="getWithdrawOrDeposit"
              @click="changeWithdrawFunc"
              class="rad-fix-10"
            >
              Withdraw
            </AmButton>
          </div>
        </div>
        <div
          class="w-100 mt-4 mb-2 mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          v-if="!getWithdrawOrDeposit"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Set amount you want to withdraw
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >GENS</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0"
              v-model="withdrawAmount"
            />
            <span
              class="fs-5-S fs-20-XS f-cyan-200 fw-500 ts-3 hv d-n-XS fsh-0 py-1 rad-fix-10"
              @click="setMaxWithdraw"
              >max</span
            >
          </div>
        </div>
        <div
          class="w-100 mt-4 mb-2 mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          v-if="getWithdrawOrDeposit"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Set amount to deposit
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >GENS</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0"
              v-model="from"
            />
            <span
              class="fs-5-S fs-20-XS f-cyan-200 fw-500 ts-3 hv d-n-XS fsh-0 py-1 "
              @click="setMax"
              >max</span
            >
          </div>
        </div>
        <div
          class="w-100 fd-r-S fd-c-XS pt-4-S pt-20-XS"
          v-if="getWithdrawOrDeposit"
        >
          <div class="w-50-S w-100-XS mr-2-S mr-0-XS">
            <AmButton
              color="gradient-1000"
              bColor="gradient-1000"
              opacityEffect
              full
              @click="reset"
              v-if="getWithdrawOrDeposit"
              class="rad-fix-10"
            >
              Reset
            </AmButton>
          </div>
          <div
            class="w-50-S w-100-XS ml-2-S ml-0-XS mt-0-S mt-4-XS mt-0-S mt-10-XS"
          >
            <AmButton
              color="gradient-5002"
              bColor="gradient-5002"
              opacityEffect
              full
              @click="depositFunc"
              v-if="getWithdrawOrDeposit"
              class="rad-fix-10"
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
              color="gradient-1000"
              bColor="gradient-1000"
              opacityEffect
              full
              @click="reset"
              v-if="!getWithdrawOrDeposit"
              class="rad-fix-10"
            >
              Reset
            </AmButton>
          </div>
          <div
            class="w-50-S w-100-XS ml-2-S ml-0-XS mt-0-S mt-4-XS mt-0-S mt-10-XS"
          >
            <AmButton
              color="gradient-5002"
              bColor="gradient-5002"
              opacityEffect
              full
              @click="closeDepositFunc"
              v-if="!getWithdrawOrDeposit"
              class="rad-fix-10"
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
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import Hint from "@/components/Hint";
import { Icon, Tooltip, Modal } from "ant-design-vue";
import NotificaitonsTx from "@/components/NotificationTx.vue";

export default {
  components: {
    Loading,
    Hint,
    NotificaitonsTx,
    Icon,
    Tooltip,
    Modal,
  },
  data() {
    return {
      gen: "",
      hgen: "",
      from: null,
      withdrawAmount: "",
    };
  },
  computed: {
    getTotalNotifications() {
      return this.$accessor.notification.totalNotificaitons;
    },
    getDepositKey() {
      return this.$accessor.pool.depositKey.deposit;
    },
    getLoading() {
      return this.$accessor.pool.loading;
    },
    getDepositAmount() {
      return this.$accessor.pool.depositAmount;
    },
    getPercent() {
      if (
        this.$accessor.pool.depositAmount > this.$accessor.pool.totalDeposit &&
        this.$accessor.pool.depositAmount > 0
      ) {
        return 100;
      }
      return this.$accessor.pool.depositAmount ==
        this.$accessor.pool.depositAmount && this.$accessor.pool.depositAmount
        ? Number(
            (this.$accessor.pool.depositAmount / this.$accessor.totalDeposit) *
              100
          ).toFixed(2)
        : 0;
    },
    getDepositeTotal() {
      return this.$accessor.totalDeposit || 0;
    },
    getWithdrawOrDeposit() {
      return this.$accessor.pool.depositOrWithdraw;
    },
  },
  watch: {
    from(val) {
      if (val) {
        this.from = val.toString().replace(/[^+\d]/g, "");
        if (this.from.length > 1 && this.from.substr(0, 1) === "0") {
          this.from = 1;
        }
      }
    },
  },
  methods: {
    setMaxWithdraw() {
      if (this.getDepositKey) {
        this.withdrawAmount = this.$accessor.pool.depositAmount;
      } else {
        this.withdrawAmount = "";
      }
    },
    setMax() {
      // TODO change the deposit set max to add certain value
      if (this.$accessor.wallet.balanceGENS > 0) {
        this.from = this.$accessor.wallet.balanceGENS
          ? Math.floor(Number(this.$accessor.wallet.balanceGENS))
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
        console.log("reached here for new deposit");
        this.$accessor.pool.newDeposit({
          from: this.from,
          gen: "Dgb9x1ay5qEFHPimLJY9JZpTHcssdvYgM7aC5c2DVA73",
          hgen: "C52NZgDTrdevk8YY1Pq2bWxVqd2PteshuyXKavd6E6iz",
        });
      }
      this.from = null;
    },
    closeDepositFunc() {
      this.$accessor.pool.closeDeposit(this.withdrawAmount);
      this.withdrawAmount = null;
    },
    changeWithdrawFunc() {
      this.$accessor.pool.changeWithdrawAndDeposit(
        this.$accessor.pool.depositOrWithdraw
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  .popup {
    transform: translate(-50%, 1rem);
    display: none;
  }
  &:hover label + .popup {
    display: block;
  }
}
</style>
