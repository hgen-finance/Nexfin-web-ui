<template>
  <span class="hint f-white-200">
    <label
      class="w-fix-s-12-S h-fix-s-12-S w-fix-s-42-XS h-fix-s-42-XS fd-r jc-c ai-c mcolor-100 rad-fix-2 fs-6-S fs-17-XS fw-600 ml-2-S ml-6-XS p-r"
      >?</label
    >
    <span
      class="popup w-fix-100min w-100max-S w-a-XS shadow-purple-100 p-2-S p-10-XS p-a l-0 t-100 fs-5-S fs-20-XS mcolor-500 rad-fix-3 fw-400 f-lh-13-S f-lh-43-XS z-15"
    >
      <slot />
    </span>
  </span>
</template>

<style lang="scss" scoped>
.hint {
  .popup {
    transform: translate(-50%, 1rem);
    display: none;
  }
  &:hover label + .popup {
    display: block;
  }
}
</style>
