<template>
  <div>
    <div
      class="w-100 br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 fd-c ai-c jc-c mb-5-S fd-r"
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
            class="w-50 fs-8-S fs-25-XS fw-600 f-white-200 pb-4-S pb-15-XS ta-c-XS"
            data-tour-step="0"
          >
            Borrow
          </div>

          <div class="w-50 fd-c ai-r">
            <div
              class="w-100 fs-4-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS ta-r-S ta-c-XS"
            >
              Your Current Debt
            </div>
            <div
              class="fs-7-S fs-20-XS f-white-200 ta-c-XS pb-2-S pb-10-XS ta-c-XS mb-10-XS fw-600 ta-r-S"
              data-tour-step="1"
            >
              <span class="fs-7-S fs-25-XS f-white-200 fw-800">{{
                getDebt
              }}</span>
              <span class="mr-1"> GENS </span>(<span class="fw-800 f-white-200">
                {{ getRatio }}
              </span>
              <span class="fw-600 pr-1">% </span>CR)
            </div>
          </div>
        </div>
        <div class="w-100 fd-r-S fd-r-XS mcolor-1000 bs-sb-all rad-fix-10">
          <div class="w-50-S w-100-XS">
            <AmButton
              color="mcolor-1000"
              bColor="mcolor-1000"
              full
              opacityEffect
              scaleEffect
              disableShadow
              v-if="!getBorrowOrPay"
              @click="changeBorrowOrPayFunc"
              class="rad-fix-10"
            >
              Borrow
            </AmButton>
            <AmButton
              color="gradient-5000"
              bColor="gradient-5000"
              colorText="white-200"
              full
              disabled
              v-if="getBorrowOrPay"
              class="rad-fix-10"
            >
              Borrow
            </AmButton>
          </div>
          <div class="w-50-S w-100-XS">
            <AmButton
              color="gradient-5001"
              bColor="gradient-5001"
              colorText="white-200"
              full
              disabled
              v-if="!getBorrowOrPay"
              class="rad-fix-10"
            >
              Pay Debt
            </AmButton>
            <AmButton
              color=""
              bColor="gradient-5002"
              full
              opacityEffect
              scaleEffect
              disableShadow
              class="rad-fix-10"
              v-if="getBorrowOrPay"
              @click="changeBorrowOrPayFunc"
            >
              Pay Debt
            </AmButton>
          </div>
        </div>

        <div
          class="w-100 mt-4 mb-2 mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          data-tour-step="2"
          v-if="getBorrowOrPay"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Set amount of collateral
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >SOL</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0.00"
              v-model="from"
              maxlength="12"
            />
            <!-- <span
            class="fs-5-S fs-20-XS f-bg-new fw-500 ts-3 hv d-n-XS fsh-0 bg-new px-3 py-1 rad-fix-3"
            @click="setMax"
            >max</span
          > -->
          </div>
        </div>
        <div
          class="w-100 mb-4 mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          data-tour-step="3"
          v-if="getBorrowOrPay"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Amount received
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >GENS</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0.00"
              v-model="to"
              maxlength="20"
            />
          </div>
        </div>
        <div class="w-100 fd-r-S fd-c-XS mt-0-S mt-15-XS" v-if="getBorrowOrPay">
          <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS" data-tour-step="4">
            <AmButton
              color="gradient-1000"
              bColor="gradient-1000"
              opacityEffect
              full
              @click="reset"
              class="rad-fix-10"
            >
              reset
            </AmButton>
          </div>
          <div
            class="w-50-S w-100-XS ml-2-L ml-2-S ml-0-XS mt-0-S mt-8-XS"
            data-tour-step="5"
          >
            <AmButton
              color="gradient-5002"
              bColor="gradient-5002"
              opacityEffect
              full
              @click="confirmFunc"
              class="rad-fix-10"
            >
              confirm
            </AmButton>
          </div>
        </div>

        <!-- This section for the pay debt  -->
        <div
          class="w-100 mt-4 mb-4 mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          v-if="!getBorrowOrPay"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Set amount of repayment
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >GENS</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0.00"
              v-model="repayTo"
              maxlength="12"
            />
            <!-- <span
            class="fs-5-S fs-20-XS f-bg-new fw-500 ts-3 hv d-n-XS fsh-0 bg-new px-3 py-1 rad-fix-3"
            @click="setMaxGens"
            >max</span
          > -->
            <span
              class="fs-5-S fw-500 fs-20-XS f-cyan-300 ts-3 hv d-n-XS fsh-0 px-3-S px-5-XS py-2-S py-5-XS rad-fix-10"
              @click="closeTroveFunc"
              >Pay All Debt</span
            >
          </div>
        </div>

        <!-- for sol -->
        <div
          class="w-100 mt-4 mb-4 mcolor-1100 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS br-mcolor-800 brs-s-L br-1-L"
          v-if="!getBorrowOrPay"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Amount you want to receive in SOL
          </div>
          <div class="w-100 fd-r ai-c">
            <span
              class="w-15-S w-25-XS fs-6-S fs-20-XS fw-600 f-white-200 fsh-0"
              >SOL</span
            >
            <input
              type="text"
              class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-600 f-white-200"
              placeholder="0.00"
              v-model="repaySol"
              maxlength="12"
            />
          </div>
        </div>

        <!-- for collateral ratio   -->
        <div
          class="w-100 mt-4 mb-3 rad-fix-10 px-4-S px-10-XS py-3-S py-10-XS fd-r ai-c"
          v-if="!getBorrowOrPay"
        >
          <div class="w-100 fs-5-S fs-20-XS f-cyan-1500 pb-1-S pb-5-XS">
            Collateral Ratio
          </div>
          <div>
            <div class="w-100 fd-r ai-c">
              <input
                type="text"
                class="w-100 fs-8 mx-1 white-100 br-0 oul-n fs-20-XS fw-600 f-cyan-1500 ta-r"
                placeholder="0"
                v-model="collateralRatio"
                maxlength="12"
                disabled
                
              />
              <span class="f-white-200 fs-8 fw-500">%</span>
            </div>
          </div>
        </div>
        <div
          class="w-100 p-2-S mcolor-700 f-white-200 fs-6 rad-fix-8 mb-3"
          v-if="close && getIsBorrow && !getBorrowOrPay"
        >
          Your {{ getDebt }} GENS Debt will be repaid and you will receive
          collateral {{ getLamports / 1e9 }} SOL.
        </div>

        <!-- <div class="w-100 mb-3-S d-f jc-r" v-if="!getBorrowOrPay">
        <span
          class="fs-5-S fw-500 fs-20-XS f-bg-new ts-3 hv d-n-XS fsh-0 bg-new px-3-S px-5-XS py-2-S py-5-XS rad-fix-3"
          @click="closeTroveFunc"
          >Close Borrow</span
        >
      </div> -->

        <div
          class="w-100 fd-r-S fd-c-XS mt-0-S mt-15-XS"
          v-if="!getBorrowOrPay"
        >
          <div class="w-50-S w-100-XS mr-2-L mr-2-S mr-0-XS">
            <AmButton
              color="gradient-1000"
              bColor="gradient-1000"
              opacityEffect
              full
              @click="resetPay"
              class="rad-fix-10"
            >
              reset
            </AmButton>
          </div>
          <div class="w-50-S w-100-XS ml-2-L ml-2-S ml-0-XS mt-0-S mt-8-XS">
            <AmButton
              color="gradient-5002"
              bColor="gradient-5002"
              opacityEffect
              full
              @click="payTroveFunc"
              class="rad-fix-10"
            >
              confirm
            </AmButton>
          </div>
        </div>
      </div>
      <div
        class="w-100 my-2 fs-6-S f-red-500 fs-25-XS mcolor-800 p-3-S rad-fix-5"
        v-if="alert"
      >
        <span class="f-orange-600">
          {{ alertMessage }}
        </span>
      </div>
      <div
        class="w-100 my-2 fs-6-S f-red-500 fs-25-XS mcolor-800 p-3-S rad-fix-5"
        v-if="alertm"
      >
        <span class="f-orange-600">
          {{ alertmsg }}
        </span>
      </div>
      <div class="w-100 h-100 p-a l-0 t-0 fd-r ai-c jc-c" v-if="getLoading">
        <Loading />
      </div>
      <v-tour name="borrowGuide" :steps="steps" :options="myOptions"> </v-tour>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import { getCollateral } from "@/utils/layout";
import NotificaitonsTx from "@/components/NotificationTx.vue";

export default {
  components: {
    Loading,
    NotificaitonsTx,
  },
  data() {
    return {
      close: false,
      alert: false,
      alertMessage: "",
      modalSession: "",
      alertm: false,
      alertmsg: "",
      from: null,
      to: null,
      repayTo: null, // this.$accessor.borrowing.trove.amountToClose, // TO DO change this later
      repaySol: null,
      repayCr: null,
      mint: "",
      borrow: 0,
      depositAmount: 0,
      debtAmout: 0,
      borrowVal: 0,
      TotalNotificationTx: 0,
      myOptions: {
        useKeyboardNavigation: false,
        labels: {
          buttonSkip: "Skip tour",
          buttonPrevious: "Previous",
          buttonNext: "Next",
          buttonStop: "Finish",
        },
      },
      callbacks: {
        onPreviousStep: this.myCustomPreviousStepCallback,
        onNextStep: this.myCustomNextStepCallback,
      },
      steps: [
        {
          target: '[data-tour-step="1"]',
          content: `Displays your borrowed amount and Collateral Ratio(CR) for the borrowed amount.`,
          params: {
            placement: "left",
            enableScrolling: false,
          },
        },
        {
          target: '[data-tour-step="2"]',
          content: `Add desired sol amount as a collateral. You can click on max button to set the maximum amount of SOL in your wallet as a collateral.`,
          params: {
            placement: "right",
            enableScrolling: false,
          },
        },
        {
          target: '[data-tour-step="3"]',
          content: `Add the amount of GENS you would like to borrow. The borrowed amount in GENS and collateral SOL, should be above 115% Collateral Ratio (CR).`,
          params: {
            placement: "right",
            enableScrolling: false,
          },
          before: (type) =>
            new Promise((resolve, reject) => {
              // Time-consuming UI/async operation here
              if (Number(this.from) > 0) {
                resolve("Ready");
              }
            }),
        },
        {
          target: '[data-tour-step="4"]',
          content: `Clear the input values`,
          params: {
            placement: "right",
            enableScrolling: false,
          },
          before: (type) =>
            new Promise((resolve, reject) => {
              // Time-consuming UI/async operation here
              if (
                Number(this.from) > 0 &&
                Number(this.to) > 0 &&
                this.collateralRatio > 114
              ) {
                resolve("Ready");
              }
            }),
        },
        {
          target: '[data-tour-step="5"]',
          content: `Click on confirm after you have input the desired collateral and borrowed amount.`,
          params: {
            placement: "right",
            enableScrolling: false,
          },
          before: (type) =>
            new Promise((resolve, reject) => {
              // Time-consuming UI/async operation here
              if (
                Number(this.from) > 0 &&
                Number(this.to) > 0 &&
                this.collateralRatio > 114
              ) {
                resolve("Ready");
              }
            }),
        },
      ],
    };
  },
  computed: {
    getAlert() {
      return alert;
    },
    getAlertMessage() {
      return alertMessage;
    },
    getUsd() {
      return this.$accessor.usd || 0;
    },
    getGensBalance() {
      return this.$accessor.wallet.balanceGENS || 0;
    },
    getLoading() {
      return this.$accessor.borrowing.loading;
    },
    getIsBorrow() {
      return this.$accessor.borrowing.troveId;
    },
    getDebt() {
      //   return this.$accessor.borrowing.debt || 0;

      return Number(this.$accessor.borrowing.trove.amountToClose) || "0";
    },
    getBorrowAmount() {
      return this.$accessor.borrowing.trove.amountToClose || 0;
    },
    getBorrowOrPay() {
      return this.$accessor.borrowing.borrowOrPay;
    },
    getLamports() {
      return this.$accessor.borrowing.trove.lamports || 0;
    },
    getPrice() {
      return this.$store.state.usd;
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
    getTotalNotifications() {
      return this.$accessor.notification.totalNotificaitons;
    },

    collateralRatio: {
      get: function () {
        let result;
        if (this.$accessor.borrowing.trove.amountToClose > 0) {
          result = getCollateral(
            (
              this.$accessor.borrowing.trove.amountToClose - this.repayTo
            ).toString(),
            (
              this.$accessor.borrowing.trove.lamports -
              this.repaySol * 1000000000
            ).toString(),
            parseInt(this.$accessor.usd).toString()
          );
        } else {
          result = 0;
        }
        this.repayCr = result;

        return result;
      },
      set: function (newVal) {},
    },
  },
  watch: {
    from(val) {
      if (val) {
        this.from = val.toString().replace(/[^+\d\.]/g, "");
        if (this.from.split(".").length > 2)
          this.from = this.from.replace(/\.(?=[^\.]*$)/, "");
      }

      //   this.to = Math.round(
      //     Math.round(Number(this.from) * this.getUsd) / 2.5
      //   ).toString();
      this.$emit("sol", this.from);
      this.$accessor.borrowing.getDebt({ from: this.from, to: this.to });
      if (val > this.$accessor.wallet.balance) {
        this.alert = true;
        this.alertMessage =
          "Not enough SOL. Please add more SOL to your wallet or adjust the amount.";
      } else {
        this.alert = false;
      }
      if (this.to) {
        this.alertCheck();
      }
    },
    to(val) {
      if (val) {
        this.to = val.toString().replace(/[^+\d]/g, "");
        if (this.to.length > 1 && this.to.substr(0, 1) === "0") {
          this.to = 1;
        }
      }
      let fee = 0;
      if (val > 0) {
        fee = this.to;
        fee = fee ? (val * 1.47) / 100 / this.getUsd : 0;

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
      let newCollateral = Number(this.from) + Number(fee);
      console.log(newCollateral, this.$accessor.wallet.balance, "testing");
      if (newCollateral > this.$accessor.wallet.balance) {
        this.alert = true;
        this.alertMessage =
          "Not enough SOL to pay fees. Please add more SOL or adjust your borrow amount.";
      } else {
        this.alert = false;
      }
      if (this.from) {
        this.alertCheck();
      }
      this.$emit("gens", this.to);
      this.$accessor.borrowing.getDebt({ from: this.from, to: this.to });
    },
    repayTo(val) {
      this.$emit("repay", this.repayTo);
      this.$accessor.borrowing.closeBorrowAmount({ repayTo: val });
      if (this.repayTo != this.$accessor.borrowing.trove.amountToClose) {
        this.close = false;
      }
    },
    repaySol(val) {
      //   this.$emit("repaySol", this.repaySol);
      this.$emit("repaySol", this.repaySol);
      if (this.repaySol != this.$accessor.borrowing.trove.lamports / 1e9) {
        this.close = false;
      }
    },
    repayCr(val) {
      this.$emit("cr", this.repayCr);
      this.$accessor.borrowing.currentCollateralRatio(val);
    },
  },
  methods: {
    alertCheck() {
      let result;
      if (this.from && this.to) {
        if (this.$accessor.borrowing.trove.amountToClose > 0) {
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
          result = getCollateral(
            this.to.toString(),
            (this.from * 1000000000).toString(),
            parseInt(this.$accessor.usd).toString()
          );
        }
      } else {
        result = 0;
      }

      if (result < 130) {
        this.alertm = true;
        this.alertmsg =
          "Your collateral ratio is below 130%. We recommend over 200% CR";
      } else {
        this.alertm = false;
      }
    },
    setMaxGens() {
      let user_gens_balance = this.getGensBalance; // gens balance in the wallet
      if (user_gens_balance < this.getDebt) {
        this.repayTo = user_gens_balance;
      } else {
        this.repayTo = this.getDebt;
      }
    },
    setMax() {
      this.from = this.$accessor.wallet.balance
        ? this.$accessor.wallet.balance - 0.05
        : 0;
    },
    reset() {
      this.from = null;
      this.to = null;
      this.mint = null;
    },
    resetPay() {
      this.repayTo = null;
      this.repaySol = null;
    },
    confirmFunc() {
      if (Number(this.from) > 0 || this.getIsBorrow) {
        console.log("this is called");
        this.$accessor.borrowing.confirmBorrow({
          from: this.from,
          to: this.to,
          mint: "EdvHEGQ2sqC4ZofLpj2xE5BQefgewWFY5nHe9aMcReC1",
        });
        this.from = null;
        this.to = null;
        //this.mint = null;
      }
    },
    closeTroveFunc() {
      this.repayTo = this.$accessor.borrowing.trove.amountToClose || 0;
      this.repaySol = this.$accessor.borrowing.trove.lamports / 1e9 || 0;
      this.close = true;
    },
    payTroveFunc() {
      if (
        (this.getGensBalance >= this.repayTo &&
          this.collateralRatio > 114 &&
          this.repayTo != null) ||
        (this.repayTo == this.$accessor.borrowing.trove.amountToClose &&
          this.repaySol == this.$accessor.borrowing.trove.lamports / 1e9)
      ) {
        this.$accessor.borrowing.payTrove({
          mint: "EdvHEGQ2sqC4ZofLpj2xE5BQefgewWFY5nHe9aMcReC1",
          amount: this.repayTo,
          lamports: this.repaySol * 1000000000,
        });
      }
      this.repaySol = null;
      this.repayTo = null;
    },
    // For updating the borrow or pay
    changeBorrowOrPayFunc() {
      this.$accessor.borrowing.changeBorrowOrPay(
        this.$accessor.borrowing.borrowOrPay
      );
    },
    nextStep() {
      this.$tours["myTour"].nextStep();
    },

    showLastStep() {
      this.$tours["myTour"].currentStep = this.steps.length - 1;
    },

    myCustomPreviousStepCallback(currentStep) {
      console.log(
        "[Vue Tour] A custom previousStep callback has been called on step " +
          (currentStep + 1)
      );
    },

    myCustomNextStepCallback(currentStep) {
      console.log(
        "[Vue Tour] A custom nextStep callback has been called on step " +
          (currentStep + 1)
      );

      if (currentStep === 1) {
        console.log(
          "[Vue Tour] A custom nextStep callback has been called from step 2 to step 3"
        );
      }
    },
    modal() {
      if (this.$cookie.get("borrow") == "old") {
        this.$accessor.checkSession(true);
      } else {
        this.$accessor.checkSession(false);
        this.$cookie.set("borrow", "old", { expires: "1Y" });
      }
      return this.$accessor.session;
    },
    setModalFunc(value) {
      this.$accessor.setSession(value);
      this.modalSession = value;
      console.log(this.$accessor.session);
      console.log(value, "test");
    },
  },
  mounted() {
    // TODO: Hide me after the first visit so returning users don't get annoyed!
    if (this.$cookie.get("borrow") != "old") {
      this.$tours["borrowGuide"].start();
      this.modalSession = this.modal();
    }
    this.getCr;
  },
};
</script>
