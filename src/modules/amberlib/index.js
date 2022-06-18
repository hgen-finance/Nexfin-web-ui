export default function (moduleOptions) {
  // Styles
  this.options.css.push("@/modules/amberlib/styles/app.scss");

  // Plugins

  this.options.plugins.push("@/plugins/v-mask");
  this.options.plugins.push("@/plugins/v-scroll");

  // Components
  this.options.components = [
    "@/modules/amberlib/components/AmCheckbox.vue",
    "@/modules/amberlib/components/AmRadio.vue",
    "@/modules/amberlib/components/AmDivider.vue",
    "@/modules/amberlib/components/AmInput.vue",
    "@/modules/amberlib/components/AmSelectbox.vue",
    "@/modules/amberlib/components/AmDatePicker.vue",
    "@/modules/amberlib/components/AmButton.vue",
    "@/modules/amberlib/components/AmModal.vue",
  ];
}
