<template>
  <div class="w-100 p-r">
    <div class="mb-1 f-white-200 fw-500">
      <label :for="inputName" v-if="label !== ''">{{ label }}</label>
    </div>
    <div class="w-100 p-r input-with-label">
      <span class="fw-500 fs-5 f-gray-600">{{ inputLabel }}</span>
      <input
        autocomplete="false"
        :name="inputName"
        :type="inputType"
        v-model="model"
        :placeholder="placeholder"
        @input="$emit('input', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
const randomHash = () => Math.random().toString(36).substring(6);

export default {
  props: {
    inputType: { type: String, default: "text" },
    value: { type: [String, Number, null], default: null },
    label: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    inputLabel: { type: String, default: "" },
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
    this.inputName = "input-with-label-" + randomHash();
  },
};
</script>

<style scoped>
.input-with-label input {
  width: 100%;
  padding: 40px 32px 20px 32px;
  background: #12112d;
  border-radius: 4px;
  color: #cf68ff;
  font-size: 16px;
  line-height: 19px;
  border: none;
  outline: none;
}
.input-with-label input::placeholder {
  color: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  line-height: 19px;
}
.input-with-label span {
  position: absolute;
  left: 32px;
  top: 20px;
  z-index: 1;
}
</style>
