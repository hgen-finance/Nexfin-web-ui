<template>
  <div class="w-100 px-0-L px-4-M px-3-S px-3-XS m-0-auto">
    <div class="fw-700 f-white-200 fs-10 mb-5">Notification</div>
    <div class="d-f fd-r jc-sb mt-6">
      <div class="w-45 d-f fd-c">
        <Textarea
          label="Warning Message Template"
          v-bind:value.sync="warning"
        />
        <InputWithTopLabel
          label="Debit Ratio"
          inputLabel="81, 85, 90"
          class="mt-2"
          v-bind:value.sync="warningRatio"
        />
        <div class="d-f fd-r jc-sb mt-4">
          <div class="w-45">
            <AmButton
              color="mcolor-200"
              bColor="mcolor-100"
              colorText="mcolor-300"
              opacityEffect
              :full="true"
              @click="resetWarning"
            >
              REMOVE
            </AmButton>
          </div>
          <div class="w-45">
            <AmButton
              color="mcolor-100"
              opacityEffect
              :full="true"
              @click="sendWarning"
            >
              Confirm
            </AmButton>
          </div>
        </div>
      </div>
      <div class="w-45 d-f fd-c">
        <Textarea
          label="Liquidation Message Template"
          v-bind:value.sync="liquidation"
        />
        <InputWithTopLabel
          label="Debit Ratio"
          inputLabel="81, 85, 90"
          class="mt-2"
          v-bind:value.sync="liquidationRatio"
        />
        <div class="d-f fd-r jc-sb mt-4">
          <div class="w-45">
            <AmButton
              color="mcolor-200"
              bColor="mcolor-100"
              colorText="mcolor-300"
              opacityEffect
              :full="true"
              @click="resetLiquidation"
            >
              REMOVE
            </AmButton>
          </div>
          <div class="w-45">
            <AmButton
              color="mcolor-100"
              opacityEffect
              :full="true"
              @click="sendLiquidation"
            >
              Confirm
            </AmButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Textarea from "@/components/common/form-elements/input-text/Textarea.vue";
import InputWithTopLabel from "@/components/common/form-elements/input-text/InputWithTopLabel.vue";

export default {
  components: {
    Textarea,
    InputWithTopLabel,
  },
  data() {
    return {
      warning: null,
      warningRatio: null,
      liquidation: null,
      liquidationRatio: null,
    };
  },
  methods: {
    resetWarning() {
      this.warning = null;
      this.warningRatio = null;
    },
    resetLiquidation() {
      this.liquidation = null;
      this.liquidationRatio = null;
    },
    sendWarning() {
      this.$accessor.admin.sendWarning({
        text: this.warning,
        ratio: this.warningRatio,
      });
      this.resetWarning();
    },
    sendLiquidation() {
      this.$accessor.admin.sendLiquidation({
        text: this.liquidation,
        ratio: this.liquidationRatio,
      });
      this.resetLiquidation();
    },
  },
};
</script>
