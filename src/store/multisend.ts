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
        } else {
          await multiSendUtil(
            this.$wallet,
            this.$web3,
            value.userTokenAcc,
            value.mintAddr,
            value.details,
            value.pay,
            value.label,
            value.instructions
          );
        }
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
      let instructions: TransactionInstruction[] = [];
      try {
        let addresses = value.details.split("\n");
        addresses.forEach(async (val) => {
          val = val.split(",");
          const [dest, amount] = val;
          let destTokenkAddr = await this.$web3.getParsedTokenAccountsByOwner(
            new PublicKey(dest),
            {
              mint: value.mintAddr,
            }
          );

          let res;
          res = destTokenkAddr.value[0] ? destTokenkAddr.value[0].pubkey : "";
          let ata;
          // create a GENS account on the destination wallet
          if (res == "") {
            console.log("enter ***************", res);
            ata = await Token.getAssociatedTokenAddress(
              ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
              TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
              value.mintAddr, // mint
              new PublicKey(dest) // owner
            );
            const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
              TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
              value.mintAddr, // mint
              ata, // ata
              new PublicKey(dest), // owner of token account
              this.$wallet.publicKey // fee payer
            );
            instructions.push(ataAccountTx);
            res = ata;
          }

          // console.log(
          //     res.toBase58(),
          //     amount,
          //     "Testing...."
          // );
          result.push([res, amount.trim()]);
        });
        console.log(result, "my results");
        return { result, instructions };
      } catch (err) {
        console.log(err);
      }
    },
  }
);
