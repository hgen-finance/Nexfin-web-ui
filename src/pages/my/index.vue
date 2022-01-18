<template>
  <div class="w-100 fd-r">
    <!-- <div
      class="w-100 f-mcolor-300 fw-800 fs-15-S fs-30-XS ta-c pt-20-XS pb-1-S pb-3-XS"
    >
      <span class="f-white-200 pr-3">$</span>{{ getTotal }}
    </div>
    <div class="w-100 f-white-200 fw-400 fs-6-S fs-20-XS ta-c pb-10-S pb-30-XS">
      Total Deposited Value (Total Value Locked)
    </div> -->

    <!-- making a carousel -->

    <!-- <div class="w-100"> -->
    <!-- <div class="w-100 fd-r-S fd-c-XS ai-s jc-sb"> -->
    <div class="w-75">
      <input type="radio" name="slider" id="item-1" checked />
      <input type="radio" name="slider" id="item-2" />
      <input type="radio" name="slider" id="item-3" />
      <div class="cards cards-M cards-S">
        <label
          class="w-45-S w-100-XS br-6 gradient-1000 rad-fix-8 p-6-S p-20-XS card"
          id="card-1"
          for="item-1"
        >
          <Borrowing />
        </label>
        <label
          class="w-45-S w-100-XS gradient-1000 rad-fix-8 p-6-S p-20-XS fsh-0 mt-20-XS card"
          id="card-2"
          for="item-2"
        >
          <Pool />
        </label>
        <label
          class="w-45-S w-100-XS gradient-1000 p-6-S p-20-XS rad-fix-8-S rad-fix-20-XS mt-12-S mt-20-XS card"
          id="card-3"
          for="item-3"
        >
          <Farming />
          <!-- <img src="@/static/my-farming.png" class="h-100 p-a r-0 t-0" /> -->
        </label>
      </div>
    </div>
    <div class="w-25 d-b-XS mr-10-S">
      <div
        class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all pt-5-S pt-10-XS"
      >
        <div
          class="w-100 f-mcolor-300 fw-800 fs-10-S fs-30-XS ta-c pt-20-XS pb-1-S pb-3-XS"
        >
          <span class="f-white-200 pr-3">$</span>{{ getTotal }}
        </div>
        <div
          class="w-100 f-white-200 fw-400 fs-4-S fs-20-XS ta-c pb-5-S pb-10-XS"
        >
          Total Deposited Value (Total Value Locked)
        </div>
      </div>
    </div>
    <!-- <div class="w-100 f-mcolor-300 fw-800 fs-15-S fs-35-XS ta-c pt-12-S pt-30-XS pb-2-S pb-5-XS">
      <span class="f-white-200 pr-3">$</span>{{ getTotal }}
    </div>
    <div class="w-100 f-white-200 fw-400 fs-6-S fs-25-XS ta-c pb-10-S pb-30-XS">
      Total Deposited Value (Total Value Locked)
    </div> -->
    <!-- <div class="w-100 fd-r-S fd-c-XS ai-s">
       <div class="w-50-S w-100-XS br-6 brs-s br-mcolor-300 shadow-purple-100 p-6-S p-20-XS rad-fix-8-S rad-fix-20-XS mr-2-S">
        <Current />
      </div> 
        <div
          class="w-45-S w-100-XS gradient-600 p-6-S p-20-XS rad-fix-8-S rad-fix-20-XS  mt-12-S mt-20-XS"
        >
          <Farming />
          <img src="@/static/my-farming.png" class="h-100 p-a r-0 t-0" />
        </div> 
      </div> -->
    <!-- </div> -->
  </div>
</template>

<script>
import Current from "@/components/my/index/Current";
import Farming from "@/components/my/index/Farming";
import Borrowing from "@/components/my/index/Borrowing";
import Pool from "@/components/my/index/Pool";
import Balance from "@/components/my/Balance.vue";

export default {
  components: {
    Current,
    Farming,
    Borrowing,
    Pool,
    Balance,
  },
  layout: "my",
  computed: {
    getTotal() {
      let res = "000000000000";
      const total = Number(this.$accessor.troveTotal);
      if (total) {
        if (total > 999999999999) {
          res = 999999999999;
        } else {
          res = res.substr(0, res.length - total.toString().length) + total;
        }
      }
      return res.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,");
    },
  },
};
</script>

<style lang="scss" scoped>
.cards {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.card {
  position: absolute;
  //   width: 60%;
  height: 100%;
  left: 0;
  right: 0;
  margin: auto;
  transition: transform 0.4s ease;
  cursor: pointer;
}

// transforming the item box
#item-1:checked ~ .cards #card-3,
#item-2:checked ~ .cards #card-1,
#item-3:checked ~ .cards #card-2 {
  transform: translatex(-40%) scale(0.8);
  opacity: 0.4;
  z-index: 0;
}

#item-1:checked ~ .cards #card-2,
#item-2:checked ~ .cards #card-3,
#item-3:checked ~ .cards #card-1 {
  transform: translatex(40%) scale(0.8);
  opacity: 0.4;
  z-index: 0;
}

#item-1:checked ~ .cards #card-1,
#item-2:checked ~ .cards #card-2,
#item-3:checked ~ .cards #card-3 {
  transform: translatex(0) scale(1);
  box-shadow: 0 0 0.5rem #b556ff;

  opacity: 1;
  z-index: 1;
}

// hide the input type
input[type="radio"] {
  display: none;
}
</style>
