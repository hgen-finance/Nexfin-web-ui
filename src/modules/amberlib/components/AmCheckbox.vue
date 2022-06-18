<template>
  <div class="d-ib amCheckbox" :class="{ disabled: modelData.disabled }">
    <div
      class="w-100 fs-5-S fs-20-XS h-fix-20 fd-r ai-c pt-1"
      :class="[`f-${modelData.colorTitle}`]"
      v-if="modelData.label"
      v-html="modelData.label"
    />
    <div class="d-ib pt-3" :class="{ 'pt-3': modelData.label }">
      <div class="fd-r ai-c amCheckboxContainer">
        <input
          type="checkbox"
          class="w-100 h-100 p-a l-0 t-0 z-10"
          v-model="modelValue"
          :disabled="modelData.disabled"
        />
        <div
          class="w-fix-s-14-S h-fix-s-14-S w-fix-s-34-XS h-fix-s-34-XS br-6 brs-s fd-r ai-c jc-c amCheckboxBlock rad-fix-2"
          :class="[getClassActive, getCheckedColor]"
        >
          <svg
            class="w-60 h-60"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="78.369px"
            height="78.369px"
            viewBox="0 0 78.369 78.369"
            style="enable-background: new 0 0 78.369 78.369"
            xml:space="preserve"
          >
            <path
              :class="[`svg-f-${modelData.colorSvgActive}`]"
              d="M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704   c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704   C78.477,17.894,78.477,18.586,78.049,19.015z"
            />
          </svg>
          <span
            class="w-fix-15 h-fix-15 rad-50 p-a l-50 t-50 z-0 checked"
            :class="[modelData.colorRaisedChecked]"
            v-if="modelData.raised"
          />
          <span
            class="w-fix-15 h-fix-15 rad-50 p-a l-50 t-50 z-0 unchecked"
            :class="[modelData.colorRaisedUnchecked]"
            v-if="modelData.raised"
          />
        </div>
        <div
          class="h-fix-14min pl-3-S pl-5-XS fs-5-s fs-15-XS"
          v-if="modelData.title"
          :class="[`f-${modelData.colorTitle}`]"
        >
          {{ modelData.title }}
        </div>
      </div>
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
    model: { type: Boolean, default: false },
    data: { type: Object, default: null },
    // Colors
    colorBorder: { type: String, default: "gray-500" },
    colorBorderChecked: { type: String, default: "green-500" },
    colorBackground: { type: String, default: "white-200" },
    colorBackgroundChecked: { type: String, default: "green-500" },
    colorSvgActive: { type: String, default: "white-200" },
    colorTitle: { type: String, default: "gray-A100" },
    colorRaisedChecked: { type: String, default: "green-500" },
    colorRaisedUnchecked: { type: String, default: "gray-500" },
    colorError: { type: String, default: "red-600" },
    colorBottomText: { type: String, default: "gray-800" },
    // All
    label: { type: String, default: null },
    title: { type: String, default: null },
    error: { type: String, default: null },
    raised: { type: Boolean, default: true },
    bottomText: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
  },
  computed: {
    getClassActive() {
      return this.modelValue ? "checked" : "unchecked";
    },
    getCheckedColor() {
      return this.modelValue
        ? `br-${this.modelData.colorBorderChecked} ${this.modelData.colorBackgroundChecked}`
        : `br-${this.modelData.colorBorder} ${this.modelData.colorBackground}`;
    },
  },
  data() {
    return {
      modelValue: false,
      modelData: {
        colorBorder: this.colorBorder,
        colorBorderChecked: this.colorBorderChecked,
        colorBackground: this.colorBackground,
        colorBackgroundChecked: this.colorBackgroundChecked,
        colorSvgActive: this.colorSvgActive,
        colorTitle: this.colorTitle,
        colorError: this.colorError,
        colorBottomText: this.colorBottomText,
        colorRaisedChecked: this.colorRaisedChecked,
        colorRaisedUnchecked: this.colorRaisedUnchecked,
        label: this.label,
        title: this.title,
        error: this.error,
        raised: this.raised,
        bottomText: this.bottomText,
        disabled: this.disabled,
        value: this.model,
      },
    };
  },
  watch: {
    modelValue(val) {
      this.modelData.value = val;
      if (this.update) {
        this.$emit("update:model", val);
        this.$emit("update:data", this.modelData);
      } else {
        this.$emit("set", val);
        this.$emit("setdata", this.modelData);
      }
    },
    model(val) {
      this.modelData.value = val;
      this.modelValue = val;
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
  },
};
</script>

<style lang="scss" scoped>
.amCheckbox {
  &.disabled {
    opacity: 0.5;
  }
  input {
    cursor: pointer;
    opacity: 0;
  }
  .amCheckboxBlock {
    transition: 0.3s;
    svg {
      opacity: 0;
      transition: 0.3s;
    }
    span {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
    &.checked {
      animation: 0.5s effectAmCheckboxMax forwards;
      span.checked {
        animation: 0.5s effectAmCheckboxSpan forwards;
      }
    }
    &.unchecked {
      animation: 0.5s effectAmCheckboxMin forwards;
      span.unchecked {
        animation: 0.5s effectAmCheckboxSpan forwards;
      }
    }
  }
  .amCheckboxContainer {
    transition: 0.3s;
    &:hover {
      opacity: 0.6;
    }
  }
  input:checked ~ .amCheckboxBlock {
    svg {
      opacity: 1;
    }
  }
  &.disabled {
    input {
      cursor: default;
    }
    .amCheckboxContainer {
      &:hover {
        opacity: 1;
      }
    }
  }
  @keyframes effectAmCheckboxMax {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes effectAmCheckboxMin {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes effectAmCheckboxSpan {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translate(-50%, -50%) scale(2);
      opacity: 0;
    }
  }
}
</style>
