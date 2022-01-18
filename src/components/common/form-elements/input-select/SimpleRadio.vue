<template>
  <div class="w-100 p-r">
    <div class="mb-1 f-white-200 fw-500">
      <label :for="inputName" v-if="label !== ''">{{ label }}</label>
    </div>
    <div
      class="w-100 p-r radio-holder d-f"
      :class="{ 'fd-c': direction === 'column', 'fd-r': direction === 'row' }"
    >
      <label
        v-for="(opt, index) in options"
        :key="opt"
        class="radio-container"
        :class="{
          'ml-2': index !== 0 && direction === 'row',
          'mt-2': index !== 0 && direction === 'column',
        }"
      >
        <span class="f-white-200 fw-400 fs-6">
          {{ opt }}
        </span>
        <input
          type="radio"
          :name="inputName"
          :value="opt"
          @change="$emit('input', opt)"
        />
        <span class="radio-checkmark"></span>
      </label>
    </div>
  </div>
</template>

<script>
const randomHash = () => Math.random().toString(36).substring(6);

export default {
  props: {
    label: { type: String, default: "" },
    options: { type: Array, default: [] },
    direction: { type: String, default: "row" },
  },
  data() {
    return {
      inputName: "",
    };
  },
  created() {
    this.inputName = "simple-radio-" + randomHash();
  },
};
</script>

<style scoped>
.radio-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 32px;
  height: 59px;
  cursor: pointer;
}
.radio-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.radio-checkmark {
  position: absolute;
  left: 4px;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 1px solid white;
}
.radio-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.radio-container input:checked ~ .radio-checkmark:after {
  display: block;
}
.radio-container .radio-checkmark:after {
  left: 5px;
  top: 5px;
  width: 10px;
  height: 10px;
  border: solid 1px #cf68ff;
  background-color: #cf68ff;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #b556ff;
}
</style>
