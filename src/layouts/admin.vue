<template>
  <div class="w-100 h-100min">
    <div class="w-100 h-100min p-f l-0 t-0 ovh-y-a bg-r" />
    <Nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$accessor.getInfo();
  },
};
</script>
