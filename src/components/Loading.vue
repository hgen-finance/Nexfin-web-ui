<template>
  <div class="lds-ring">
    <div :style="style"></div>
    <div :style="style"></div>
    <div :style="style"></div>
    <div :style="style"></div>
  </div>
</template>

<script>
export default {
  props: {
    width: { type: String, default: "4rem" },
    height: { type: String, default: "4rem" },
  },
  computed: {
    style() {
      return "width:" + this.width + ";height:" + this.height;
    },
  },
};
</script>

<style scoped>
.lds-ring {
  display: flex;
  align-items: center;
  position: relative;
  width: 4rem;
  height: 4rem;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  margin: 0.2rem;
  border: 0.2rem solid #cf68ff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #cf68ff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
