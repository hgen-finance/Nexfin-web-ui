<template>
  <div class="w-100">
    <div class="w-100">
      <div class="fw-600 fs-8-S fs-25-XS f-white-200">Multi Transaction</div>
    </div>
    <div class="w-100 fd-c ai-s" ref="container">
      <div class="cside-L cside-M cside-S cside-XS fd-r jc-c mt-8-XS mt-2-S">
        <div
          class="fd-r jc-c f-white-200 ai-c micon-L micon-M micon-S micon-XS"
          @click="addInput"
        >
          <Icon type="plus" :rotate="90" />
        </div>
      </div>
    </div>
    <div class="w-100 fd-c jc-c ai-c my-5-S">
      <div class="w-20">
        <AmButton color="mcolor-100" bColor="mcolor-100" opacityEffect full>
          Send
        </AmButton>
        <!-- <AmButton
        color="mcolor-1001"
        bColor="mcolor-1001"
        full
        v-if="dayLeft != 0"
        disabled
      >
        Claim
      </AmButton> -->
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import AddressInput from "@/components/my/multiSend/addressInput.vue";
import DynamicComp from "@/components/my/multiSend/dynamicComp.vue";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";
import Vue from "vue";

export default {
  components: {
    Loading,
    AddressInput,
    DynamicComp,
    Icon,
  },
  methods: {
    addInput() {
      console.log("click me");
      var ComponentClass = Vue.extend(AddressInput);
      var instance = new ComponentClass({
        propsData: { type: "add" },
      });
      instance.$slots.default = ["Click me!"];
      instance.$mount(); // pass nothing
      this.$refs.container.appendChild(instance.$el);
      console.log(this.$refs.container, "testing...****************8");
      console.log(this.add);
    },
  },
};
</script>
<style scoped></style>
