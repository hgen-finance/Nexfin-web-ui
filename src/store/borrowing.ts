// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// TODO: Make sure the devnet amount isnt shown up in the devnet account

import {
  AccountLayout,
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// Import Utils
import { borrowUtil } from "@/utils/borrow";
import { closeBorrowUtil } from "@/utils/closeBorrow";
import { createATA } from "@/utils/createATA";
import { payBorrowUtil } from "@/utils/payBorrow";
import { addBorrowUtil } from "@/utils/addBorrow";
import {
  TROVE_ACCOUNT_DATA_LAYOUT,
  TroveLayout,
  getCollateral,
  TOKEN_GENS,
  CLUSTER,
  EscrowProgramIdString,
} from "@/utils/layout";
import BN from "bn.js";
import { PublicKey } from "@solana/web3.js";

// anchor
import { setup } from "@/utils/anchor";

// State
export const state = () => ({
  troveId: "",
  trove: { troveAccountPubkey: "", amountToClose: 0, depositorFee: 0 },
  debt: 0,
  loading: false,
  loadingSub: false,
  borrowOrPay: true,
  closeAmount: 0,
  currentCr: 0,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
  setTroveId(state, newValue: any) {
    state.troveId = newValue;
  },

  setTrove(state, newValue: any) {
    state.trove = newValue;
  },

  setDebt(state, newValue: number) {
    state.debt = newValue;
  },

  setLoading(state, newValue: boolean) {
    state.loading = newValue;
  },

  setLoadingSub(state, newValue: boolean) {
    state.loadingSub = newValue;
  },

  setBorrowOrPay(state, newValue: boolean) {
    state.borrowOrPay = newValue;
  },
  setCloseAmount(state, newValue: number) {
    state.closeAmount = newValue;
  },

  setCurrentCr(state, newValue: number) {
    state.currentCr = newValue;
  },
});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    async setTroveById({ commit }, value) {
      console.log("starting here ...");
      // setting anchor program
      let program = await setup(this.$web3, this.$wallet);
      console.log("check the value:", value);
      let result;
      try {
        result = await program.account.trove.fetch(new PublicKey(value));
        console.log(result, "result");
      } catch (err) {
        console.error(err);
      }
      commit("setTroveId", value);

      commit("setTrove", {
        troveAccountPubkey: value,
        isInitialized: result.isInitialized,
        isLiquidated: result.isLiquidated,
        isReceived: result.isReceived,
        borrowAmount: result.borrowAmount.toNumber(),
        lamports: result.lamportsAmount.toString(),
        teamFee: result.teamFee.toString(),
        depositorFee: result.depositorFee.toString(),
        amountToClose: result.amountToClose.toString(),
        owner: result.authority.toBase58(),
      });
    },
    // Get Deposit
    async getTrove({ commit, dispatch }, value) {
      if (this.$wallet) {
        await this.$axios
          .get("/trove?user=" + this.$wallet.publicKey.toBase58())
          .then(({ data }) => {
            if (data.model && data.model.trove) {
              commit("setTroveId", data.model.trove || "");
              dispatch("setTroveById", data.model.trove);
              this.$accessor.dashboard.setBorrow(true);
            }
          });
      }
    },
    // Claim
    async confirmBorrow({ state, commit, dispatch }, value) {
      // calculate team fee and depositor fee
      let team_fee = (0.47 * value.to) / 100;
      team_fee = team_fee < 1 ? 1 : team_fee;

      let borrower_fee = (1 * value.to) / 100;
      borrower_fee = borrower_fee < 4 ? 4 : borrower_fee;

      let total_fee = team_fee + borrower_fee;
      let mintAmount = value.to - total_fee;

      let totalColl = 0;
      if (this.$accessor.borrowing.trove.amountToClose > 0) {
        totalColl = getCollateral(
          (
            Number(this.$accessor.borrowing.trove.amountToClose) +
            parseInt(value.to)
          ).toString(),
          (
            Number(this.$accessor.borrowing.trove.lamports) +
            parseInt(value.from) * 1000000000
          ).toString(),
          parseInt(this.$accessor.usd).toString()
        );
      } else {
        totalColl = this.$accessor.borrowing.debt || 0;
      }

      // setting anchor program
      let program = await setup(this.$web3, this.$wallet);

      // check if there already previous trove opened under this wallet pub key
      // if (state.troveId && Number(value.from > 0) && totalColl > 109) {
      if (state.troveId && totalColl > 114) {
        try {
          commit("setLoading", true);
          const data = await addBorrowUtil(
            this.$wallet,
            state.troveId,
            Number(value.to),
            Number(value.from) * 1000000000,
            this.$web3,
            program
          );

          console.log(
            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
            "transaction id "
          );
          console.log(
            `${data.txId.substring(0, 14)}...${data.txId.substring(
              data.txId.length - 14
            )}`
          );
          // pass wait transaction notification
          this.$accessor.notification.notify({
            title: "Transaction sent",
            description: "Waiting for confirmation",
            type: "confirm",
            txId: data.txId,
          });

          console.log(
            "this list of notification is ",
            this.$accessor.notification.notifications.map((val) => val)
          );

          // handling the transaciton in the borrow
          await this.$web3.confirmTransaction(data.txId).then(
            (res) => {
              console.log(res, `res`);
            },
            (err) => {
              console.error(err.message, "Err");
            }
          );

          // pass wait transaction notification
          await this.$axios
            .post("/trove/addBorrow", {
              trove: data.troveAccountPubkey,
              amount: Number(value.to),
              user: value.mint,
              dest: this.$wallet.publicKey.toBase58(),
            })
            .then((res) => {
              console.log(res, "addTrove Backend");
            });

          // TODO: Create a refDB on chain
          // TODO: possible map accounts with the discriminator Trove
          // let result;
          // try {
          //     result = (await program.account.trove.fetch(new PublicKey(data.troveAccountPubkey)));
          //     console.log(result, "result");
          // } catch (err) {
          //     console.error(err)
          // }

          dispatch("setTroveById", data.troveAccountPubkey);
          this.$accessor.dashboard.setBorrow(true);

          this.$accessor.wallet.getBalance();
          this.$accessor.wallet.getGENSBalance();

          commit("setLoading", false);

          // pass confirm transaction notification
          this.$accessor.notification.notify({
            title: "Transaction completed",
            description: "",
            type: "",
            txId: data.txId,
          });
          await this.$axios
            .post("/reward/addReward", {
              amount: value.to,
            })
            .then((res) => {
              console.log(res, "reward Added to the liquidity provider");
            });
        } catch {
          commit("setLoading", false);
        }
        return;
      }

      // check if the collateral ratio is not higher than the 109
      const cr = getCollateral(
        value.to.toString(),
        (Number(value.from) * 1000000000).toString(),
        parseInt(this.$accessor.usd).toString()
      );

      if (
        !state.troveId &&
        Number(value.from > 0) &&
        Number(value.to) > 99 &&
        cr > 114
      ) {
        commit("setLoading", true);
        try {
          console.log("Initializing Borrow");
          const data = await borrowUtil(
            this.$wallet,
            mintAmount,
            Number(value.to),
            Number(value.from) * 1000000000,
            this.$web3,
            program
          );

          console.log(
            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
            "transaction id "
          );
          console.log(
            `${data.txId.substring(0, 14)}...${data.txId.substring(
              data.txId.length - 14
            )}`
          );
          // pass wait transaction notification
          this.$accessor.notification.notify({
            title: "Transaction sent",
            description: "Waiting for confirmation",
            type: "success",
            txId: data.txId,
          });

          console.log(
            "this list of notification is ",
            this.$accessor.notification.notifications.map((val) => val)
          );

          // handling the transaciton in the borrow
          await this.$web3.confirmTransaction(data.txId).then(
            (res) => {
              console.log(res, `res`);
            },
            (err) => {
              console.error(err.message, "Err");
            }
          );

          // update wallet
          this.$accessor.wallet.getBalance();
          this.$accessor.wallet.getGENSBalance();

          // TODO: Create a refDB on chain
          // TODO: possible map accounts with the discriminator Trove
          let result;
          try {
            result = await program.account.trove.fetch(data.troveAccountPubkey);
            console.log(result, "result is this");
          } catch (err) {
            console.error(err);
          }

          dispatch("setTroveById", data.troveAccountPubkey.toBase58());
          this.$accessor.dashboard.setBorrow(true);

          // pass confirm transaction notification
          this.$accessor.notification.notify({
            title: "Transaction completed",
            description: "Successful",
            type: "confirm",
            txId: data.txId,
          });

          commit("setLoading", false);
          let backend_data = {
            troveAccountPubkey: data.troveAccountPubkey.toBase58(),
            isInitialized: result.isInitialized,
            isLiquidated: result.isLiquidated,
            isReceived: result.isReceived,
            borrowAmount: result.borrowAmount.toNumber(),
            lamports: result.lamportsAmount.toString(),
            teamFee: result.teamFee.toString(),
            depositorFee: result.depositorFee.toString(),
            amountToClose: result.amountToClose.toString(),
            owner: result.authority.toBase58(),
          };

          if (data && data.troveAccountPubkey) {
            await this.$axios
              .post("/trove/upsert", {
                trove: data.troveAccountPubkey.toBase58(),
                amount: Number(value.to),
                user: value.mint,
                dest: this.$wallet.publicKey.toBase58(),
                data: backend_data,
              })
              .then((res) => {
                console.log(res, "newTrove Backend");
              });
          }

          await this.$axios
            .post("/reward/addReward", {
              amount: value.to,
            })
            .then((res) => {
              console.log(res, "reward Added to the liquidity provider");
            });
        } catch {
          commit("setLoading", false);
        }
        this.$accessor.dashboard.setBorrow(true);
      }
    },

    // Deposit
    async closeTrove({ state, commit, dispatch }, value) {
      // setting anchor program
      let program = await setup(this.$web3, this.$wallet);

      let GENS = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        { mint: TOKEN_GENS }
      );
      let burn_addr = GENS.value[0].pubkey.toBase58();

      console.log(state.troveId, "trove id");
      if (state.troveId) {
        commit("setLoading", true);
        try {
          console.log("processing closing the trove...");
          console.log(state.trove.amountToClose);
          let result;
          try {
            result = await program.account.trove.fetch(
              new PublicKey(state.troveId)
            );
            console.log(result, "result");
          } catch (err) {
            console.error(err);
          }

          let backend_data = {
            troveAccountPubkey: state.troveId,
            isInitialized: result.isInitialized,
            isLiquidated: result.isLiquidated,
            isReceived: result.isReceived,
            borrowAmount: result.borrowAmount.toNumber(),
            lamports: result.lamportsAmount.toString(),
            teamFee: result.teamFee.toString(),
            depositorFee: result.depositorFee.toString(),
            amountToClose: result.amountToClose.toString(),
            owner: result.authority.toBase58(),
          };

          await this.$axios
            .post("/trove/pay", {
              trove: state.trove.troveAccountPubkey,
              amount: state.trove.amountToClose,
            })
            .then((res) => {
              console.log(res, "payTroveBackend");
            });

          const data = await closeBorrowUtil(
            this.$wallet,
            state.trove.troveAccountPubkey,
            TOKEN_GENS.toBase58(),
            burn_addr,
            this.$web3,
            program
          );

          console.log(
            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
            "transaction id "
          );
          console.log(
            `${data.txId.substring(0, 14)}...${data.txId.substring(
              data.txId.length - 14
            )}`
          );
          // pass wait transaction notification
          this.$accessor.notification.notify({
            title: "Transaction sent",
            description: "Waiting for confirmation",
            type: "success",
            txId: data.txId,
          });

          console.log(
            "this list of notification is ",
            this.$accessor.notification.notifications.map((val) => val)
          );

          // handling the transaciton in the borrow
          await this.$web3.confirmTransaction(data.txId).then(
            (res) => {
              console.log(res, `res`);
            },
            (err) => {
              console.error(err.message, "Err");
            }
          );

          commit("setTroveId", "");
          await this.$axios
            .post("/trove/close", {
              trove: state.trove.troveAccountPubkey,
              data: backend_data,
            })
            .then((res) => {
              console.log(res, "trove Backend closed");
            });

          dispatch("clearTrove");
          this.$accessor.wallet.getBalance();
          this.$accessor.wallet.getGENSBalance();
          this.$accessor.dashboard.setBorrow(false);

          commit("setLoading", false);
        } catch (e) {
          console.log({ e });
          commit("setLoading", false);
        }
      }
    },

    //updating the trove amount
    async payTrove({ state, commit, dispatch }, value) {
      // setting anchor program
      let program = await setup(this.$web3, this.$wallet);

      let GENS = await this.$web3.getParsedTokenAccountsByOwner(
        this.$wallet.publicKey,
        { mint: TOKEN_GENS }
      );
      let burn_addr = GENS.value[0].pubkey.toBase58();
      const exceedAmount =
        state.trove.amountToClose >= Number(value.amount) ? false : true;

      console.log(value.amount, exceedAmount, "testing for borrow");
      if (state.troveId && !exceedAmount) {
        commit("setLoading", true);
        try {
          console.log("processing updating the trove...");

          const data = await payBorrowUtil(
            this.$wallet,
            TOKEN_GENS.toBase58(),
            state.trove.troveAccountPubkey,
            burn_addr,
            value.amount,
            value.lamports,
            this.$web3,
            program
          );

          console.log(
            `https://explorer.solana.com/tx/${data.txId}?cluster=${CLUSTER}`,
            "transaction id "
          );
          console.log(
            `${data.txId.substring(0, 14)}...${data.txId.substring(
              data.txId.length - 14
            )}`
          );
          // pass wait transaction notification
          this.$accessor.notification.notify({
            title: "Transaction sent",
            description: "Waiting for confirmation",
            type: "success",
            txId: data.txId,
          });

          console.log(
            "this list of notification is ",
            this.$accessor.notification.notifications.map((val) => val)
          );

          // handling the transaciton in the borrow
          await this.$web3.confirmTransaction(data.txId).then(
            (res) => {
              console.log(res, `res`);
            },
            (err) => {
              console.error(err.message, "Err");
            }
          );

          await this.$axios
            .post("/trove/pay", {
              trove: data.troveAccountPubkey,
              amount: value.amount,
            })
            .then((res) => {
              console.log(res, "payTroveBackend");
            });

          this.$accessor.wallet.getBalance();
          this.$accessor.wallet.getGENSBalance();

          let result;
          try {
            result = await program.account.trove.fetch(data.troveAccountPubkey);
            console.log(result, "result");
          } catch (err) {
            console.error(err);
          }

          dispatch("setTroveById", data.troveAccountPubkey);
          this.$accessor.dashboard.setBorrow(true);
          commit("setLoading", false);
        } catch (e) {
          console.log({ e });
          commit("setLoading", false);
        }
      }
    },

    // Get Debt Ratio
    getDebt({ commit }, value) {
      if (value && value.from > 0 && value.to > 0) {
        commit(
          "setDebt",
          getCollateral(
            value.to.toString(),
            (Number(value.from) * 1000000000).toString(),
            parseInt(this.$accessor.usd).toString()
          )
        );
      } else {
        commit("setDebt", 0);
      }
    },

    // Send Email
    async sendEmail({ commit }, value) {
      if (value) {
        commit("setLoadingSub", true);
        await this.$axios
          .post("/notification/subscribe", { email: value })
          .then((res) => {
            console.log(res, "Subscribe");
          })
          .finally(() => {
            commit("setLoadingSub", false);
          });
      }
    },

    // Change the deposit and withdraw tab
    async changeBorrowOrPay({ commit }, value) {
      let newValue = !value;
      commit("setBorrowOrPay", newValue);
    },

    // get closing borrow amount
    async closeBorrowAmount({ commit }, value) {
      if (value) {
        console.log("making changes in the repayto");
        commit(
          "setCloseAmount",
          this.$accessor.borrowing.trove.amountToClose - value.repayTo
        );
      }
    },
    //get the changed cr
    async currentCollateralRatio({ commit }, value) {
      if (value) {
        commit("setCurrentCr", value);
      }
    },

    // clear trove state when user logs out of the wallet
    async clearTrove({ commit }) {
      commit("setTroveId", "");
      commit("setTrove", {
        troveAccountPubkey: "",
        amountToClose: 0,
        depositorFee: 0,
      });
      commit("setCloseAmount", 0);
    },
  }
);
