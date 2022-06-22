<template>
  <div class="w-100">
    <div class="w-100 d-f jc-se">
      <div class="w-35-S w-100-XS pt-30-XS">
        <!-- <div class="w-100 fd-r jc-sb ai-c my-3-S"> -->
        <MultiSend />
        <!-- </div> -->
      </div>
      <div class="w-25-S w-100-XS pt-30-XS">
        <Info />
      </div>
    </div>
  </div>
</template>

<script>
import Info from "@/components/my/multiSend/info.vue";
import MultiSend from "@/components/my/multiSend/multiSend.vue";

export default {
  layout: "my",

  components: {
    Info,
    MultiSend,
  },
  methods: {},
};
</script>

<style lang="scss">
.CodeMirror-scroll {
  padding-bottom: 0px !important;
}
</style>
