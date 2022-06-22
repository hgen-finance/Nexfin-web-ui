<template>
  <div
    class="w-100 br-6 gradient-2000 rad-fix-8 p-8-S p-20-XS shadow-purple-100 fd-c"
  >
    <div class="w-100">
      <div class="fw-600 fs-8-S fs-25-XS f-white-200">Multi Transaction</div>
    </div>
    <!-- <div class="w-100 fd-c ai-s" ref="container">
      <div class="cside-L cside-M cside-S cside-XS fd-r jc-c mt-8-XS mt-2-S">
        <div
          class="fd-r jc-c f-white-200 ai-c micon-L micon-M micon-S micon-XS"
          @click="addInput"
        >
          <Icon type="plus" :rotate="90" />
        </div>
      </div>
    </div> -->
    <div
      class="w-100 mt-2-S mt-10-XS mb-1 mb-5-XS rad-fix-2-S rad-fix-15-XS fd-r"
    >
      <div class="w-100 pb-0 fd-r jc-r ai-c py-2-S py-5-XS">
        <div
          class="pr-2 pr-5-XS p-a-S p-r-XS l-0 t-15 w-50 mcolor-700 pl-5-XS pl-3-S rad-fix-5"
        >
          <AmSelectbox
            v-bind:data.sync="tokens"
            :update="true"
            :shadow="false"
            :padding="false"
            color="mcolor-700"
            bColor="mcolor-700"
          />
        </div>
        <div class="w-45" v-if="getToken != 'SOL'">
          <AmButton
            color="mcolor-100"
            bColor="mcolor-100"
            opacityEffect
            full
            @click="getAccount"
          >
            Get Accounts
          </AmButton>
        </div>
        <div class="w-45" v-if="getToken == 'SOL'">
          <AmButton
            color="mcolor-1001"
            bColor="mcolor-1001"
            opacityEffect
            full
            disabled
          >
            Get Accounts
          </AmButton>
        </div>
      </div>
    </div>
    <div class="w-100" v-if="getToken != 'SOL'">
      <div class="w-100 f-white-200 fw-500 fs-6 fs-10-XS my-1-S my-5-XS">
        Your Token Account
      </div>
      <div
        class="w-100 mb-2-S mb-5-XS mcolor-700 rad-fix-2 px-4-S px-10-XS py-3-S py-10-XS"
      >
        <div class="w-100 f-mcolor-500 fs-5-S" v-if="getToken != 'SOL'">
          <input
            type="text"
            class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-500 f-mcolor-300"
            placeholder="Token Account Address"
            v-model="tokenAcc"
          />
        </div>
      </div>
    </div>
    <div class="w-100">
      <div class="w-100 f-white-200 fw-500 fs-6 fs-10-XS my-1-S my-5-XS">
        List of Destination wallet Addresses
      </div>
      <div class="w-100 mb-2-S mb-5-XS rad-fix-2 py-3-S py-10-XS">
        <div class="w-100 f-mcolor-500 fs-5-S">
          <!-- <textarea
            v-model="destAddress"
            class="w-100 mx-1 white-100 br-0 oul-n fs-6-S fs-20-XS fw-500 f-mcolor-300 h-fix-50-S h-fix-80-XS"
            placeholder="Add multiple address"
          ></textarea> -->

          <codemirror
            v-model="destAddress"
            :options="cmOption"
            placeholder="Wallet Address, Amount"
          ></codemirror>
        </div>
      </div>
    </div>

    <div class="w-100 fd-r jc-sb ai-c mb-3-S mb-10-XS">
      <div class="w-45">
        <AmButton
          color="mcolor-200"
          bColor="mcolor-100"
          opacityEffect
          full
          @click="reset"
        >
          Reset
        </AmButton>
        <!-- <AmButton
        color="mcolor-1001"
        bColor="mcolor-1001"
        full
        v-if="dayLeft != 0"
        disabled
      >
        Claim
      </AmButton> -->
      </div>
      <div class="w-45">
        <AmButton
          color="mcolor-100"
          bColor="mcolor-100"
          opacityEffect
          full
          @click="send"
        >
          Send
        </AmButton>
        <!-- <AmButton
        color="mcolor-1001"
        bColor="mcolor-1001"
        full
        v-if="dayLeft != 0"
        disabled
      >
        Claim
      </AmButton> -->
      </div>
    </div>
    <div
      class="w-100 mcolor-700 p-4-S p-15-XS rad-fix-4 fs-5-S fs-20-XS f-white-200 mb-4-S mb-10-XS"
    >
      <div class="w-100">
        <span class="fw-600 f-red-500">Note:</span> This is on development
        feature.<br />
        <br />
        Please click on the
        <span class="fw-600 f-green-500">GET ACCOUNTS</span> after you enter the
        destination wallet address for the non native token. You need to make
        sure that the destination wallet has token account available. <br />
        <br />
        Approx. of <span class="fw-600 f-green-500">8</span> multi wallet
        transactions are possible.
      </div>
    </div>
    <div
      class="w-100 mcolor-800 p-4-S p-15-XS rad-fix-4 fs-5-S fs-20-XS f-mcolor-500 mb-4-S mb-10-XS"
      v-if="getAlert"
    >
      <div class="w-100">{{ getAlert }}</div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
import AddressInput from "@/components/my/multiSend/addressInput.vue";
import DynamicComp from "@/components/my/multiSend/dynamicComp.vue";
import { Icon, Tooltip, Button, Progress, Spin, Modal } from "ant-design-vue";

// language
import "codemirror/mode/vue/vue.js";
// theme css
import "codemirror/theme/base16-dark.css";
// active-line.js
import "codemirror/addon/selection/active-line.js";
// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";
// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";
import "codemirror/addon/display/placeholder.js";
// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

import { TOKEN_GENS } from "@/utils/layout";
import { TOKEN_HGEN } from "@/store/wallet";

const TOKENS = [
  { label: "GENS", value: TOKEN_GENS, decimal: 2 },
  { label: "SOL", value: "", decimal: 8 },
  { label: "HGEN", value: TOKEN_HGEN, decimal: 2 },
];

export default {
  components: {
    Loading,
    AddressInput,
    DynamicComp,
    Icon,
  },
  data() {
    return {
      cmOption: {
        tabSize: 3,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        foldGutter: true,
        styleSelectedText: true,
        mode: "text/javascript",
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "",
        extraKeys: { Ctrl: "autocomplete" },
        hintOptions: {
          completeSingle: false,
        },
      },
      tokens: {
        theme: "default",
        value: "",
        items: TOKENS,
        colorDefault: "mcolor-700",
        colorFocus: "mcolor-700",
        colorBackground: "mcolor-700",
        colorTitle: "white-200",
      },
      pay: true,
      details: "",
      parseTokenAccounts: null,
      alertMsg: "",
      tokenAcc: "",
      destAddress: "",
    };
  },
  watch: {
    tokens(val) {},
    details(val) {},
    destAddress(val) {},
  },
  computed: {
    getToken() {
      return TOKENS.filter((token) => token.value == this.tokens.value)[0]
        .label;
    },
    getTokenDecimal() {
      return TOKENS.filter((token) => token.value == this.tokens.value)[0]
        .decimal;
    },
    getTokenMint() {
      return this.tokens.value;
    },
    publicKey() {
      return this.$accessor.wallet.publicKey;
    },
    getTokenAcc() {
      return this.tokenAcc;
    },
    getAlert() {
      return this.alertMsg;
    },
    getParsedTokenAccounts() {
      return this.parseTokenAccounts;
    },
  },
  methods: {
    async getAccount() {
      if (this.publicKey) {
        if (this.getToken != "SOL") {
          const accAddr = await this.$accessor.multisend.getAccount({
            mintAddr: this.tokens.value,
          });
          console.log(accAddr);
          this.tokenAcc = accAddr.value[0].pubkey;

          let results = await this.$accessor.multisend.getTokenAccounts({
            mintAddr: this.tokens.value,
            details: this.destAddress,
          });
          this.parseTokenAccounts = results;

          if (!accAddr) {
            this.alertMsg = `you dont have ` + this.getToken + " token account";
          }
        }
      } else {
        this.alertMsg = "Please connect your wallet";
      }
    },
    async send() {
      if (this.getToken == "SOL") {
        await this.$accessor.multisend.multiTransfer({
          label: this.getToken,
          userTokenAcc: this.publicKey,
          mintAddr: "",
          details: this.destAddress,
          pay: this.pay,
          decimal: this.getTokenDecimal,
        });
      } else {
        await this.$accessor.multisend.multiTransfer({
          label: this.getToken,
          userTokenAcc: this.getTokenAcc,
          mintAddr: this.getTokenMint,
          details: this.parseTokenAccounts,
          pay: this.pay,
          decimal: this.getTokenDecimal,
        });
      }
    },
    reset() {
      this.destAddress = "";
    },
  },
};
</script>
<style scoped>
.CodeMirror pre.CodeMirror-line-like {
  color: #999 !important;
}
</style>
