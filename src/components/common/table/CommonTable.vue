<template>
  <table class="w-100 d-b-XS d-b-S ovh-x-a">
    <thead>
      <tr>
        <th
          v-for="(to, index) in tableOptions"
          :key="to.field"
          class="ta-c px-3 py-5"
          :class="{ 'brl-1 br-mcolor-400 brls-s': index !== 0 }"
        >
          <span class="fw-600 fs-6 f-white-200">
            {{ to.title }}
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(d, index) in tableData"
        :key="'tr-' + index"
        class="brt-1 br-mcolor-400 brts-d"
      >
        <td
          v-for="(key, keyIndex) in tableOptions"
          :key="'td-' + key.field + '-' + keyIndex"
          class="ta-c py-5 px-1"
          :class="{ 'brl-1 br-mcolor-400 brls-s': keyIndex !== 0 }"
        >
          <div v-if="!key.type" class="fw-400 fs-5 f-white-200">
            {{ d[key.field] }}
          </div>
          <a v-if="key.type === 'link'" class="fw-400 fs-5 f-mcolor-300">
            {{ d[key.field] }}
          </a>
          <div class="px-4" v-if="key.type === 'bin-action'">
            <div class="bin-icon c-p" @click="$emit('binAction', d)" />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    tableOptions: { type: Array, required: true },
    tableData: { type: Array, required: true },
  },
};
</script>

<style scoped>
table,
th,
td {
  border-collapse: collapse;
}
</style>
