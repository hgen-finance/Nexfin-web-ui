<template>
  <div class="w-100">
    <transition name="fade">
      <div class="w-100 p-4 fd-c ai-c rad-fix-8 mb-3 mt-1">
        <div class="d-f fd-c ai-c">
          <img
            src="@/assets/svg/symbol-hgen.png"
            class="w-fix-s-60-S w-fix-s-100-XS"
          />
          <div
            class="w-100 ta-c fs-8-M fs-6-S fs-20-XS f-white-200 pt-2-S pt-8-XS pb-2 fw-600"
          >
            HGEN FINANCE
          </div>
          <div
            class="w-100 ta-c fs-10-M fs-7-S fs-25-XS f-white-200 fw-600 glow"
          >
            Welcome, Testers!
          </div>

          <div class="w-100 fd-c ai-c py-4-M py-2-S py-20-XS f-white-200">
            <div class="w-100">
              <div
                class="w-100-S w-100-XS px-8-S py-4-M py-10-S p-20-XS mb-3-S mb-10-XS"
                v-for="(item, i) in items"
                :key="i"
                :class="{ 'mcolor-1000  rad-fix-10 bs-sb-all': i === 0 }"
              >
                <div
                  class="w-100 fs-8-M fs-10-S fs-25-XS f-white-200 fw-600"
                  v-html="item.name"
                />
                <div class="w-100 pt-2-S pt-5-XS">
                  <div
                    class="w-100 fd-r ai-t py-2-M py-3-S py-5-XS fs-5-M fs-8-S fs-18-XS f-white-200"
                    v-for="(item2, i2) in item.items"
                    :key="i2"
                  >
                    <img
                      :src="require('@/assets/svg/' + item2.img)"
                      class="h-fix-s-9-M h-fix-s-7-S h-fix-s-20-XS mr-2-S mr-5-XS"
                    />
                    <span v-html="item2.name" />
                  </div>
                </div>
              </div>
            </div>
            <p class="fs-5-M fs-6-S fs-15-XS">
              We are currently on
              <span class="f-purple-500 fw-600"> Devnet</span> and still on
              development. Help
              <span class="f-purple-500 fw-600">HGEN</span> improve by reporting
              bug to our
              <span class="f-purple-500"
                ><a href="https://discord.com/invite/kmc8QUX3Jx"
                  >Discord</a
                ></span
              >
              or
              <span class="f-purple-500"
                ><a href="https://t.me/hgenFinance">Telegram</a></span
              >. We are in
              <span class="f-purple-500">process of auditing</span> our smart
              contract.
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import { Button, Modal, Icon } from "ant-design-vue";

export default {
  components: {
    Loading,
    Modal,
  },
  data() {
    return {
      items: [
        {
          name: "",
          img: "",
          items: [
            {
              img: "checkOn.svg",
              name: "Collateralised borrowing defi plaform",
            },
            { img: "checkOn.svg", name: "Zero interest fee on borrow" },
            { img: "checkOn.svg", name: "Lend borrowed tokens for rewards" },
            {
              img: "checkOn.svg",
              name: "Add liquidity to earn rewards and Lp tokens",
            },
            {
              img: "checkOn.svg",
              name: "Farm Lp tokens to earn more rewards",
            },
          ],
        },
      ],
    };
  },
  props: {
    wallets: { type: Array, default: null },
    error: { type: Boolean, default: false },
    loader: { type: Boolean, default: false },
  },
  methods: {
    importIcon(path) {
      try {
        return require(`@/assets${path}`);
      } catch (e) {
        return require("@/assets/icons/unknown.png");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.select-wallet {
  .btn-effect {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    width: 100%;
    height: 48px;
    text-align: left;

    img {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }
    &:hover {
      background: #8f00ff;
      transition: ease-in 300ms;
    }
  }

  button:not(:first-child) {
    margin-top: 10px;
  }
}
</style>
