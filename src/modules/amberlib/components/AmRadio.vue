<template>
  <div class="d-ib amRadio" :class="{ disabled: modelData.disabled }">
    <div
      class="w-100 fs-5 h-fix-20 fd-r ai-c pt-1"
      :class="[`f-${modelData.colorTitle}`]"
      v-if="modelData.label"
      v-html="modelData.label"
    />
    <div class="d-ib pt-3" :class="{ 'pt-3': modelData.label }">
      <div :class="{ 'fd-r': modelData.list, 'fd-c': !modelData.list }">
        <div
          class="fd-r ai-c amRadioContainer"
          v-for="(item, i) in modelData.items"
          :key="i"
          :class="{
            'ml-2': modelData.list && i > 0,
            'mt-2': !modelData.list && i > 0,
          }"
        >
          <input
            type="radio"
            :value="item.value"
            class="w-100 h-100 p-a l-0 t-0 z-10"
            v-model="modelValue"
            :disabled="modelData.disabled"
          />
          <div
            class="w-fix-s-14 h-fix-s-14 br-6 brs-s fd-r ai-c jc-c amRadioBlock rad-50"
            :class="[getClassActive(item.value), getCheckedColor(item.value)]"
          >
            <svg
              class="w-80 h-80"
              viewBox="0 0 120 120"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                :class="[`svg-f-${modelData.colorBackgroundChecked}`]"
                cx="60"
                cy="60"
                r="50"
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
            class="h-fix-14min pl-3 fs-5"
            v-if="item.label"
            :class="[`f-${modelData.colorLabel}`]"
          >
            {{ item.label }}
          </div>
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
    colorLabel: { type: String, default: "gray-800" },
    // All
    label: { type: String, default: null },
    items: { type: Array, default: null },
    error: { type: String, default: null },
    raised: { type: Boolean, default: true },
    bottomText: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    list: { type: Boolean, default: true },
    update: { type: Boolean, default: false },
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
        colorLabel: this.colorLabel,
        label: this.label,
        items: this.items,
        error: this.error,
        raised: this.raised,
        bottomText: this.bottomText,
        disabled: this.disabled,
        list: this.list,
        value: this.model,
      },
    };
  },
  methods: {
    getClassActive(value) {
      return value === this.modelValue ? "checked" : "unchecked";
    },
    getCheckedColor(value) {
      return value === this.modelValue
        ? `br-${this.modelData.colorBorderChecked} ${this.modelData.colorBackground}`
        : `br-${this.modelData.colorBorder} ${this.modelData.colorBackground}`;
    },
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
.amRadio {
  &.disabled {
    opacity: 0.5;
  }
  input {
    cursor: pointer;
    opacity: 0;
  }
  .amRadioBlock {
    transition: 0.3s;
    svg {
      opacity: 0;
      transition: 0.5s;
    }
    span {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
    &.checked {
      animation: 0.5s effectAmCheckboxMax forwards;
      svg {
        transform: scale(1);
      }
      span.checked {
        animation: 0.5s effectAmCheckboxSpan forwards;
      }
    }
    &.unchecked {
      animation: 0.5s effectAmCheckboxMin forwards;
      svg {
        transform: scale(0);
      }
      span.unchecked {
        animation: 0.5s effectAmCheckboxSpan forwards;
      }
    }
  }
  .amRadioContainer {
    transition: 0.3s;
    &:hover {
      opacity: 0.6;
    }
  }
  input:checked ~ .amRadioBlock {
    svg {
      opacity: 1;
    }
  }
  &.disabled {
    input {
      cursor: default;
    }
    .amRadioContainer {
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
