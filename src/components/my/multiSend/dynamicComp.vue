<template>
  <component :is="componentName" v-bind="componentProps"></component>
</template>
<script>
export default {
  props: {
    componentName: String,
    componentProps: Object,
  },
};
</script>
