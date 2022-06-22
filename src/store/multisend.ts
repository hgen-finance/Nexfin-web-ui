// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";

// Import Utils
import { multiSendUtil } from "@/utils/multisend";
import {
  Token,
  TOKEN_PROGRAM_ID,
  AuthorityType,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout,
} from "@solana/spl-token";
import {
  Account,
  PublicKey,
  Connection,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import Wallet from "@project-serum/sol-wallet-adapter";

// State
export const state = () => ({});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {});

// Actions
export const actions = actionTree(
  { state, getters, mutations },
  {
    // sending to multi users
    async multiTransfer({ commit, dispatch, state }, value) {
      try {
        if (value.label == "SOL") {
          let result = value.details.split("\n");
          console.log(value.userTokenAcc, result, "teacher here 98*******");
          await multiSendUtil(
            this.$wallet,
            this.$web3,
            value.userTokenAcc,
            value.mintAddr,
            result,
            value.pay,
            value.label
          );
        }

        await multiSendUtil(
          this.$wallet,
          this.$web3,
          value.userTokenAcc,
          value.mintAddr,
          value.details,
          value.pay,
          value.label
        );
      } catch (err) {
        console.log(err);
      }
    },

    async getAccount({ commit, dispatch, state }, value) {
      try {
        let sourceAddr = await this.$web3.getParsedTokenAccountsByOwner(
          this.$wallet.publicKey,
          {
            mint: value.mintAddr,
          }
        );
        return sourceAddr;
      } catch (err) {
        console.log(err);
      }
    },

    // getting wallets token accounts
    async getTokenAccounts({ commit, dispatch, state }, value) {
      let result = [];
      try {
        let addresses = value.details.split("\n");
        console.log(addresses, "testing 2");
        addresses.forEach(async (val) => {
          console.log(val, "testin 4");
          val = val.split(",");
          const [dest, amount] = val;
          console.log(dest, amount, "testing 3");
          let destTokenkAddr = await this.$web3.getParsedTokenAccountsByOwner(
            new PublicKey(dest),
            {
              mint: value.mintAddr,
            }
          );

          console.log(
            destTokenkAddr.value[0].pubkey.toBase58(),
            amount,
            "Testing...."
          );
          result.push([destTokenkAddr.value[0].pubkey, amount.trim()]);
        });
        console.log(result, "my results");
        return result;
      } catch (err) {
        console.log(err);
      }
    },
  }
);
