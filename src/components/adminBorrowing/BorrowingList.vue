<template>
  <div class="w-100 px-0-L px-4-M px-3-S px-3-XS m-0-auto">
    <div class="fw-700 f-white-200 fs-10 mb-5">Borrowing List</div>
    <div class="d-f fd-r">
      <div>
        <div class="f-white-200 fw-400 fs-6 sub-mt-1 mr-2">Total</div>
      </div>
      <div>
        <div class="fw-600 fs-6 sub-mt-1">
          <span class="f-mcolor-500">9.003</span>
          <span class="f-white-200">MEMBERS</span>
        </div>
      </div>
    </div>
    <div class="w-100 d-f fd-r jc-sb ai-c mt-4">
      <div class="w-45">
        <SimpleInput />
      </div>
      <div class="w-45 d-f fd-r jc-sb ai-c">
        <div class="w-40">
          <AmButton color="mcolor-100" opacityEffect scaleEffect :full="true">
            Find
          </AmButton>
        </div>
        <div class="w-40 ta-r">
          <span class="fw-400 fs-7 f-mcolor-300 wb-br-all"> Sort by Date </span>
        </div>
      </div>
    </div>
    <div class="w-100">
      <CommonTable
        :tableData="borrowingList"
        :tableOptions="tableOptions"
        class="mt-4"
      />
    </div>
  </div>
</template>

<script>
import SimpleInput from "@/components/common/form-elements/input-text/SimpleInput.vue";
import CommonTable from "@/components/common/table/CommonTable.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    CommonTable,
    SimpleInput,
  },
  computed: {
    ...mapGetters({ borrowingList: "admin/getBorrowingList" }),
  },
  data() {
    return {
      tableOptions: [
        { title: "Date", field: "date" },
        { title: "Holder", field: "holder", isLink: true },
        { title: "Collateral (SOL)", field: "coll" },
        { title: "Debt (GENS)", field: "debt" },
        { title: "Fee (GENS)", field: "fee" },
        { title: "Debt Ratio", field: "debtRatio" },
        { title: "Liquidated Price (GENS)", field: "price" },
      ],
    };
  },
};
</script>
