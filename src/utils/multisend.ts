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
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BN from "bn.js";
import Wallet from "@project-serum/sol-wallet-adapter";
import { publicKey } from "./tokenSwap/layout";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

// anchor
const anchor = require("@project-serum/anchor");
// const { SystemProgram } = anchor.web3;
import { sendAndConfirmTransaction } from "@/utils/tokenSwap/util/send-and-confirm-transaction";

export const multiSendUtil = async (
  wallet: Wallet,
  connection: Connection,
  userTokenAcc: PublicKey,
  mintAddress: string,
  details: any,
  pay: string,
  label: string
) => {
  let instructions: TransactionInstruction[] = [];

  if (label == "SOL") {
    details.forEach((val) => {
      let res = val.split(",");
      const [dest, amount] = res;

      let transferTx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(dest),
        lamports: LAMPORTS_PER_SOL * amount,
      });
      instructions.push(transferTx);
    });
  } else {
    // if (pay && label != "SOL") {
    details.forEach((val) => {
      console.log(val);
      const [dest, amount] = val;

      let transferTx = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        userTokenAcc,
        new PublicKey(dest),
        wallet.publicKey,
        [],
        amount * 1e2
      );

      console.log(transferTx, "Testing....");
      instructions.push(transferTx);
    });
  }

  let tx = new Transaction();

  if (instructions.length > 0) tx.add(...instructions);
  // add data for signature generation
  // добавляем данне для возможност формирования подписи
  let { blockhash } = await connection.getRecentBlockhash();
  // TODO: update the recent blockhash in certain interval so transaction doesnt use the expired one
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  // to sign
  let signedTx;
  try {
    signedTx = await wallet.signTransaction(tx);
  } catch (e) {
    console.error(e);
  }

  // to write without signer
  // TODO: use pda to sign in transaction for trove details instead of troveAccount. Enable write for trove details with signer
  // signedTx.partialSign(troveAccount);
  let txId = await connection.sendRawTransaction(signedTx.serialize());
};
