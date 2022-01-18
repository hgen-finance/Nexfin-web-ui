<style>
.loading-page {
  display: flex;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-family: sans-serif;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: sans-serif;
}
.outer-circle {
  position: relative;
  margin: 10px auto;
  width: 100px;
  height: 100px;
  border-radius: 100% !important;
  box-shadow: inset -2px -2px 6px 0px rgba(255, 255, 255, 0.8),
    inset 2px 2px 6px 0px rgba(175, 186, 214, 0.8);
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
  background: #e5ebf4;
  box-shadow: -2px -2px 6px 0px rgba(255, 255, 255, 0.8),
    2px 2px 6px 0px rgba(175, 186, 214, 0.8),
    inset 0px 0px 0px 0px rgba(255, 255, 255, 0.8),
    inset 0px 0px 0px 0px rgba(175, 186, 214, 0.8);
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
</style>
<script>
// window.addEventListener("error", function () {
//   var e = document.getElementById("nuxt-loading");
//   if (e) {
//     e.className += " error";
//   }
// });
//
</script>
