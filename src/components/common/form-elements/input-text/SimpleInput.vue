<template>
  <div class="w-100 p-r">
    <div class="mb-1 f-white-200 fw-500">
      <label :for="inputName" v-if="label !== ''">{{ label }}</label>
    </div>
    <div class="w-100 p-r simple-input">
      <input
        autocomplete="false"
        :value="value"
        :name="inputName"
        :type="inputType"
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
  },
  data() {
    return {
      inputName: "",
    };
  },
  created() {
    this.inputName = "simple-input-" + randomHash();
  },
};
</script>

<style scoped>
.simple-input input {
  width: 100%;
  padding: 20px 32px;
  background: #12112d;
  border-radius: 4px;
  color: #cf68ff;
  font-size: 16px;
  line-height: 19px;
  border: none;
  outline: none;
}
.simple-input input::placeholder {
  color: rgba(255, 255, 255, 0.1);
  font-size: 16px;
  line-height: 19px;
}
</style>
