<template>
  <div v-if="loading" class="loading-page ">
    <div class="outer-circle">
      <div class="inner-circle">
        <img src="@/assets/svg/company_logo.png" alt="nexfin Logomark" />
      </div>
    </div>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-family: sans-serif;
}
.outer-circle {
  position: relative;
  margin: 10px auto;
  width: 100px;
  height: 100px;
  border-radius: 100% !important;
  box-shadow: inset -2px -2px 6px 0px var(--light-shadow),
    inset 2px 2px 6px 0px var(--dark-shadow);
}
.button .outer-circle {
  width: 31px;
  height: 31px;
  box-shadow: unset;
}
.button .inner-circle {
  box-shadow: unset;
}
.inner-circle {
  z-index: 2;
  position: absolute;
  top: calc(50% - 40%);
  left: calc(50% - 40%);
  width: 80%;
  height: 80%;
  border-radius: 100% !important;
  background: var(--white);
  box-shadow: -2px -2px 6px 0px var(--light-shadow),
    2px 2px 6px 0px var(--dark-shadow),
    inset 0px 0px 0px 0px var(--light-shadow),
    inset 0px 0px 0px 0px var(--dark-shadow);
}
.inner-circle img {
  width: 100%;
  height: auto;
  animation: rotate 1.15s ease-in-out infinite;
}
@keyframes rotate {
  100% {
    transform: rotate(-360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}
@media screen and (max-width: 1100px) {
  .fullscreen {
    width: 100% !important;
    height: calc((var(--vh, 1vh) * 100)) !important;
  }
}
</style>
