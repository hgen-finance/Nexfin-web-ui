<template>
  <div class="w-100 fd-c ai-c">
    <div class="w-100" v-if="getTotalNotifications > 0">
      <NotificaitonsTx />
    </div>
    <AmModal
      :show="modalSession == 'new'"
      :shadow="'bs-sb-all'"
      max="w-fix-250-S w-90-XS "
      background="gradient-200"
      @closed="setModalFunc('old')"
    >
      <WelcomePopup @cancel="setModalFunc" max="w-fix-250-S w-90-XS" />
    </AmModal>
    <div
      class="w-80 br-6 gradient-2000 rad-fix-20 p-8-S p-20-XS shadow-cyan-200 jc-c mb-5-S fd-c"
    >
      <div class="w-100 fd-r ai-c">
        <span class="fw-600 mr-4-S"
          ><img
            src="@/assets/svg/symbol-company.png"
            class="h-fix-45-S h-fix-60-XS mr-1 mr-10-XS"
        /></span>
        <div class="w-60 f-white-200 fs-12-S fs-25-XS fw-600">
          Connecting value and ESG
        </div>
      </div>
      <div class="w-100 fd-r my-5-S mx-2-S fd-c-XS my-10-XS ai-c-XS fs-20-XS">
        <div class="fw-600 f-cyan-1500 mr-8-S my-5-XS">$HGEN</div>
        <div class="f-white-200 fs-5-S">
          HGEN is our governance token with which HGEN holders govern our
          ecosystem and receive the majority of fees from the farm performance.
          Holding HGEN not only yields individual earnings but also contribute
          to the expansion and growth of hydrogen industry making the Earth a
          better place.
        </div>
      </div>
      <div class="w-100 fd-r fd-c-XS mx-2-S ai-c-XS fs-20-XS">
        <div class="fw-600 f-cyan-1500 mr-8-S my-5-XS">$GENS</div>
        <div class="f-white-200 fs-5-S">
          GENS is a stable coin of HGEN platform designed to be pegged to USD.
          <br />
          GENS is main currency for our borrowing and lending protocol.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Current from "@/components/my/index/Current";
import Farming from "@/components/my/index/Farming";
import Borrowing from "@/components/my/index/Borrowing";
import Pool from "@/components/my/index/Pool";
import Balance from "@/components/my/Balance.vue";
import WelcomePopup from "../components/modals/WelcomePopup.vue";
import NotificaitonsTx from "@/components/NotificationTx.vue";

export default {
  components: {
    Current,
    Farming,
    Borrowing,
    Pool,
    Balance,
    WelcomePopup,
    NotificaitonsTx,
  },
  layout: "my",
  data() {
    return {
      modalSession: "",
    };
  },
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
  methods: {
    modal() {
      if (this.$cookie.get("user") == "old") {
        this.$accessor.checkSession(true);
      } else {
        this.$accessor.checkSession(false);
        this.$cookie.set("user", "old", { expires: "1Y" });
      }
      return this.$accessor.session;
    },
    setModalFunc(value) {
      this.$accessor.setSession(value);
      this.modalSession = value;
      console.log(this.$accessor.session);
      console.log(value, "test");
    },
  },
  mounted() {
    if (this.$cookie.get("user") != "old") {
      this.modalSession = this.modal();
    }
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
