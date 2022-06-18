<template>
  <div class="w-100 fd-r jc-r">
    <span
      class="fs-3-S fs-4-M px-1-S fw-600 py-1-S px-3-XS py-3-XS f-green-500 ts-3 hv d-n-XS fsh-0"
      style="align-self: center"
      v-if="true"
      @click="addSol"
    >
      + Add SOL
    </span>
    <div
      class="f-white-200 jc-r mx-10-S mx-10-XS"
      v-if="expand"
      style="align-self: center"
    >
      Devnet
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      expand: true,
    };
  },
  computed: {},
  watch: {},
  methods: {
    async addSol() {
      try {
        console.log("Adding SOL....");
        await this.$accessor.faucet.addSol();
        this.$accessor.notification.notify({
          title: "Transaction Completed",
          description: "2 sol is added to the account.",
          type: "confirm",
          txId: "",
        });
      } catch (err) {
        this.$accessor.notification.notify({
          title: "Transaction failed",
          description: err,
          type: "error",
          txId: "",
        });
        console.error(err, "my error");
        // pass wait transaction notification
      }
    },
  },
  mounted() {},
};
</script>

// custom css for menu
<style lang="scss"></style>
