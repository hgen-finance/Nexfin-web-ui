<template>
  <div class="w-100 br-6 brs-s br-mcolor-100 p-6-S p-20-XS rad-fix-8">
    <div class="w-100" :class="{ 'op-0': getLoading }">
      <div
        class="w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-4-S pb-15-XS ta-c-XS"
      >
        Notification
      </div>
      <div
        class="w-100 mt-4 mb-2 mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
      >
        <div class="w-100 fs-5-S fs-20-XS f-gray-600 pb-1-S pb-5-XS">email</div>
        <div class="w-100 fd-r ai-c">
          <input
            class="w-100 fs-6-S fs-20-XS fw-600 f-mcolor-300 br-0 oul-n white-100"
            v-model="email"
            placeholder="sa******@gmail.com"
          />
        </div>
      </div>
      <div class="w-100 mt-0-S mt-10-XS">
        <AmCheckbox
          :update="false"
          :model="agree"
          :data="check"
          @set="agree = $event"
        />
      </div>
      <div class="w-100 pt-8-S pt-20-XS fd-r jc-c">
        <AmButton
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          @click="sendEmail"
          :full="true"
        >
          confirm
        </AmButton>
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
    Loading,
  },
  data() {
    return {
      email: null,
      agree: false,
      check: {
        value: false,
        colorBorder: "gray-500",
        colorTitle: "gray-300",
        colorBackground: "mcolor-400",
        colorBorderChecked: "mcolor-300",
        colorBackgroundChecked: "mcolor-300",
        title: "Submit your email to receive liquidation warning message",
      },
    };
  },
  computed: {
    getLoading() {
      return this.$accessor.borrowing.loadingSub;
    },
  },
  methods: {
    sendEmail() {
      if (this.email && this.agree) {
        this.$accessor.borrowing.sendEmail(this.email);
        this.email = null;
        this.agree = false;
      }
    },
  },
};
</script>
