<template>
  <div class="w-100 p-r">
    <div class="mb-1 f-white-200 fw-500">
      <label v-if="label !== ''">{{ label }}</label>
    </div>
    <div class="w-100 p-r textarea">
      <textarea :name="inputName" v-model="model"></textarea>
    </div>
  </div>
</template>

<script>
const randomHash = () => Math.random().toString(36).substring(6);

export default {
  props: {
    value: { type: [String, Number, null], default: null },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "" },
  },
  watch: {
    value(val) {
      this.model = val;
    },
    model(val) {
      this.$emit("update:value", val);
    },
  },
  data() {
    return {
      inputName: "",
      model: null,
    };
  },
  created() {
    this.inputName = "simple-input-" + randomHash();
  },
};
</script>

<style scoped>
.textarea textarea {
  width: 100%;
  padding: 20px 32px;
  background: #12112d;
  border-radius: 4px;
  color: #cf68ff;
  font-size: 16px;
  line-height: 19px;
  border: none;
  outline: none;
  resize: none;
  height: 150px;
}
.textarea textarea::placeholder {
  color: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  line-height: 19px;
}
</style>
