<template>
  <div class="w-100">
    <div class="w-100 fs-10 fw-600 f-white-200 pb-10 ta-c-XS">
      Liquidation
    </div>
    <div class="w-100 fd-r pb-6">
      <div class="fs-6 fw-500 f-white-200 pr-10">
        Total
      </div>
      <div class="fs-6 f-white-200">
        <span class="f-mcolor-300 fw-600 pr-1">{{ totalBorrowers }}</span>
        BORROWERS
      </div>
    </div>
    <div class="w-100 pb-8 fd-r-S fd-c-XS">
      <div class="w-65-S w-100-XS pr-6-S pr-0-XS fd-r ai-c">
        <input
          type="text"
          class="w-100 mcolor-700 br-0 pl-3 pr-10 py-3 rad-fix-3 oul-n f-mcolor-300 fs-6"
          placeholder="Search..."
          maxlength="60"
          v-model="search"
        />
        <img src="@/assets/svg/search.svg" class="w-fix-15 p-a r-fix-s-15" />
      </div>
      <div class="w-a-S w-100-XS fsh-0 pt-6-XS">
        <AmButton
          :height="false"
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          class="py-2"
          @click="find"
        >
          FIND
        </AmButton>
      </div>
      <div class="w-35-M w-100-XS pl-6-M pl-0-XS pt-6-XS">
        <AmSelectbox
          :data="sort"
          :update="false"
          :shadow="false"
          @set="sortValue = $event"
        />
      </div>
    </div>
    <div class="w-100 fd-r ai-s">
      <div
        class="d-i fs-5 f-white-200 ta-c px-1 py-2 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100"
        v-for="(header, h) in headers"
        :key="h"
      >
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-600">
          {{ header }}
        </div>
      </div>
      <div class="w-5 fsh-0" />
    </div>
    <!-- <div class="w-100 fd-r ai-s br-t-4 brts-d br-mcolor-400" v-for="(data, d) in aTroveList" :key="d">
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.createdAt ? getDate(data.createdAt) : '' }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-mcolor-300" :title="data.owner">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.owner.substr(0, 4) + '...' + data.owner.substr(-4) }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ getLamports(data.lamports) }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.borrowAmount }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.depositorFee }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ getCollateralFunc(data.borrowAmount.toString(), data.lamports.toString()) }}%
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ Number(getLamports(data.lamports) * getUsd).toLocaleString() }}
        </div>
      </div>
      <div class="w-5 fsh-0 fd-r ai-c jc-c">
        <img src="@/assets/svg/my/bin.svg" class="w-fix-s-10 hv ts-3" @click="false" />
        <img src="@/assets/svg/my/bin.svg" class="w-fix-s-10 hv ts-3" @click="binAction({trove: data, index: d})" />
      </div>
    </div> -->
    <!-- <div class="w-100 fd-r ai-s br-t-4 brts-d br-mcolor-400" v-for="(data, d) in aTroveList" :key="d">
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.createdAt ? getDate(data.createdAt) : '' }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-mcolor-300" :title="data.owner">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.owner.substr(0, 4) + '...' + data.owner.substr(-4) }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ getLamports(data.lamports) }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.borrowAmount }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ data.depositorFee }}
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ getCollateralFunc(data.borrowAmount.toString(), data.lamports.toString()) }}%
        </div>
      </div>
      <div class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400">
        <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
          {{ Number(getLamports(data.lamports) * getUsd).toLocaleString() }}
        </div>
      </div>
      <div class="w-5 fsh-0 fd-r ai-c jc-c">
        <img src="@/assets/svg/my/bin.svg" class="w-fix-s-10 hv ts-3" @click="false" />
        <img src="@/assets/svg/my/bin.svg" class="w-fix-s-10 hv ts-3" @click="binAction({trove: data, index: d})" />
      </div>
    </div> -->
    <!-- <div class="w-100 fd-r jc-c pt-10" v-if="aTroveList.length >= (page * 10) && aTroveList.length > 0">
      <AmButton :height="false" color="mcolor-100" bColor="mcolor-100" opacityEffect @click="nextPage" class="py-2">
        More
      </AmButton>
    </div> -->
    <div class="w-100 fd-r jc-c pt-10" v-if="false">
      <AmButton
        :height="false"
        color="mcolor-100"
        bColor="mcolor-100"
        opacityEffect
        @click="nextPage"
        class="py-2"
      >
        More
      </AmButton>
    </div>
  </div>
</template>

<script>
import { getCollateral } from "@/utils/layout";
import BN from "bn.js";

export default {
  layout: "my",
  computed: {
    // aTroveList() {
    //   return this.$accessor.risky.troveList
    // },
    // troveTotal() {
    //   return this.$accessor.risky.troveTotal
    // },
    getUsd() {
      return this.$accessor.usd || 0;
    },
    totalBorrowers() {
      return 0;
    }
  },
  data() {
    return {
      search: null,
      sortValue: null,
      sort: {
        theme: "default",
        value: "createdAt",
        items: [
          { label: "Sort By Date", value: "createdAt" },
          { label: "Sort By Price", value: "lamports" },
          { label: "Sort By Debt", value: "borrowAmount" }
        ],
        colorDefault: "white-100",
        colorBackground: "white-100",
        colorFocus: "white-100",
        colorTitle: "mcolor-300"
      },
      headers: [
        "Date",
        "Holder",
        "Collateral (SOL)",
        "Debt (GENS)",
        "Fee (GENS)",
        "Collateral Ratio",
        "Liquidated Price (GENS)"
      ],
      page: 1
    };
  },
  watch: {
    sortValue(val) {
      if (val) {
        this.page = 1;
        // this.$accessor.risky.getTroveListAction({page: this.page, clear: true, search: this.search, sort: val})
      }
    }
  },
  methods: {
    getDate(date) {
      const newDate = new Date(date);
      return `${newDate.getFullYear()}/${(newDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${newDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;
    },
    getCollateralFunc(borrow, lamports) {
      return getCollateral(
        borrow,
        lamports,
        parseInt(this.$accessor.usd).toString()
      );
    },
    getLamports(lamports) {
      return new BN(lamports).div(new BN("1000000000")).toString();
    },
    binAction(val) {
      //   this.$accessor.risky.closeTroveUser(val)
    },
    find() {
      this.page = 1;
      //   this.$accessor.risky.getTroveListAction({page: this.page, clear: true, search: this.search})
    },
    nextPage() {
      this.page += 1;
      //   this.$accessor.risky.getTroveListAction({page: this.page, clear: false})
    }
  },
  mounted() {
    // this.$accessor.risky.getTroveListAction({page: this.page, clear: true})
  }
};
</script>
