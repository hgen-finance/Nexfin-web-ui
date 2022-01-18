<template>
  <div
    class="w-100 amInput"
    :class="{
      'pt-8': [2].indexOf(getActiveTheme) > -1,
      disabled: modelData.disabled,
    }"
  >
    <div
      class="w-100 fs-5 h-fix-20 fd-r ai-c pt-1 amInputLabelTop"
      :class="getTitleColor"
      v-if="[0, 1].indexOf(getActiveTheme) > -1 && modelData.label"
      v-html="modelData.label"
    />
    <div
      class="h-fix-20 fs-4 fd-r ai-c pt-1"
      :class="[
        { 'w-a p-a r-0 t-0': modelData.label, 'w-100 jc-r': !modelData.label },
        `f-${modelData.colorCount}`,
      ]"
      v-if="modelData.count"
    >
      {{
        [2].indexOf(getActiveType) > -1
          ? modelData.min
          : modelValue
          ? modelValue.length
          : 0
      }}
      {{ [2].indexOf(getActiveType) > -1 ? "-" : "/" }}
      {{ modelData.mask ? modelData.mask.length : modelData.max }}
    </div>
    <div class="w-100 amInputBlock">
      <input
        ref="amInput"
        :type="
          modelData.type === 'password'
            ? password
              ? 'text'
              : 'password'
            : modelData.type
        "
        v-model="modelValue"
        :disabled="modelData.disabled"
        :maxlength="modelData.max"
        class="w-100 h-fix-20 brs-s fs-5 white-100"
        :class="[
          getInputClass,
          `f-${modelData.colorTitle}`,
          {
            'pr-8': [1].indexOf(getActiveType) > -1,
            default: [0, 1].indexOf(getActiveTheme) > -1,
            focus: focusValue || (modelValue && modelValue.length > 0),
          },
        ]"
        :placeholder="
          [0, 1].indexOf(getActiveTheme) > -1
            ? modelData.placeholder
            : this.focusValue
            ? modelData.placeholder
            : null
        "
        @focus="focusValue = true"
        @blur="focusValue = false"
        v-mask="modelData.mask && [0, 1].indexOf(getActiveTheme) > -1"
      />
      <div
        class="w-100 h-100 p-a l-0 fd-r ai-c amInputLabel"
        :class="[getLabelPosition, getTitleColor]"
        v-if="[2].indexOf(getActiveTheme) > -1 && modelData.label"
        v-html="modelData.label"
      />
      <span
        class="h-a p-a l-0 b-0 z-10 brs-s amInputLine"
        :class="[lineBottomColor]"
        v-if="[1, 2].indexOf(getActiveTheme) > -1"
      />
      <svg
        class="w-fix-s-10 h-fix-s-10 p-a r-0 b-fix-s-4"
        :class="{ 'r-fix-s-4': [0].indexOf(getActiveTheme) > -1 }"
        v-if="!password && [1].indexOf(getActiveType) > -1"
        @click="viewPassword(true)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 488.85 488.85"
        style="enable-background: new 0 0 488.85 488.85"
        xml:space="preserve"
      >
        <path
          d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2   s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025   c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3   C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7   c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"
        />
      </svg>
      <svg
        class="w-fix-s-10 h-fix-s-10 p-a r-0 b-fix-s-4"
        :class="{ 'r-fix-s-4': [0].indexOf(getActiveTheme) > -1 }"
        v-if="password && [1].indexOf(getActiveType) > -1"
        @click="viewPassword(false)"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 469.44 469.44"
        style="enable-background: new 0 0 469.44 469.44"
        xml:space="preserve"
      >
        <path
          d="M231.147,160.373l67.2,67.2l0.32-3.52c0-35.307-28.693-64-64-64L231.147,160.373z"
        />
        <path
          d="M234.667,117.387c58.88,0,106.667,47.787,106.667,106.667c0,13.76-2.773,26.88-7.573,38.933l62.4,62.4     c32.213-26.88,57.6-61.653,73.28-101.333c-37.013-93.653-128-160-234.773-160c-29.867,0-58.453,5.333-85.013,14.933l46.08,45.973     C207.787,120.267,220.907,117.387,234.667,117.387z"
        />
        <path
          d="M21.333,59.253l48.64,48.64l9.707,9.707C44.48,145.12,16.64,181.707,0,224.053c36.907,93.653,128,160,234.667,160     c33.067,0,64.64-6.4,93.547-18.027l9.067,9.067l62.187,62.293l27.2-27.093L48.533,32.053L21.333,59.253z M139.307,177.12     l32.96,32.96c-0.96,4.587-1.6,9.173-1.6,13.973c0,35.307,28.693,64,64,64c4.8,0,9.387-0.64,13.867-1.6l32.96,32.96     c-14.187,7.04-29.973,11.307-46.827,11.307C175.787,330.72,128,282.933,128,224.053C128,207.2,132.267,191.413,139.307,177.12z"
        />
      </svg>
    </div>
    <div class="w-100">
      <div
        class="fs-4 pt-3"
        :class="[`f-${modelData.colorError}`]"
        v-if="modelData.error"
        v-html="modelData.error"
      />
      <div
        class="w-100 fs-4 pt-3"
        v-if="modelData.bottomText"
        v-html="modelData.bottomText"
        :class="[`f-${modelData.colorBottomText}`]"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // All
    type: { type: String, default: "text" },
    model: { type: String, default: null },
    data: { type: Object, default: null },
    // Colors Props
    colorLabel: { type: String, default: "gray-800" },
    colorDefault: { type: String, default: "gray-400" },
    colorFocus: { type: String, default: "green-500" },
    colorTitle: { type: String, default: "gray-A100" },
    colorCount: { type: String, default: "gray-600" },
    colorError: { type: String, default: "red-600" },
    colorBottomText: { type: String, default: "gray-800" },
    theme: { type: String, default: "default" },
    // All Props
    label: { type: String, default: null },
    placeholder: { type: String, default: null },
    count: { type: Boolean, default: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 30 },
    mask: { type: String, default: null },
    req: { type: String, default: null },
    replace: { type: String, default: null },
    error: { type: String, default: null },
    errorText: { type: String, default: "Error valid" },
    errorMin: { type: String, default: "Error min length" },
    errorRepeat: { type: String, default: "Error repeat" },
    repeat: { type: String, default: null },
    validate: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    bottomText: { type: String, default: null },
  },
  data() {
    return {
      password: false,
      types: ["text", "password", "number"],
      themes: ["default", "fixed", "amber"],
      focusValue: false,
      modelValue: null,
      modelData: {
        colorLabel: this.colorLabel,
        colorDefault: this.colorDefault,
        colorFocus: this.colorFocus,
        colorTitle: this.colorTitle,
        colorCount: this.colorCount,
        colorError: this.colorError,
        colorBottomText: this.colorBottomText,
        theme: this.theme,
        type: this.type,
        label: this.label,
        placeholder: this.placeholder,
        count: this.count,
        min: this.min,
        max: this.max,
        mask: this.mask,
        req: this.req,
        replace: this.replace,
        error: this.error,
        errorText: this.errorText,
        errorMin: this.errorMin,
        errorRepeat: this.errorRepeat,
        repeat: this.repeat,
        validate: this.validate,
        disabled: this.disabled,
        value: this.model,
        update: this.update,
        bottomText: this.bottomText,
      },
    };
  },
  watch: {
    modelValue(val) {
      this.modelData.error = null;
      if ([0, 1].indexOf(this.getActiveType) > -1) {
        if (!this.modelData.mask) {
          if (this.modelData.replace) {
            val = val.replace(this.modelData.replace, "");
          }
          if (this.modelData.validate && val.length > 0) {
            if (this.modelData.repeat && this.modelData.repeat !== val) {
              this.modelData.error = this.modelData.errorRepeat;
            }
            if (this.modelData.req && !this.modelData.req.test(val)) {
              this.modelData.error = this.modelData.errorText;
            }
            if (this.modelData.min > val.length) {
              this.modelData.error = this.modelData.errorMin;
            }
          }
        }
      } else {
        if (!this.modelData.mask) {
          val =
            Number(val) < 0
              ? 0
              : Number(val) > this.modelData.max
              ? this.modelData.max
              : val;
          if (this.modelData.validate && val.toString().length > 0) {
            if (this.modelData.min > val) {
              this.modelData.error = this.modelData.errorMin;
            }
          }
        }
      }
      this.modelValue = val.toString();
      this.modelData.value = val;
      if (this.update) {
        this.$emit("update:model", val);
        this.$emit("update:data", this.modelData);
      } else {
        this.$emit("set", val);
        this.$emit("setdata", this.modelData);
      }
    },
  },
  computed: {
    getTitleColor() {
      return `f-${this.modelData.colorTitle}`;
    },
    getActiveTheme() {
      return this.themes.indexOf(this.modelData.theme);
    },
    getActiveType() {
      return this.types.indexOf(this.modelData.type);
    },
    getInputClass() {
      return [1, 2].indexOf(this.getActiveTheme) > -1
        ? `br-0 brb-6 br-${
            this.modelData.error
              ? this.modelData.colorError
              : this.modelData.colorDefault
          }`
        : `rad-fix-2 px-2 br-6 br-${
            this.modelData.error
              ? this.modelData.colorError
              : this.focusValue
              ? this.modelData.colorFocus
              : this.modelData.colorDefault
          }`;
    },
    getLabelPosition() {
      return this.focusValue || (this.modelValue && this.modelValue.length)
        ? `fs-4 b-90 f-${this.modelData.colorFocus}`
        : "fs-5 b-0";
    },
    lineBottomColor() {
      return `brb-2 br-${
        this.modelData.error
          ? this.modelData.colorError
          : this.modelData.colorFocus
      }`;
    },
  },
  methods: {
    viewPassword(value) {
      this.password = value;
      this.$refs.amInput.focus();
    },
  },
  mounted() {
    if (this.data) {
      Object.keys(this.data).forEach((key) => {
        if (this.modelData.hasOwnProperty(key)) {
          if (key === "value") {
            this.modelValue = this.data[key];
          } else {
            this.modelData[key] = this.data[key];
          }
        }
      });
    } else {
      this.modelValue = this.model || this.modelValue;
    }
    this.modelData.theme =
      this.themes.indexOf(this.modelData.theme) > -1
        ? this.modelData.theme
        : this.themes[0];
    this.modelData.type =
      this.types.indexOf(this.modelData.type) > -1
        ? this.modelData.type
        : this.types[0];
    if (!this.modelData.placeholder && this.modelData.mask) {
      this.modelData.placeholder = this.modelData.mask.replace(/\#/g, "0");
    }
  },
};
</script>

<style lang="scss" scoped>
.amInput {
  &.disabled {
    opacity: 0.5;
  }
  .amInputLabel {
    pointer-events: none;
    transition: 0.3s;
  }
  .amInputLabelTop {
    overflow: hidden;
  }
  .amInputBlock {
    svg {
      cursor: pointer;
      opacity: 0.7;
      transition: 0.3s;
      &:hover {
        opacity: 0.5;
      }
    }
    input {
      outline: none;
      transition: 0.5s;
      &::placeholder {
        transition: 0.3s;
        color: inherit;
        opacity: 0.5;
      }
      &.default:focus::placeholder {
        text-indent: -10%;
        opacity: 0;
      }
    }
    .amInputLine {
      left: 50%;
      width: 0;
      transition: 0.5s;
      opacity: 0;
    }
    input.focus ~ .amInputLine,
    input:focus ~ .amInputLine {
      left: 0;
      width: 100%;
      opacity: 1;
    }
  }
}
</style>
