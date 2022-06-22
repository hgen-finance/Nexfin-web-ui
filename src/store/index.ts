// Import Typed
const CoinGecko = require("coingecko-api");
import { OWNER_ACCOUNT_DATA_LAYOUT, DepositLayout } from "@/utils/layout";
import {
  getAccessorType,
  mutationTree,
  actionTree,
  getterTree,
} from "typed-vuex";

// Import Modules
import * as url from "./url";
import * as wallet from "./wallet";
import * as dashboard from "./dashboard";
import * as borrowing from "./borrowing";
import * as swap from "./swap";
import * as pool from "./pool";
import * as risky from "./risky";
import * as admin from "./admin";
import * as notification from "./notification";
import * as swapPool from "./swapPool";
import * as solFaucet from "./faucet";
import * as farm from "./farm";
import * as multiSend from "./multisend";

// pyth
import { PythConnection } from "@/store/PythConnection";
import { getPythProgramKeyForCluster } from "@/store/cluster";
import { PriceStatus } from "@/store/priceStatus";

// chainlink
import { OCR2Feed } from "@chainlink/solana-sdk";

// anchor
const anchor = require("@project-serum/anchor");

// State
export const state = () => ({
  modal: "",
  session: "new",
  totalDeposit: 0,
  debtRatio: false,
  gasFee: 0,
  governanceReward: 0,
  solReward: 0,
  tokenReward: 0,
  token: "",
  troveTotal: 0,
  usd: 0, // sol price from the coingecko
  cusd: 0, // sol price from the chainlink network
  pusd: "0", // sol price form the pyth network
  lightMode: false,
  logo: false,
  newToken: 0,
});

export type RootState = ReturnType<typeof state>;

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
  setModal(state, newValue: string) {
    state.modal = newValue;
  },
  setSession(state, newValue: string) {
    state.session = newValue;
  },
  setTotalDeposit(state, newValue: number) {
    state.totalDeposit = newValue;
  },
  setGasFee(state, newValue: number) {
    state.gasFee = newValue;
  },
  setGovernanceReward(state, newValue: number) {
    state.governanceReward = newValue;
  },
  setSolReward(state, newValue: number) {
    state.solReward = newValue;
  },
  setTokenReward(state, newValue: number) {
    state.tokenReward = newValue;
  },
  setTroveTotal(state, newValue: number) {
    state.troveTotal = newValue;
  },
  setUsd(state, newValue: number) {
    state.usd = newValue;
  },
  setCusd(state, newValue: number) {
    state.cusd = newValue;
  },
  setPusd(state, newValue: string) {
    state.pusd = newValue;
  },
  setLightMode(state, newValue: boolean) {
    state.lightMode = newValue;
  },
  setDebtRatio(state, newValue: boolean) {
    state.debtRatio = newValue;
  },
  setToken(state, newValue: string) {
    state.token = newValue;
  },
  setNewToken(state, newValue: number) {
    state.newToken = newValue;
  },
});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    checkReward({ commit }, value) {
      commit("setNewToken", value);
    },
    checkSession({ commit }, value) {
      if (value) {
        commit("setSession", "old");
      } else {
        commit("setSession", "new");
      }
    },
    async getInfo({ commit, state }) {
      // getting price for coingecko
      await this.$axios
        .get(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        )
        .then(({ data }) => {
          if (data.solana) {
            commit("setUsd", data.solana.usd);
          }
        });

      // getting price from chainlink
      const provider = new anchor.Provider(this.$web3, this.$wallet);
      anchor.setProvider(provider);

      // TODO: move this to layout file
      const CHAINLINK_FEED_ADDRESS =
        "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6";
      const CHAINLINK_PROGRAM_ID = new anchor.web3.PublicKey(
        "cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ"
      );
      const feedAddress = new anchor.web3.PublicKey(CHAINLINK_FEED_ADDRESS); //SOL-USD Devnet Feed

      //load the data feed account
      let dataFeed = await OCR2Feed.load(CHAINLINK_PROGRAM_ID, provider);
      let listener = null;

      //listen for events agains the price feed, and grab the latest rounds price data
      let price: any;
      listener = dataFeed.onRound(feedAddress, (event) => {
        console.log(event.answer.toNumber(), "ChainLink Price");
        price = event.answer.toNumber() / 1e8;
        price = price.toString().split(".");
        if (price.length > 1 && price[1].length > 2) {
          price = price[0] + "." + price[1].substr(0, 2);
        } else {
          if (price[0].length > 1) {
            price = price[0] + "." + price[1];
          }
        }

        commit("setCusd", Number(price));
        // return event.answer.toNumber();
      });

      //block execution and keep waiting for events to be emitted with price data
      // await new Promise(function () { });

      // getting price from the pyth network
      const SOLANA_CLUSTER_NAME = "devnet";
      const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME);
      const pythConnection = new PythConnection(this.$web3, pythPublicKey);
      pythConnection.onPriceChange((product, price) => {
        // sample output:
        // SRM/USD: $8.68725 ±$0.0131
        if (price.price && price.confidence) {
          // tslint:disable-next-line:no-console
          let pyth;
          if (product.symbol == "Crypto.SOL/USD") {
            // console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
            pyth = price.price.toString();
            pyth = pyth.toString().split(".");
            if (pyth.length > 1 && pyth[1].length > 2) {
              pyth = pyth[0] + "." + pyth[1].substr(0, 2);
            } else {
              if (pyth[0].length > 1) {
                pyth = pyth[0] + "." + pyth[1];
              }
            }
            commit("setPusd", pyth);
          }
        } else {
          // tslint:disable-next-line:no-console
          if (product.symbol == "Crypto.SOL/USD") {
            // console.log(`${product.symbol}: price currently unavailable. status is ${PriceStatus[price.status]}`)
            commit("setPusd", PriceStatus[price.status]);
          }
        }
      });

      // tslint:disable-next-line:no-console
      console.log("Reading from Pyth price feed...");
      pythConnection.start();

      // getting info from backend
      await this.$axios.get("/info").then(({ data }) => {
        commit("setTotalDeposit", data.depositTotal || 0);
        commit("setGasFee", data.gasFee || 0);
        commit("setGovernanceReward", data.governanceReward || 0);
        commit("setSolReward", data.solReward || 0);
        commit("setTokenReward", data.tokenReward || 0);
        commit("setTroveTotal", data.troveTotal || 0);
        commit("setLightMode", data.totalLiquidationMode || false);
        commit("setDebtRatio", data.debtRatio || 0);
        commit("setToken", data.token || "0");
      });

      // getting price for pyth
    },
    copy(_vuexContext, text: string) {
      (this as any)._vm
        .$copyText(text)
        .then(() => {
          this.$notify.success({
            message: "Copy success",
            description: "",
          });
        })
        .catch(() => {
          this.$notify.error({
            message: "Copy failed",
            description: "",
          });
        });
    },
  }
);

// Export Module
export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state,
  modules: {
    wallet,
    dashboard,
    borrowing,
    swap,
    pool,
    risky,
    admin,
    url,
    notification,
    swapPool,
    solFaucet,
    farm,
    multiSend,
  },
});
