// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import
import { PublicKey } from "@solana/web3.js";
import { Wallets, WalletInfo } from "../utils/wallets";
import { Result } from "ant-design-vue";
import Wallet from "@project-serum/sol-wallet-adapter";
import { WalletAdapter } from "@solana/wallet-base";
import { PhantomWalletAdapter } from "@/components/my/wallets";

export const TOKEN_GENS = new PublicKey(
    "7d3U17g4WEZkVGjRVVQchrgEaoFAuuui2xmEGCzmtUGt"
);
export const TOKEN_HGEN = new PublicKey(
    "6UeYcgjzpij4wGhVShJQsoCoi3nk2bPvz4v4Dz4cmMVv"
);
const LAMPORTS = 1000000000;

// State
export const state = () => ({
    publicKey: "",
    wallets: Wallets,
    errorConnect: false,
    loaderConnect: false,
    balance: 0,
    balanceHGEN: 0,
    balanceGENS: 0,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setPublicKey(state, newValue: string) {
        state.publicKey = newValue;
    },

    setErrorConnect(state, newValue: boolean) {
        state.errorConnect = newValue;
    },

    setLoaderConnect(state, newValue: boolean) {
        state.loaderConnect = newValue;
    },

    setBalance(state, newValue: number | null) {
        state.balance = newValue;
    },

    setBalanceHGEN(state, newValue: number | null) {
        state.balanceHGEN = newValue;
    },

    setBalanceGENS(state, newValue: number | null) {
        state.balanceGENS = newValue;
    },

    setClearState(state) {
        state.publicKey = "";
        state.balance = 0;
        state.balanceHGEN = 0;
        state.balanceGENS = 0;
    },
});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {
        // Get Balance for sols
        async getBalance({ commit }) {
            if (this.$web3 && this.$wallet) {
                const data = this.$web3.getBalance(this.$wallet.publicKey);
                data.then((value) => {
                    commit("setBalance", value / LAMPORTS);
                });
            }
        },

        // getting balance from the hgens from the wallet
        async getHGENBalance({ commit }) {
            if (this.$web3 && this.$wallet) {
                let myTokenAmount = 0;
                await this.$web3
                    .getParsedTokenAccountsByOwner(this.$wallet.publicKey, {
                        mint: new PublicKey(TOKEN_HGEN),
                    })
                    .then((res) => {
                        myTokenAmount = res.value[0]
                            ? res.value[0].account.data.parsed.info.tokenAmount.uiAmountString
                            : 0;
                    })
                    .catch((err) => console.log(err));
                commit("setBalanceHGEN", Number(myTokenAmount));
            }
        },

        //getting balance for gens from the wallet
        async getGENSBalance({ commit }) {
            if (this.$web3 && this.$wallet) {
                let myTokenAmount = 0;
                await this.$web3
                    .getParsedTokenAccountsByOwner(this.$wallet.publicKey, {
                        mint: new PublicKey(TOKEN_GENS),
                    })
                    .then((res) => {
                        myTokenAmount = res.value[0]
                            ? res.value[0].account.data.parsed.info.tokenAmount.uiAmountString
                            : 0;
                    })
                    .catch((err) => console.log(err));
                commit("setBalanceGENS", Number(myTokenAmount));
            }
        },

        // Connection
        async connectWallet({ commit, dispatch }, wallet: WalletInfo) {
            commit("setLoaderConnect", true);
            // I have set it for testnet, need to change for main net
            const adapter = await wallet.getAdapter({
                providerUrl: wallet.url,
                endpoint: "https://api.testnet.solana.com",
            });
            if (!adapter || !this.$web3) {
                this.app.$accessor.setModal("connectError");
                console.error("connection error");
                return;
            }
            this.$wallet = adapter;
            adapter.on("connect", () => {
                if (adapter.publicKey) {
                    commit("setPublicKey", adapter.publicKey.toBase58());
                    this.app.$accessor.setModal("");
                    this.$router.push("/my");
                }
                commit("setLoaderConnect", false);
                if (this.$wallet.publicKey) {
                    dispatch("getBalance");
                    dispatch("getHGENBalance");
                    dispatch("getGENSBalance");
                    // TODO refractor the code
                    dispatch("borrowing/getTrove", null, { root: true }); // for borrow
                    dispatch("pool/getDeposit", null, { root: true }); // for deposit
                }
            });

            try {
                adapter.connect();
            } catch (error) {
                console.log(error);
                commit("setErrorConnect", true);
                commit("setLoaderConnect", false);
            }
        },

        // Disconnection
        logout({ commit, dispatch }) {
            if (this.$wallet) {
                this.$wallet.disconnect();
                this.$wallet = null;
            }
            // commit("setPublicKey", "");
            this.$router.push("/");
            // TODO check if this need any changes later
            commit("setClearState");
            dispatch("borrowing/clearTrove", null, { root: true });
            dispatch("pool/clearDeposit", null, { root: true });
        },

        // update the cached balance price
        async updateBalance({ commit }) {
            if (this.$wallet) {
                // TODO uncomment this if it is added in the business requirement
                // let GENS = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {mint: new PublicKey(TOKEN_GENS)});
                // if (GENS.value[0]){
                //     let gensAccount =GENS.value[0].pubkey;

                //     this.$web3.onAccountChange(gensAccount, async (val)=>{
                //         let gensAmount = GENS.value[0] ? GENS.value[0].account.data.parsed.info.tokenAmount.uiAmountString : 0;
                //         commit('setBalanceGENS', Number(gensAmount))
                //     })
                // }
                this.$web3.onAccountChange(
                    this.$wallet.publicKey,
                    async function (val) {
                        commit("setBalance", val.lamports / LAMPORTS);
                    }
                );
            }
        },
    }
);
