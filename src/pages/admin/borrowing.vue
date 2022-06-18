<template>
  <div class="container w-100 fd-c jc-c pt-10 pb-10 m-0-auto">
    <div
      class="w-70-L w-70-M w-100-S gradient-200 rad-fix-8 p-10-M p-10-S p-10-XS m-0-auto br-mcolor-400 br-1 brs-s"
    >
      <Notification />
      <div class="w-100 pt-10">
        <div class="w-100 fs-10 fw-600 f-white-200 pb-10 ta-c-XS">
          Depositor List
        </div>
        <div class="w-100 fd-r pb-6">
          <div class="fs-6 fw-500 f-white-200 pr-10">Total</div>
          <div class="fs-6 f-white-200">
            <span class="f-mcolor-300 fw-600 pr-1">{{ depositTotal }}</span>
            DEPOSITORS
          </div>
        </div>
        <div class="w-100 pb-8 fd-r-S fd-c-XS">
          <div class="w-75-S w-100-XS pr-6-S pr-0-XS fd-r ai-c">
            <input
              type="text"
              class="w-100 mcolor-700 br-0 pl-3 pr-10 py-3 rad-fix-3 oul-n f-mcolor-300 fs-6"
              placeholder="Search..."
              maxlength="60"
              v-model="search"
            />
            <img
              src="@/assets/svg/search.svg"
              class="w-fix-15 p-a r-fix-s-15"
            />
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
          <div class="w-25-M w-100-XS pl-6-M pl-0-XS pt-6-XS">
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
        </div>
        <div
          class="w-100 fd-r ai-s br-t-4 brts-d br-mcolor-400"
          v-for="(data, d) in depositList"
          :key="d"
        >
          <div
            class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-400"
          >
            <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
              {{ data.createdAt ? getDate(data.createdAt) : "" }}
            </div>
          </div>
          <div
            class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-mcolor-300"
            :title="data.deposit"
          >
            <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
              {{ data.deposit.substr(0, 4) + "..." + data.deposit.substr(-4) }}
            </div>
          </div>
          <div
            class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-300"
          >
            <div class="w-100 h-100 fd-r ai-c jc-c ta-c fw-400">
              {{ data.tokenAmount }}
            </div>
          </div>
          <div
            class="d-i fs-5 ta-c px-1 py-4 br-r-4 brrs-s br-mcolor-400 fd-r ai-c jc-c w-100 f-gray-300"
          >
            <div class="w-100 fw-400 f-mcolor-300 fd-r jc-r pr-2">
              {{ data.rewardCoinAmount }}
              <span class="f-white-200 pl-1">SOL</span>
            </div>
            <div class="w-100 fw-400 f-mcolor-300 fd-r jc-r pr-2">
              {{ data.rewardTokenAmount }}
              <span class="f-white-200 pl-1">GENS</span>
            </div>
            <div class="w-100 fw-400 f-mcolor-300 fd-r jc-r pr-2">
              {{ data.rewardGovernanceTokenAmount }}
              <span class="f-white-200 pl-1">HGEN</span>
            </div>
          </div>
        </div>
        <div
          class="w-100 fd-r jc-c pt-10"
          v-if="depositList.length >= page * 10 && depositList.length > 0"
        >
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
    </div>
  </div>
</template>

<script>
import Notification from "@/components/adminBorrowing/Notification.vue";

import { encodeUtil } from "@/utils/trove";
import { getCollateral } from "@/utils/layout";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export default {
  layout: "admin",
  components: {
    Notification,
  },
  computed: {
    depositList() {
      return this.$accessor.admin.depositList;
    },
    depositTotal() {
      return this.$accessor.admin.depositTotal;
    },
  },
  data() {
    return {
      search: null,
      sortValue: null,
      mode: {
        theme: "default",
        label: "",
        value: false,
        items: [
          { label: "Off", value: false },
          { label: "On", value: true },
        ],
        colorLabel: "white-200",
        colorBackground: "white-100",
        colorBorderChecked: "mcolor-100",
        colorBackgroundChecked: "mcolor-100",
      },
      sort: {
        theme: "default",
        value: "createdAt",
        items: [
          { label: "Sort By Date", value: "createdAt" },
          { label: "Sort By Price", value: "tokenAmount" },
          { label: "Sort By Sol", value: "rewardCoinAmount" },
          { label: "Sort By GENS", value: "rewardTokenAmount" },
          { label: "Sort By HGEN", value: "rewardGovernanceTokenAmount" },
        ],
        colorDefault: "white-100",
        colorBackground: "white-100",
        colorFocus: "white-100",
        colorTitle: "mcolor-300",
      },
      headers: ["Date", "Holder", "Deposit (GENS)", "Remained"],
      page: 1,
    };
  },
  watch: {
    sortValue(val) {
      if (val) {
        this.page = 1;
        this.$accessor.admin.getDepositList({
          page: this.page,
          clear: true,
          search: this.search,
          sort: val,
        });
      }
    },
  },
  methods: {
    getDate(date) {
      const newDate = new Date(date);
      return `${newDate.getFullYear()}/${(newDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${newDate.getDate().toString().padStart(2, "0")}`;
    },
    binAction(val) {
      console.log(val);
    },
    find() {
      this.page = 1;
      this.$accessor.admin.getDepositList({
        page: this.page,
        clear: true,
        search: this.search,
      });
    },
    nextPage() {
      this.page += 1;
      this.$accessor.admin.getDepositList({ page: this.page, clear: false });
    },
  },
  mounted() {
    this.$accessor.admin.getDepositList({ page: this.page, clear: true });
  },
};
</script>
