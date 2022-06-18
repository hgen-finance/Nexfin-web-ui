<template>
  <div
    class="w-100 amDatePicker"
    :class="{
      'pt-8': [2].indexOf(getActiveTheme) > -1,
      disabled: modelData.disabled,
    }"
    ref="amDatePicker"
  >
    <div
      class="w-100 fs-5 h-fix-20 fd-r ai-c pt-1 amDatePickerLabelTop"
      :class="[`f-${modelData.colorLabel}`]"
      v-if="[0, 1].indexOf(getActiveTheme) > -1 && modelData.label"
      v-html="modelData.label"
    />
    <div class="w-100 d-b amDatePickerBlock">
      <input
        readonly
        type="text"
        v-model="modelValue"
        :placeholder="
          [2].indexOf(getActiveTheme) > -1
            ? focusValue
              ? modelData.placeholder
              : null
            : modelData.placeholder
        "
        :disabled="modelData.disabled"
        class="w-100 h-fix-20 brs-s fs-5 pr-8 white-100"
        :class="[
          getInputClass,
          getFocusClass,
          { focus: focusValue, default: [0, 1].indexOf(getActiveTheme) > -1 },
        ]"
        @focus="focusValue = true"
      />
      <div
        class="w-100 h-100 p-a l-0 fd-r ai-c amDatePickerLabel"
        :class="[getLabelPosition]"
        v-if="[2].indexOf(getActiveTheme) > -1 && modelData.label"
        v-html="modelData.label"
      />
      <span
        class="h-a p-a l-0 b-0 z-10 brs-s amDatePickerLine"
        :class="[lineBottomColor]"
        v-if="[1, 2].indexOf(getActiveTheme) > -1"
      />
      <svg
        class="w-fix-s-10 h-fix-s-10 p-a r-0 b-fix-s-4"
        :class="{ 'r-fix-s-4': [0].indexOf(getActiveTheme) > -1 }"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Capa_1"
        x="0px"
        y="0px"
        width="36.447px"
        height="36.447px"
        viewBox="0 0 36.447 36.447"
        style="enable-background: new 0 0 36.447 36.447"
        xml:space="preserve"
      >
        <path
          :class="getColorSvg"
          d="M30.224,3.948h-1.098V2.75c0-1.517-1.197-2.75-2.67-2.75c-1.474,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75    c0-1.517-1.197-2.75-2.67-2.75c-1.473,0-2.67,1.233-2.67,2.75v1.197h-2.74V2.75c0-1.517-1.197-2.75-2.67-2.75    c-1.473,0-2.67,1.233-2.67,2.75v1.197H6.224c-2.343,0-4.25,1.907-4.25,4.25v24c0,2.343,1.907,4.25,4.25,4.25h24    c2.344,0,4.25-1.907,4.25-4.25v-24C34.474,5.855,32.567,3.948,30.224,3.948z M25.286,2.75c0-0.689,0.525-1.25,1.17-1.25    c0.646,0,1.17,0.561,1.17,1.25v4.896c0,0.689-0.524,1.25-1.17,1.25c-0.645,0-1.17-0.561-1.17-1.25V2.75z M17.206,2.75    c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z M9.125,2.75    c0-0.689,0.525-1.25,1.17-1.25s1.17,0.561,1.17,1.25v4.896c0,0.689-0.525,1.25-1.17,1.25s-1.17-0.561-1.17-1.25V2.75z     M31.974,32.198c0,0.965-0.785,1.75-1.75,1.75h-24c-0.965,0-1.75-0.785-1.75-1.75v-22h27.5V32.198z"
        />
        <rect
          :class="getColorSvg"
          x="6.724"
          y="14.626"
          width="4.595"
          height="4.089"
        />
        <rect
          :class="getColorSvg"
          x="12.857"
          y="14.626"
          width="4.596"
          height="4.089"
        />
        <rect
          :class="getColorSvg"
          x="18.995"
          y="14.626"
          width="4.595"
          height="4.089"
        />
        <rect
          :class="getColorSvg"
          x="25.128"
          y="14.626"
          width="4.596"
          height="4.089"
        />
        <rect
          :class="getColorSvg"
          x="6.724"
          y="20.084"
          width="4.595"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="12.857"
          y="20.084"
          width="4.596"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="18.995"
          y="20.084"
          width="4.595"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="25.128"
          y="20.084"
          width="4.596"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="6.724"
          y="25.54"
          width="4.595"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="12.857"
          y="25.54"
          width="4.596"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="18.995"
          y="25.54"
          width="4.595"
          height="4.086"
        />
        <rect
          :class="getColorSvg"
          x="25.128"
          y="25.54"
          width="4.596"
          height="4.086"
        />
      </svg>
      <transition name="slide-fade">
        <div
          class="w-100 w-fix-180min-S w-fix-180max-S p-a l-0 t-100 white-200 br-6 brs-s br-gray-400 amDatePickerCalendar"
          v-if="focusValue"
        >
          <div class="w-100 fd-r ai-c py-3 pl-1">
            <div class="w-66 px-2">
              <div
                class="w-100 h-fix-20-S h-fix-15-XS fd-r ai-c fs-4 fw-500 tt-u f-gray-900 br-4 brs-s br-gray-300 px-3-S px-2-XS amDatepickerMonth"
                @click="show = 1"
              >
                {{ months[today.getMonth()] }}
                <svg
                  class="w-fix-s-9-S w-fix-s-8-XS h-fix-s-9-S h-fix-s-8-XS p-a r-fix-s-3 b-fix-s-3-S b-fix-s-2-XS"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  x="0px"
                  y="0px"
                  width="451.847px"
                  height="451.847px"
                  viewBox="0 0 451.847 451.847"
                  style="enable-background: new 0 0 451.847 451.847"
                  xml:space="preserve"
                >
                  <path
                    d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
                  />
                  <path
                    d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
                  />
                  <path
                    d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
                  />
                </svg>
              </div>
            </div>
            <div class="w-33 pr-3">
              <div
                class="w-100 h-fix-20-S h-fix-15-XS fd-r ai-c fs-4 fw-500 tt-u f-gray-900 br-4 brs-s br-gray-300 px-3-S px-2-XS amDatepickerYear"
                @click="show = 2"
              >
                {{ today.getFullYear() }}
                <svg
                  class="w-fix-s-9-S w-fix-s-8-XS h-fix-s-9-S h-fix-s-8-XS p-a r-fix-s-3 b-fix-s-3-S b-fix-s-2-XS"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  x="0px"
                  y="0px"
                  width="451.847px"
                  height="451.847px"
                  viewBox="0 0 451.847 451.847"
                  style="enable-background: new 0 0 451.847 451.847"
                  xml:space="preserve"
                >
                  <path
                    d="m368 154.667969h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
                  />
                  <path
                    d="m368 32h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
                  />
                  <path
                    d="m368 277.332031h-352c-8.832031 0-16-7.167969-16-16s7.167969-16 16-16h352c8.832031 0 16 7.167969 16 16s-7.167969 16-16 16zm0 0"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="w-100" v-show="show === 0">
            <div class="w-100 fd-r py-1 px-2">
              <div
                class="w-14 px-1"
                :class="{ 'f-gray-700': i < 6, 'f-red-400': i === 6 }"
                v-for="(w, i) in weeksValue"
                :key="w"
              >
                <div
                  class="w-100 h-fix-20-S h-fix-15-XS fsh-0 fd-r ai-c jc-c fs-4-S fs-3-XS br-4 brs-s br-gray-200 gray-100"
                >
                  {{ w }}
                </div>
              </div>
            </div>
            <div class="w-100 fd-r pb-2 px-2 fw-w">
              <div class="w-14 p-1" v-for="(d, i) in getDays()" :key="i">
                <div
                  class="w-100 h-fix-20-S h-fix-15-XS fsh-0 fd-r ai-c jc-c br-4 brs-s br-gray-300 amDatePickerButton rad-fix-2 f-white-200"
                  :class="[getDateClass(d)]"
                  @click="setDate(d)"
                >
                  <span
                    class="w-100 h-100 p-a l-0 t-0 green-200 period"
                    v-if="modelData.period"
                  />
                  <span class="w-100 h-100 p-a l-0 t-0 green-300 active" />
                  <label
                    class="fs-4-S fs-3-XS fw-600"
                    :class="{
                      'f-red-400': [6, 13, 20, 27, 34].indexOf(i) > -1,
                      'f-gray-700': [6, 13, 20, 27, 34].indexOf(i) === -1,
                    }"
                  >
                    {{ d }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="w-100" v-show="show === 1">
            <div class="w-100 fd-r pb-2 px-2 fw-w">
              <div class="w-33 p-1" v-for="(month, m) in months" :key="m">
                <div
                  class="w-100 h-fix-20 fs-4 fd-r ai-c jc-c br-4 brs-s br-gray-300 tt-u amDatePickerButton hover rad-fix-2 f-white-200"
                  :class="{ active: today.getMonth() === m }"
                  @click="setMonth(m)"
                >
                  <span class="w-100 h-100 p-a l-0 t-0 green-300 active" />
                  <label class="fs-4-S fs-3-XS fw-400 f-gray-700">
                    {{ month }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="w-100 h-fix-105" v-show="show === 2">
            <AmScroll :ops="ops">
              <div class="w-100 fd-r pb-2 px-2 fw-w">
                <div class="w-25 p-1" v-for="(year, y) in years" :key="y">
                  <div
                    class="w-100 h-fix-20 fs-4 fd-r ai-c jc-c br-4 brs-s br-gray-300 tt-u amDatePickerButton hover rad-fix-2 f-white-200"
                    :class="{ active: today.getFullYear() === year }"
                    @click="setYear(year)"
                  >
                    <span class="w-100 h-100 p-a l-0 t-0 green-300 active" />
                    <label class="fs-4-S fs-3-XS fw-400 f-gray-700">
                      {{ year }}
                    </label>
                  </div>
                </div>
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
    modelFrom: { type: Object, default: null },
    modelTo: { type: Object, default: null },
    data: { type: Object, default: null },
    // Colors
    colorLabel: { type: String, default: "gray-800" },
    colorDefault: { type: String, default: "gray-400" },
    colorFocus: { type: String, default: "green-500" },
    colorTitle: { type: String, default: "gray-A100" },
    colorBarRail: { type: String, default: "#EEEEEE" },
    colorBar: { type: String, default: "#9E9E9E" },
    theme: { type: String, default: "default" },
    // All
    sizeBar: { type: String, default: "0.5rem" },
    label: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: null },
    valueFrom: { type: Object, default: null },
    valueTo: { type: Object, default: null },
    period: { type: Boolean, default: true },
    toDate: { type: Boolean, default: true },
    dateFormat: { type: String, default: "d.m.y" },
    startYear: { type: Number, default: new Date().getFullYear() },
    endYear: { type: Number, default: new Date().getFullYear() + 16 },
    update: { type: Boolean, default: false },
    bottomText: { type: String, default: null },
  },
  data() {
    return {
      show: 0,
      today: new Date(),
      themes: ["default", "fixed", "amber"],
      weeksValue: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
      years: [],
      modelValue: null,
      dateFrom: null,
      dateTo: null,
      focusValue: false,
      modelData: {
        colorLabel: this.colorLabel,
        colorDefault: this.colorDefault,
        colorFocus: this.colorFocus,
        colorTitle: this.colorTitle,
        theme: this.theme,
        label: this.label,
        disabled: this.disabled,
        placeholder: this.placeholder,
        period: this.period,
        dateFormat: this.dateFormat,
        fromDate: this.fromDate,
        toDate: this.toDate,
        valueFrom: this.modelFrom,
        valueTo: this.modelTo,
        startYear: this.startYear,
        endYear: this.endYear,
        update: this.update,
        bottomText: this.bottomText,
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
    getInputClass() {
      return [1, 2].indexOf(this.getActiveTheme) > -1
        ? `br-0 brb-6 br-${this.modelData.colorDefault}`
        : `rad-fix-2 px-2 br-6 br-${
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
    getLabelPosition() {
      return this.focusValue || this.modelValue !== null
        ? `fs-4 b-90 f-${this.modelData.colorFocus}`
        : "fs-5 b-0";
    },
    getColorSvg() {
      return this.focusValue
        ? `svg-f-${this.modelData.colorFocus}`
        : `svg-f-${this.modelData.colorDefault}`;
    },
  },
  watch: {
    dateFrom(val) {
      this.modelData.valueFrom = val;
      if (this.modelData.update) {
        this.$emit("update:modelFrom", val);
        this.$emit("update:data", this.modelData);
      } else {
        this.$emit("setFrom", val);
        this.$emit("setData", this.modelData);
      }
    },
    dateTo(val) {
      this.modelData.valueTo = val;
      if (this.modelData.update) {
        this.$emit("update:modelTo", val);
        this.$emit("update:data", this.modelData);
      } else {
        this.$emit("setTo", val);
        this.$emit("setData", this.modelData);
      }
      if (this.modelData.toDate) {
        this.$emit("setFromTo", { from: this.dateFrom, to: this.dateTo });
        this.$emit("setDateFromTo", this.modelData);
      }
    },
  },
  methods: {
    setMonth(m) {
      this.today.setMonth(m);
      this.show = 0;
    },
    setYear(y) {
      this.today.setFullYear(y);
      this.show = 0;
    },
    setDate(d) {
      if (d) {
        const newDate = new Date(
          this.today.getFullYear(),
          this.today.getMonth(),
          d.toString()
        );
        if (this.dateFrom) {
          if (this.modelData.toDate) {
            if (this.dateTo) {
              this.dateFrom = newDate;
              this.dateTo = null;
            } else {
              this.dateTo = newDate;
              if (
                new Date(this.dateTo).getTime() - 86400000 <
                new Date(this.dateFrom).getTime() - 86400000
              ) {
                const tempDate = this.dateTo;
                this.dateTo = this.dateFrom;
                this.dateFrom = tempDate;
              }
            }
          } else {
            this.dateFrom = newDate;
          }
        } else {
          this.dateFrom = newDate;
        }
        if (!this.modelData.toDate) {
          this.focusValue = false;
        } else {
          if (this.dateFrom && this.dateTo) {
            this.focusValue = false;
          }
        }
        let modelValue = null;
        if (this.dateFrom) {
          modelValue = this.getDateFormat(this.dateFrom);
        }
        if (this.dateTo) {
          modelValue += ` - ${this.getDateFormat(this.dateTo)}`;
        }
        this.modelValue = modelValue;
      }
    },
    getDateFormat(date) {
      let model = null;
      if (this.modelData.dateFormat === "short") {
        model = `${date.getDate().toString().padStart(2, "0")} ${this.months[
          date.getMonth()
        ].slice(0, 3)} ${date.getFullYear()}`;
      } else {
        model = this.modelData.dateFormat
          .replace("d", date.getDate().toString().padStart(2, "0"))
          .replace("m", date.getMonth().toString().padStart(2, "0"))
          .replace("y", date.getFullYear());
      }
      return model;
    },
    getDateClass(d) {
      if (d) {
        if (this.dateFrom) {
          const newDate = new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            d
          );
          if (
            this.dateFrom.getTime() - 86400000 ===
            newDate.getTime() - 86400000
          ) {
            return "hover active";
          }
        }
        if (this.dateTo) {
          const newDate = new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            d
          );
          if (
            this.dateTo.getTime() - 86400000 ===
            newDate.getTime() - 86400000
          ) {
            return "hover active";
          }
        }
        if (this.dateFrom && this.dateTo && this.modelData.period) {
          const newDate = new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            d
          );
          if (
            this.dateFrom.getTime() - 86400000 <=
              newDate.getTime() - 86400000 &&
            this.dateTo.getTime() - 86400000 >= newDate.getTime() - 86400000
          ) {
            return "hover period";
          }
        }
        return "hover";
      }
      return "none";
    },
    getDays() {
      let countDay = [];
      const prevDays = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        1
      );
      for (
        let prev = 0;
        prev < (prevDays.getDay() === 0 ? 6 : prevDays.getDay() - 1);
        prev++
      ) {
        countDay.push("");
      }
      for (
        let day = 1;
        day <=
        33 -
          new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            33
          ).getDate();
        day++
      ) {
        countDay.push(day);
      }
      const nextDays = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        33 -
          new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            33
          ).getDate()
      );
      for (
        let next = 0;
        next < 7 - (nextDays.getDay() === 0 ? 7 : nextDays.getDay());
        next++
      ) {
        countDay.push("");
      }
      return countDay;
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
    for (
      let i = Number(this.modelData.startYear);
      i < Number(this.modelData.endYear);
      i++
    ) {
      this.years.push(i);
    }
    window.addEventListener("click", (e) => {
      if (e.target.closest(".amDatePicker")) {
        if (
          !e.target
            .closest(".amDatePicker")
            .isEqualNode(this.$refs.amDatePicker)
        ) {
          this.focusValue = false;
        }
      } else {
        this.focusValue = false;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.amDatePicker {
  .amDatePickerLabel {
    pointer-events: none;
    transition: 0.3s;
  }
  .amDatePickerLabelTop {
    overflow: hidden;
  }
  .amDatePickerBlock {
    input {
      outline: none;
      cursor: pointer;
      transition: 0.5s;
      &::placeholder {
        transition: 0.3s;
        color: inherit;
        opacity: 0.5;
      }
    }
    .amDatePickerLine {
      left: 50%;
      width: 0;
      transition: 0.5s;
      opacity: 0;
    }
    input.focus ~ .amDatePickerLine,
    input:focus ~ .amDatePickerLine {
      left: 0;
      width: 100%;
      opacity: 1;
    }
  }
  .amDatepickerMonth,
  .amDatepickerYear {
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      opacity: 0.5;
    }
  }
  .amDatePickerCalendar {
    box-shadow: 0 0.2rem 0.5rem #ddd;
    .amDatePickerButton {
      overflow: hidden;
      user-select: none;
      label {
        cursor: pointer;
        z-index: 2;
        transition: 0.3s;
      }
      span {
        opacity: 0;
        transition: 0.3s;
        z-index: 0;
        transform: scale(0);
        border-radius: 50%;
      }
      &.none {
        opacity: 0.5;
      }
      &.hover:hover {
        cursor: pointer;
        border: none;
        label {
          color: inherit;
        }
        span.active {
          opacity: 0.7;
          transform: scale(1);
          border-radius: 0;
        }
      }
      &.active {
        border: none;
        label {
          color: inherit;
        }
        span.active {
          opacity: 0.7;
          transform: scale(1);
          border-radius: 0;
        }
      }
      &.period {
        border: none;
        span.period {
          opacity: 0.2;
          transform: scale(1);
          border-radius: 0;
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
