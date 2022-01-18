// Import Typed
import { PublicKey } from "@solana/web3.js";
import {
  DEPOSIT_ACCOUNT_DATA_LAYOUT,
  DepositLayout,
  TOKEN_GENS,
} from "@/utils/layout";
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { depositUtil } from "@/utils/deposit";
import { addDepositUtil } from "@/utils/addDeposit";
import { withdrawUtil } from "@/utils/withdraw";
import BN from "bn.js";

require("dotenv").config();

// State
export const state = () => ({
  depositKey: { deposit: "" },
  gen: "EdvHEGQ2sqC4ZofLpj2xE5BQefgewWFY5nHe9aMcReC1",
  hgen: "8dMknixujhgPTWBLsB6WRof9e1Ud3NpH4iBVtBrsqMK7",
  rewardCoinAmount: 0,
  rewardHgenAmount: 0,
  rewardGensAmount: 0,
  depositAmount: 0,
  loading: false,
  depositOrWithdraw: true,
  depositList: [],
  depositTotal: 0,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
  setDepositKey(state, newValue: any) {
    state.depositKey = newValue;
  },
  setGen(state, newValue: string) {
    state.gen = newValue;
  },
  setHGEN(state, newValue: string) {
    state.hgen = newValue;
  },
  setRewardCoinAmount(state, newValue: number) {
    state.rewardCoinAmount = newValue;
  },
  setRewardHgenAmount(state, newValue: number) {
    state.rewardHgenAmount = newValue;
  },
  setRewardGensAmount(state, newValue: number) {
    state.rewardGensAmount = newValue;
  },
  setDepositAmount(state, newValue: number) {
    state.depositAmount = newValue;
  },
  setLoading(state, newValue: boolean) {
    state.loading = newValue;
  },
  setDepositOrWithdraw(state, newValue: boolean) {
    state.depositOrWithdraw = newValue;
  },
});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // Get Deposit
    async getDeposit({ state, commit }, value) {
      if (this.$wallet) {
        await this.$axios
          .get("deposit?user=" + this.$wallet.publicKey.toBase58())
          .then(async ({ data }) => {
            if (data.model) {
              commit("setDepositKey", data.model || "");
              // Info
              const encodedDepositAccount = (await this.$web3.getAccountInfo(
                new PublicKey(data.model.deposit),
                "singleGossip"
              ))!.data;
              const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(
                encodedDepositAccount
              ) as DepositLayout;
              if (decodedDepositState.bank) {
                commit(
                  "setGen",
                  new PublicKey(decodedDepositState.bank).toBase58()
                );
              }
              if (decodedDepositState.governanceBank) {
                commit(
                  "setHGEN",
                  new PublicKey(decodedDepositState.governanceBank).toBase58()
                );
              }

              commit(
                "setRewardGensAmount",
                new BN(
                  decodedDepositState.rewardTokenAmount,
                  10,
                  "le"
                ).toNumber()
              );
              commit(
                "setRewardHgenAmount",
                new BN(
                  decodedDepositState.rewardGovernanceTokenAmount,
                  10,
                  "le"
                ).toNumber()
              );
              commit(
                "setDepositAmount",
                new BN(decodedDepositState.tokenAmount, 10, "le").toNumber()
              );
              commit(
                "setRewardCoinAmount",
                new BN(
                  decodedDepositState.rewardCoinAmount,
                  10,
                  "le"
                ).toNumber()
              );
            }
          });
      }
    },

    // New Deposit
    async newDeposit({ state, commit }, value) {
      let GENS = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        { mint: new PublicKey(TOKEN_GENS) }
      );
      let burn_addr = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";
      if (value && Number(value.from) > 0) {
        if (!state.depositKey.deposit) {
          commit("setLoading", true);
          try {
            console.log("reached here");
            const data = await depositUtil(
              this.$wallet,
              TOKEN_GENS.toBase58(),
              Number(value.from),
              burn_addr,
              "6UeYcgjzpij4wGhVShJQsoCoi3nk2bPvz4v4Dz4cmMVv",
              this.$web3
            );
            if (data && data.depositAccountPubkey) {
              commit("setDepositKey", data.depositAccountPubkey || "");
              console.log(data, "newDeposit");
              await this.$axios
                .post("deposit/upsert", {
                  deposit: data.depositAccountPubkey,
                  amount: Number(value.from),
                })
                .then((res) => {
                  console.log(res, "newDeposit Backend");
                })
                .finally(async () => {
                  commit("setLoading", false);
                  this.$accessor.wallet.getBalance();
                  this.$accessor.wallet.getGENSBalance();
                  await this.$axios
                    .get("deposit?user=" + this.$wallet.publicKey.toBase58())
                    .then(async ({ data }) => {
                      console.log("data model:", data.model);
                      commit("setDepositKey", data.model || "");
                      // Info
                      const encodedDepositAccount =
                        (await this.$web3.getAccountInfo(
                          new PublicKey(data.model.deposit),
                          "singleGossip"
                        ))!.data;
                      const decodedDepositState =
                        DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(
                          encodedDepositAccount
                        ) as DepositLayout;
                      console.log(
                        "decodeDepositeState is ",
                        decodedDepositState
                      );

                      if (decodedDepositState.bank) {
                        commit(
                          "setGen",
                          new PublicKey(decodedDepositState.bank).toBase58()
                        );
                      }
                      if (decodedDepositState.governanceBank) {
                        commit(
                          "setHGEN",
                          new PublicKey(
                            decodedDepositState.governanceBank
                          ).toBase58()
                        );
                      }

                      commit(
                        "setRewardGensAmount",
                        new BN(
                          decodedDepositState.rewardTokenAmount,
                          10,
                          "le"
                        ).toNumber()
                      );
                      commit(
                        "setRewardHgenAmount",
                        new BN(
                          decodedDepositState.rewardGovernanceTokenAmount,
                          10,
                          "le"
                        ).toNumber()
                      );
                      commit(
                        "setDepositAmount",
                        new BN(
                          decodedDepositState.tokenAmount,
                          10,
                          "le"
                        ).toNumber()
                      );
                      commit(
                        "setRewardCoinAmount",
                        new BN(
                          decodedDepositState.rewardCoinAmount,
                          10,
                          "le"
                        ).toNumber()
                      );
                    });
                  commit("setLoading", false);
                });

              this.$accessor.wallet.getBalance();
              this.$accessor.wallet.getGENSBalance();
            }
            commit("setLoading", false);
          } catch {
            commit("setLoading", false);
          }
        }
      }
    },

    // Add Deposit
    async addDeposit({ state, commit }, value) {
      let GENS = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        { mint: new PublicKey(TOKEN_GENS) }
      );
      let burn_addr = GENS.value[0].pubkey.toBase58();
      if (value && Number(value.from) > 0) {
        if (state.depositKey.deposit) {
          commit("setLoading", true);
          try {
            const data = await addDepositUtil(
              this.$wallet,
              state.depositKey.deposit,
              TOKEN_GENS.toBase58(),
              Number(value.from),
              burn_addr,
              "6UeYcgjzpij4wGhVShJQsoCoi3nk2bPvz4v4Dz4cmMVv",
              this.$web3
            );
            //const data = await addDepositUtil(this.$wallet, state.depositKey.deposit, process.env.mint, Number(value.from), state.gen, state.hgen, this.$web3)
            // console.log("the data for the add deposit", data);
            //console.log(data, 'addDeposit')
            this.$accessor.wallet.getBalance();
            this.$accessor.wallet.getGENSBalance();

            await this.$axios.post("deposit/upsert", {
              deposit: state.depositKey.deposit,
              amount: Number(value.from),
            });
            await this.$axios
              .get("deposit?user=" + this.$wallet.publicKey.toBase58())
              .then(async ({ data }) => {
                commit("setDepositKey", data.model || "");
                // Info
                const encodedDepositAccount = (await this.$web3.getAccountInfo(
                  new PublicKey(data.model.deposit),
                  "singleGossip"
                ))!.data;
                const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(
                  encodedDepositAccount
                ) as DepositLayout;
                if (decodedDepositState.bank) {
                  commit(
                    "setGen",
                    new PublicKey(decodedDepositState.bank).toBase58()
                  );
                }
                if (decodedDepositState.governanceBank) {
                  commit(
                    "setHGEN",
                    new PublicKey(decodedDepositState.governanceBank).toBase58()
                  );
                }

                commit(
                  "setRewardGensAmount",
                  new BN(
                    decodedDepositState.rewardTokenAmount,
                    10,
                    "le"
                  ).toNumber()
                );
                commit(
                  "setRewardHgenAmount",
                  new BN(
                    decodedDepositState.rewardGovernanceTokenAmount,
                    10,
                    "le"
                  ).toNumber()
                );
                commit(
                  "setDepositAmount",
                  new BN(decodedDepositState.tokenAmount, 10, "le").toNumber()
                );
                commit(
                  "setRewardCoinAmount",
                  new BN(
                    decodedDepositState.rewardCoinAmount,
                    10,
                    "le"
                  ).toNumber()
                );
              });
            commit("setLoading", false);
          } catch {
            commit("setLoading", false);
          }
        }
      }
    },

    // Close Deposit
    async closeDeposit({ state, commit }, value) {
      let GENS = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        { mint: new PublicKey(TOKEN_GENS) }
      );
      let mint_acc_addr = GENS.value[0].pubkey.toBase58();
      console.log(mint_acc_addr, "mint acc addr");
      if (
        value &&
        Number(value) > 0 &&
        Number(value) <= this.$accessor.pool.depositAmount
      ) {
        if (state.depositKey) {
          commit("setLoading", true);
          try {
            await this.$axios
              .post("deposit/withdraw", {
                deposit: state.depositKey.deposit,
                amount: Number(value),
              })
              .then(({ data }) => {
                console.log(data, "closeDeposit");
              });
            await withdrawUtil(
              this.$wallet,
              state.depositKey.deposit,
              TOKEN_GENS.toBase58(),
              Number(value),
              mint_acc_addr,
              this.$web3
            ).finally(async () => {
              this.$accessor.wallet.getBalance();
              this.$accessor.wallet.getGENSBalance();
              console.log("it is trying to withdraw");
              await this.$axios
                .get("deposit?user=" + this.$wallet.publicKey.toBase58())
                .then(async ({ data }) => {
                  commit("setDepositKey", data.model || "");
                  // Info
                  const encodedDepositAccount =
                    (await this.$web3.getAccountInfo(
                      new PublicKey(data.model.deposit),
                      "singleGossip"
                    ))!.data;
                  const decodedDepositState =
                    DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(
                      encodedDepositAccount
                    ) as DepositLayout;

                  if (decodedDepositState.bank) {
                    commit(
                      "setGen",
                      new PublicKey(decodedDepositState.bank).toBase58()
                    );
                  }
                  if (decodedDepositState.governanceBank) {
                    commit(
                      "setHGEN",
                      new PublicKey(
                        decodedDepositState.governanceBank
                      ).toBase58()
                    );
                  }

                  commit(
                    "setRewardGensAmount",
                    new BN(
                      decodedDepositState.rewardTokenAmount,
                      10,
                      "le"
                    ).toNumber()
                  );
                  commit(
                    "setRewardHgenAmount",
                    new BN(
                      decodedDepositState.rewardGovernanceTokenAmount,
                      10,
                      "le"
                    ).toNumber()
                  );
                  commit(
                    "setDepositAmount",
                    new BN(decodedDepositState.tokenAmount, 10, "le").toNumber()
                  );
                  commit(
                    "setRewardCoinAmount",
                    new BN(
                      decodedDepositState.rewardCoinAmount,
                      10,
                      "le"
                    ).toNumber()
                  );
                });
              commit("setLoading", false);
            });
          } catch (e) {
            console.log(Error, e);
            commit("setLoading", false);
          }
        }
      }
    },

    // Change the deposit and withdraw tab
    async changeWithdrawAndDeposit({ state, commit }, value) {
      commit("setDepositOrWithdraw", !value);
    },
  }
);
