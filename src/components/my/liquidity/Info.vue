<template>
  <div class="w-100">
    <div
      class="d-n-XS w-100 fs-8-S fs-25-XS fw-600 f-white-200 pb-0-L pb-0-M pb-0-S pb-15-XS ta-l-S ta-c-XS"
    >
      <Balance />
    </div>
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mt-2-S mt-10-XS mb-2-S mb-10-XS"
    >
      <div class="w-100">
        <div class="w-100 fd-c py-10-XS">
          <div
            class="w-100 fs-5-S fs-20-XS f-gray-500 pt-1-S mb-2-S pb-5-XS ta-c-XS jc-c-XS fd-r jc-l rad-fix-3"
          >
            <div class="fd-r ai-c">
              <span class="fw-600">
                <img
                  src="@/assets/svg/symbol-hgen.png"
                  class="h-fix-10-S h-fix-55-XS mr-1"
                />
              </span>
            </div>
            <div class="fd-r ai-c">
              <span class="fw-600"
                ><img
                  src="@/assets/svg/sol-logo.png"
                  class="h-fix-10-S h-fix-55-XS mr-1"
              /></span>
            </div>
            <span
              class="fw-600 fs-6-L fs-5-S fs-20-XS f-white-200 mr-2 ml-2 my-10-XS ml-10-XS mr-10-XS ai-c fd-r"
              >HGEN/SOL</span
            >
          </div>
          <div
            class="w-100 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 pb-5-M pb-6-S pb-30-XS ta-l-S ta-c-XS fd-r"
          >
            Liquidity Pool
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            TOTAL LP SUPPLY
            <Hint> Total supply of LP token in the pool. </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ lpTotalSupply }}
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            TOTAL HGEN
            <Hint>Total HGEN in the liquidity pool.</Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getPoolInfo.tokenAmountA }}
            <span class="f-white-200 pl-1">HGEN</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            TOTAL SOL
            <Hint> Total SOL in the liquidity pool. </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getPoolInfo.tokenAmountB }}
            <span class="f-white-200 pl-1">SOL</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-100 p-4-S p-10-XS mcolor-500 rad-fix-3 bs-sb-all mt-2-S mt-10-XS mb-2-S mb-10-XS"
    >
      <div class="w-100">
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div
            class="w-100 fs-7-L fs-7-M fs-6-S fs-40-XS fw-600 f-white-200 pb-5-M pb-6-S pb-30-XS ta-l-S ta-c-XS"
          >
            Your Liquidity Pool
          </div>
        </div>
        <div class="w-100 fd-r pb-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            HGENS in Pool
            <Hint> Your HGEN share in the liquidity pool. </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            ≈ {{ getTokenA }} <span class="f-white-200 pl-1">HGEN</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            SOL in Pool
            <Hint> Your SOL share in the liquidity pool.</Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            ≈ {{ getTokenB }}<span class="f-white-200 pl-1">SOL</span>
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            LP Tokens
            <Hint> LP tokens you provided in the liquidity pool.</Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getMyLpToken }}
          </div>
        </div>
        <div class="w-100 fd-r py-2-S py-10-XS">
          <div class="w-100 fs-5-S fs-20-XS fw-400 f-white-200 fd-r ai-c">
            Pool Share
            <Hint>Percentage of your HGEN in the pool. </Hint>
          </div>
          <div
            class="w-a fs-5-S fs-20-XS fsh-0 fw-400 f-mcolor-100 fd-r ai-c pt-2-XS jc-c-XS"
          >
            {{ getPoolShare }}<span class="f-white-200 pl-1">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Balance from "@/components/my/swap/Balance.vue";
import Hint from "@/components/Hint";

export default {
  components: {
    Balance,
    Hint,
  },
  layout: "my",
  data() {
    return {
      lpTokenType: "GH",
    };
  },
  computed: {
    getPoolInfo() {
      let sol = this.$accessor.swapPool.tokenAmountSOLHS.toString().split(".");
      if (sol.length > 1 && sol[1].length > 2) {
        sol = sol[0] + "." + sol[1].substr(0, 2);
      } else {
        if (sol.length > 1) {
          sol = sol[0] + "." + sol[1];
        } else {
          sol = sol[0] + ".00";
        }
      }
      return {
        tokenAmountA: this.$accessor.swapPool.tokenAmountHgenHS || 0,
        tokenAmountB: sol || 0,
        tokenAmountHgenHS: this.$accessor.swapPool.tokenAmountHgenHS || 0,
        tokenAmountSOLHS: this.$accessor.swapPool.tokenAmountSOLHS || 0,
      };
    },
    getTokenA() {
      let res =
        (this.$accessor.liquidity.lpTokens /
          this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountHgenHS *
        100;
      res = res > 0 ? res.toString().split(".") : 0;
      if (res.length > 1 && res[1].length > 2) {
        res = res[0].toLocaleString() + "." + res[1].substr(0, 2);
      }
      return res;
    },
    getTokenB() {
      let res =
        (this.$accessor.liquidity.lpTokens /
          this.$accessor.liquidity.lpTotalSupply) *
        this.$accessor.swapPool.tokenAmountSOLHS *
        100;
      res = res > 0 ? res.toString().split(".") : 0;
      if (res.length > 1 && res[1].length > 9) {
        res = res[0].toLocaleString() + "." + res[1].substr(0, 9);
      }
      return res;
    },
    getPoolShare() {
      return (
        (this.$accessor.liquidity.lpTokens /
          this.$accessor.liquidity.lpTotalSupply) *
        100 *
        100
      ).toFixed(2);
    },
    lpTotalSupply() {
      this.$accessor.liquidity.getLPsupplyInfo(this.lpTokenType);
      return this.$accessor.liquidity.lpTotalSupply / 100;
    },
    getMyLpToken() {
      return this.$accessor.liquidity.lpTokens;
    },
  },
  mounted() {
    this.$accessor.swapPool.getTokenAInfo();
    this.$accessor.swapPool.getTokenBInfo();
    this.$accessor.swapPool.onTokenAChange();
    this.$accessor.swapPool.onTokenBChange();

    this.$accessor.liquidity.getLpTokens();
    this.$accessor.liquidity.updateLpToken(this.lpTokenType);
  },
};
</script>
