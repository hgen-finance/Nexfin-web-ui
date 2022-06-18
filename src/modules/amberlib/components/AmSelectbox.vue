<template>
  <div
    class="w-100 amSelectbox"
    :class="{
      'pt-8': [2].indexOf(getActiveTheme) > -1,
      disabled: modelData.disabled,
    }"
    ref="amSelectbox"
  >
    <div
      class="w-100 fs-5-S fs-20-XS h-fix-s-28min-S h-fix-s-100min-XS fd-r ai-c pt-1-S mt-10-XS amSelectboxLabelTop"
      :class="[`f-${modelData.colorLabel}`]"
      v-if="[0, 1].indexOf(getActiveTheme) > -1 && modelData.label"
      v-html="modelData.label"
    />
    <div class="w-100 d-b amSelectboxBlock">
      <!-- <span class="fs-6 f-mcolor-100 td-u ts-3 hv d-n-XS fsh-0">Max</span> -->
      <input
        readonly
        type="text"
        :value="getValue"
        :disabled="modelData.disabled"
        class="w-100 h-fix-s-28min-S h-fix-s-100min-XS brs-s fs-5-S fs-20-XS"
        :class="[
          getInputClass,
          getFocusClass,
          { focus: focusValue },
          modelData.colorBackground,
          { 'shadow-purple-100': shadow, 'px-4-S px-15-XS': padding },
        ]"
        @focus="focusValue = true"
        @blur="
          focusValue = modelData.multiple || modelData.search ? true : false
        "
      />

      <div
        class="w-100 h-100 p-a l-0 fd-r ai-c amSelectboxLabel"
        :class="[getLabelPosition]"
        v-if="[2].indexOf(getActiveTheme) > -1 && modelData.label"
        v-html="modelData.label"
      />
      <span
        class="h-a p-a l-0 b-0 z-10 brs-s amSelectboxLine"
        :class="[lineBottomColor]"
        v-if="[1, 2].indexOf(getActiveTheme) > -1"
      />
      <!-- <svg
        class="w-fix-s-10-S h-fix-s-10-S w-fix-s-50-XS h-fix-s-50-XS p-a r-0 b-fix-s-5-XL b-fix-s-5-S b-fix-s-10-XS"
        :class="{
          'r-fix-s-5-S r-fix-s-15-XS':
            [0].indexOf(getActiveTheme) > -1 && padding
        }"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        width="451.847px"
        height="451.847px"
        viewBox="0 0 451.847 451.847"
        style="enable-background:new 0 0 451.847 451.847;"
        xml:space="preserve"
      >
        <path
          :class="getColorSvg"
          d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
        />
        <path
          :class="getColorSvg"
          d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
        />
        <path
          :class="getColorSvg"
          d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
        />
      </svg> -->
      <transition name="slide-fade">
        <div
          class="w-100 p-a br-6 brs-s z-15 rad-fix-2 amSelectboxOptions"
          v-if="focusValue && modelData.items"
          :class="[
            getOptionsClass,
            modelData.colorOptions,
            `br-${modelData.colorOptionsBorder}`,
          ]"
        >
          <input
            class="w-100 h-fix-s-28min-S h-fix-s-100min-XS h-fix-25min-XS br-0 brb-4 brb-s br-gray-400 px-2 fs-5-S fs-20-XS"
            :placeholder="modelData.searchText"
            v-model="searchModel"
            v-if="modelData.search"
          />
          <div
            class="w-100 h-fix-s-28min-S h-fix-s-100min-XS fd-r ai-c jc-c"
            v-if="modelData.search && getItems.length === 0"
            v-html="modelData.searchNotFound"
          />
          <div
            class="w-100"
            :class="{
              'h-a': getItems.length < 6,
              'h-fix-100': getItems.length > 5,
            }"
          >
            <AmScroll :ops="ops">
              <div
                class="w-100 h-fix-s-28min-S h-fix-s-100min-XS py-2 fd-r ai-c px-4-S px-15-XS amSelectboxOption fs-5-S fs-20-XS"
                :title="item.label"
                :class="[
                  getOptionLine,
                  { active: getActiveMultiple(item.value) },
                ]"
                v-for="(item, i) in getItems"
                :key="i"
                @click="setModelValue(item.value)"
              >
                <div
                  class="w-fix-s-10 h-fix-s-10 br-6 brs-s br-gray-500 mr-2 rad-3 fd-r ai-c jc-c fsh-0"
                  v-if="modelData.multiple"
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
                      d="M78.049,19.015L29.458,67.606c-0.428,0.428-1.121,0.428-1.548,0L0.32,40.015c-0.427-0.426-0.427-1.119,0-1.547l6.704-6.704   c0.428-0.427,1.121-0.427,1.548,0l20.113,20.112l41.113-41.113c0.429-0.427,1.12-0.427,1.548,0l6.703,6.704   C78.477,17.894,78.477,18.586,78.049,19.015z"
                    />
                  </svg>
                </div>
                {{ item.label }}
                <span
                  class="d-b w-100 h-100 p-a l-0 t-0"
                  :class="[modelData.colorOptionHover]"
                />
              </div>
            </AmScroll>
          </div>
        </div>
      </transition>
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
    model: { type: String, default: null },
    data: { type: Object, default: null },
    // Colors Props
    colorLabel: { type: String, default: "gray-800" },
    colorBackground: { type: String, default: "mcolor-200" },
    colorDefault: { type: String, default: "mcolor-100" },
    colorFocus: { type: String, default: "green-500" },
    colorTitle: { type: String, default: "white-200" },
    colorOptions: { type: String, default: "white-200" },
    colorOptionsBorder: { type: String, default: "gray-400" },
    colorOptionHover: { type: String, default: "gray-300" },
    colorOptionLine: { type: String, default: "gray-200" },
    colorOptionTitle: { type: String, default: "gray-A100" },
    colorBarRail: { type: String, default: "#EEEEEE" },
    colorBar: { type: String, default: "#9E9E9E" },
    colorError: { type: String, default: "red-600" },
    colorBottomText: { type: String, default: "gray-800" },
    shadow: { type: Boolean, default: true },
    padding: { type: Boolean, default: true },
    theme: { type: String, default: "default" },
    // All Props
    sizeBar: { type: String, default: "0.5rem" },
    label: { type: String, default: null },
    items: { type: Array, default: null },
    bottom: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    placeholder: { type: String, default: "Select" },
    update: { type: Boolean, default: false },
    search: { type: Boolean, default: false },
    searchText: { type: String, default: "Поиск" },
    searchNotFound: { type: String, default: "Not found" },
    error: { type: Boolean, default: false },
    bottomText: { type: String, default: null },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      themes: ["default", "fixed", "amber"],
      modelValue: null,
      focusValue: false,
      searchModel: null,
      tempItems: [],
      modelData: {
        colorLabel: this.colorLabel,
        colorDefault: this.colorDefault,
        colorBackground: this.colorBackground,
        colorFocus: this.colorFocus,
        colorTitle: this.colorTitle,
        colorOptions: this.colorOptions,
        colorOptionsBorder: this.colorOptionsBorder,
        colorOptionHover: this.colorOptionHover,
        colorOptionLine: this.colorOptionLine,
        colorOptionTitle: this.colorOptionTitle,
        colorError: this.colorError,
        colorBottomText: this.colorBottomText,
        theme: this.theme,
        value: this.model,
        label: this.label,
        items: this.items,
        bottom: this.bottom,
        multiple: this.multiple,
        placeholder: this.placeholder,
        value: this.model,
        search: this.search,
        searchText: this.searchText,
        searchNotFound: this.searchNotFound,
        error: this.error,
        bottomText: this.bottomText,
        disabled: this.disabled,
      },
      ops: {
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true,
          locking: true,
          wheelScrollDuration: 0,
          wheelDirectionReverse: true,
          checkShifKey: false,
        },
        scrollPanel: {
          initialScrollX: false,
          initialScrollY: false,
          scrollingX: false,
          scrollingY: true,
          speed: 300,
        },
        bar: {
          specifyBorderRadius: false,
          keepShow: true,
          background: this.colorBar,
        },
        rail: {
          opacity: 1,
          size: this.sizeBar,
          background: this.colorBarRail,
          specifyBorderRadius: true,
          gutterOfEnds: "0.01rem",
          gutterOfSide: 0,
        },
      },
    };
  },
  computed: {
    getActiveTheme() {
      return this.themes.indexOf(this.modelData.theme);
    },
    getValue() {
      if (this.modelData.multiple) {
        return Array.isArray(this.modelValue)
          ? this.modelValue.length > 0
            ? `Выбрано ${this.modelValue.length}`
            : this.modelData.placeholder
          : this.modelData.placeholder;
      } else {
        return this.modelData.items
          ? this.modelData.items.filter(
              (item) => item.value === this.modelValue
            )[0]
            ? this.modelData.items.filter(
                (item) => item.value === this.modelValue
              )[0].label
            : this.modelData.placeholder
          : this.modelData.placeholder;
      }
    },
    getLabelPosition() {
      return this.focusValue || this.modelValue !== null
        ? `fs-4 b-90 f-${this.modelData.colorFocus}`
        : "fs-5 b-0";
    },
    getInputClass() {
      return [1, 2].indexOf(this.getActiveTheme) > -1
        ? `br-0 brb-6 br-${this.modelData.colorDefault}`
        : `rad-fix-2 br-6 br-${
            this.focusValue
              ? this.modelData.colorFocus
              : this.modelData.colorDefault
          }`;
    },
    getFocusClass() {
      return `f-${
        this.focusValue || this.modelValue !== null
          ? this.modelData.colorTitle
          : [2].indexOf(this.getActiveTheme) > -1
          ? "white-100"
          : this.modelData.colorTitle
      }`;
    },
    lineBottomColor() {
      return `brb-2 br-${this.modelData.colorFocus}`;
    },
    getColorSvg() {
      return this.focusValue
        ? `svg-f-${this.modelData.colorFocus}`
        : `svg-f-${this.modelData.colorTitle}`;
    },
    getOptionsClass() {
      return [1, 2].indexOf(this.getActiveTheme) > -1
        ? this.modelData.bottom
          ? "b-0"
          : "t-a"
        : this.modelData.bottom
        ? "b-0"
        : "t-0";
    },
    getOptionLine() {
      return `brt-4 brts-s br-${this.modelData.colorOptionLine} f-${this.modelData.colorOptionTitle}`;
    },
    getItems() {
      return this.modelData.items.filter((item) => {
        if (this.searchModel && this.searchModel.length > 0) {
          if (
            item.label
              .toString()
              .toLowerCase()
              .indexOf(this.searchModel.toLowerCase()) > -1
          ) {
            return item;
          }
        } else {
          return item;
        }
      });
    },
  },
  methods: {
    getActiveMultiple(value) {
      return Array.isArray(this.modelValue)
        ? this.modelValue.indexOf(value) > -1 || false
        : this.modelValue === value || false;
    },
    setModelValue(value) {
      if (this.modelData.multiple) {
        if (Array.isArray(this.modelValue)) {
          if (this.modelValue.indexOf(value) > -1) {
            this.modelValue.splice(this.modelValue.indexOf(value), 1);
            if (this.modelValue.length === 0) {
              this.modelValue = null;
            }
          } else {
            this.modelValue.push(value);
          }
        } else {
          this.modelValue = [value];
        }
      } else {
        this.modelValue = value;
        if (this.modelData.search) {
          this.focusValue = false;
        }
      }
    },
  },
  watch: {
    focusValue() {
      this.searchModel = null;
    },
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
    data: {
      deep: true,
      handler(val) {
        if (val) {
          this.modelValue = val.value;
        }
      },
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
    }
    this.modelData.theme =
      this.themes.indexOf(this.modelData.theme) > -1
        ? this.modelData.theme
        : this.themes[0];
    if (this.modelData.multiple || this.modelData.search) {
      window.addEventListener("click", (e) => {
        if (e.target.closest(".amSelectbox")) {
          if (
            !e.target
              .closest(".amSelectbox")
              .isEqualNode(this.$refs.amSelectbox)
          ) {
            this.focusValue = false;
          }
        } else {
          this.focusValue = false;
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.amSelectbox {
  .amSelectboxLabel {
    pointer-events: none;
    transition: 0.3s;
  }
  .amSelectboxLabelTop {
    overflow: hidden;
  }
  .amSelectboxBlock {
    input {
      outline: none;
      cursor: pointer;
      transition: 0.5s;
    }
    .amSelectboxLine {
      left: 50%;
      width: 0;
      transition: 0.5s;
      opacity: 0;
    }
    input.focus ~ .amSelectboxLine,
    input:focus ~ .amSelectboxLine {
      left: 0;
      width: 100%;
      opacity: 1;
    }
    svg {
      transition: 0.5s;
      path {
        transition: 0.5s;
      }
    }
    .amSelectboxOptions {
      box-shadow: 0 0.2rem 0.5rem #ddd;
      input {
        cursor: text;
        &::placeholder {
          transition: 0.3s;
        }
        &:focus::placeholder {
          text-indent: 10%;
          color: transparent;
        }
      }
      .amSelectboxOption {
        cursor: pointer;
        text-indent: 0;
        transition: 0.3s;
        &:nth-child(1) {
          border-top: 0;
        }
        span {
          width: 0;
          left: 50%;
          z-index: -1;
          opacity: 0;
          transition: 0.3s;
        }
        &:hover {
          opacity: 0.7;
          span {
            width: 100%;
            left: 0;
            opacity: 1;
          }
        }
        div {
          svg {
            opacity: 0;
          }
        }
        &.active {
          div {
            svg {
              opacity: 1;
            }
          }
          span {
            width: 100%;
            left: 0;
            opacity: 1;
          }
        }
      }
    }
    &:hover {
      input {
        opacity: 0.7;
      }
    }
  }
  &.disabled {
    opacity: 0.5;
    cursor: default;
    .amSelectboxBlock {
      input {
        cursor: default;
      }
      &:hover {
        input {
          opacity: 1;
        }
      }
    }
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    transform: translateY(1rem);
    opacity: 0;
  }
}
</style>
