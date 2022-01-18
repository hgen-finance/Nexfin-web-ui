<template>
  <div class="d-f">
    <div class="f-white-200 fw-400 fs-6">{{ label }}</div>
    <div class="fw-600 fs-6" v-if="count !== '' && info !== ''">
      <span class="f-mcolor-500">
        {{ count }}
      </span>
      <span class="f-white-200">
        {{ info }}
      </span>
    </div>
    <div class="fw-600 fs-6 f-red-600" v-else>
      <span> OFF </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: { type: String, default: "Title" },
    count: { type: String, default: "" },
    info: { type: String, default: "" },
  },
};
</script>
