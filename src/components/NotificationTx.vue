<template>
  <div class="notification-box">
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all pt-0-XS notification-inner"
      v-if="getTotalNotifications > 0"
    >
      <!-- TODO: check for the type of message  -->
      <div class="fd-r ai-c jc-c" v-if="true">
        <!-- <Loading :width="'2em'" :height="'2em'" /> -->

        <div v-if="handleTxNotifications.type == 'confirm'">
          <Icon class="pr-3" type="check" />
        </div>
        <div v-if="handleTxNotifications.type == 'error'">
          <Icon class="pr-3" type="close" />
        </div>
        <div class="d-f fd-c ai-l ml-2-S">
          <div class="fs-6-M fs-5-S fs-25-XS f-white-200 fw-500">
            {{ handleTxNotifications.title }}
          </div>
          <div class="fs-5-S fs-25-XS f-mcolor-500 pt-2 fw-500">
            {{ handleTxNotifications.description }}
          </div>
          <div class="w-100 fs-5-S fs-20-XS f-white-200 fw-500 pt-1 ta-c">
            <a
              v-bind:href="
                `https://explorer.solana.com/tx/` +
                handleTxNotifications.txId +
                `?cluster=` +
                cluster
              "
              class="fd-r"
              target="_blank"
              rel="noreferrer"
            >
              <Icon type="link" />
              <span class="mr-1"> </span>
              {{ parsedTxId }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//  TODO: Add a close button for the notification box
//  TODO: set the notification to hide after certain period
// TODO: change the confirm to success when the transaction is confirmed
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";
import { CLUSTER } from "@/utils/layout";
import Loading from "@/components/Loading";

export default {
  components: {
    Icon,
    Tooltip,
    Button,
    Progress,
    Spin,
    Modal,
    Loading,
  },
  props: {
    loader: { type: Boolean, default: false },
  },
  data() {
    return {
      cluster: CLUSTER,
    };
  },
  computed: {
    getTotalNotifications() {
      return this.$accessor.notification.totalNotificaitons;
    },
    getNotifications() {
      return [...this.$accessor.notification.notifications].reverse();
    },
    handleTxNotifications() {
      if (this.getTotalNotifications > 0) {
        return this.getNotifications[0];
      } else {
        return {};
      }
    },
    parsedTxId() {
      if (this.getTotalNotifications > 0) {
        let tx = this.getNotifications[0].txId.toString();
        return `${tx.slice(0, 14)}` + `...` + `${tx.slice(tx.length - 14)}`;
      } else {
        return "";
      }
    },
  },
  methods: {},
};
</script>

<style scoped>
.notification-box {
  position: fixed;
  bottom: 25px;
  left: 25px;
  width: fit-content;
  z-index: 10;
}
.notification-inner {
  border: 0.1px solid #151441;
}
</style>
