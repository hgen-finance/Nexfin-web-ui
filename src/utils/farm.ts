import {
  Account,
  PublicKey,
  SystemProgram,
  Connection,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  FarmingLayout,
  FARMING_ACCOUNT_DATA_LAYOUT,
  INSTRUCTION_LAYOUT,
  InstructionLayout,
  TOKEN_HGEN,
  LP_TOKENS_HS,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";
import * as web3 from "@solana/web3.js";

import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

// // anchor
// const anchor = require("@project-serum/anchor");
// const { SystemProgram } = anchor.web3;

//farming
const programId = new PublicKey("3PtvnRuzC68zrDQoRsoKVQoVvhbVF7fTxeYzLF6mN3EE");
const destination = new PublicKey(
  "FnKXCAbNzvAGKtTqSxH2NrWemR4CoJhCMrdk4ihBG2P6"
);
const privateKey =
  "224128Zpov8A1AVMGC3Ys46oZEerngk24PQCpbkyBdnSS3jBS1jtbQPMJzwY3bdqyYVegYHF9eK9Vqa4vp78epY4";
var farming_account: PublicKey;

let getEndDate = (startDate: Date, length: number) => {
  let res = new Date(startDate);
  res.setDate(Number(res.getDate()) + Number(length));
  return res;
};

export const farmUtil = async (
  wallet: Wallet,
  connection: Connection,
  depositedSol: number,
  depositedHgen: number,
  depositedLP: number,
  dayLength: number
) => {
  console.log("building");
  let lamports = await connection.getMinimumBalanceForRentExemption(97);
  farming_account = await PublicKey.createWithSeed(
    wallet.publicKey,
    "computer",
    programId
  );
  let farmAccountTx = new Transaction().add(
    SystemProgram.createAccountWithSeed({
      fromPubkey: wallet.publicKey,
      basePubkey: wallet.publicKey,
      seed: "computer",
      newAccountPubkey: farming_account,
      lamports: lamports,
      space: 97,
      programId: programId,
    })
  );

  farming_account = await PublicKey.createWithSeed(
    wallet.publicKey,
    "computer",
    programId
  );

  let accountInfo = await connection.getAccountInfo(farming_account);
  if (accountInfo == null) return false;
  let today = new Date();
  let startDate =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate() +
    "-" +
    today.getHours() +
    ":" +
    today.getMinutes();
  let endDateD = getEndDate(today, dayLength);
  let endDate =
    endDateD.getFullYear() +
    "-" +
    (endDateD.getMonth() + 1) +
    "-" +
    endDateD.getDate() +
    "  " +
    endDateD.getHours() +
    ":" +
    endDateD.getMinutes();
  let start = Buffer.alloc(32);
  start = Buffer.concat([Buffer.from(startDate)], 32);

  let end = Buffer.alloc(32);
  end = Buffer.concat([Buffer.from(endDate)], 32);

  let sol_amount = Buffer.alloc(8);
  sol_amount = Buffer.concat([Buffer.from(depositedSol.toString())], 8);

  let hgen_amount = Buffer.alloc(8);
  hgen_amount = Buffer.concat([Buffer.from(depositedHgen.toString())], 8);

  let day_total = Buffer.alloc(8);
  day_total = Buffer.concat([Buffer.from(dayLength.toString())], 8);

  let day_left = Buffer.alloc(8);
  day_left = Buffer.concat([Buffer.from(dayLength.toString())], 8);

  let data = Buffer.alloc(96);
  data = Buffer.concat(
    [start, end, sol_amount, hgen_amount, day_total, day_left],
    96
  );
  let _sendData = {
    instructionId: Buffer.from("1"),
    data: data,
  };
  let sendData = Buffer.alloc(97);
  INSTRUCTION_LAYOUT.encode(_sendData, sendData);
  let balance = await connection.getBalance(wallet.publicKey);
  let setFarmIx;
  let solTransaction;
  let tokenTransaction;

  // get the token account info of the wallet
  let LP_HS = await connection.getParsedTokenAccountsByOwner(destination, {
    mint: LP_TOKENS_HS,
  });
  let tokenATA = LP_HS.value[0] ? LP_HS.value[0].pubkey.toBase58() : "";

  // create a ATA account if the wallet user doesnt have one
  let ata;
  if (tokenATA != "") {
    ata = new PublicKey(tokenATA);
  }

  console.log(tokenATA, "|", ata);

  if (tokenATA == "") {
    // Only create tx if the account wasnt present
    // calculate ATA
    ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      LP_TOKENS_HS, // mint
      destination // owner
    );
  }

  // if (depositedSol * 1e9 > balance) {
  //     alert("Deposited SOL amount exceeds balance!");
  //     return false;
  // } else {
  setFarmIx = new TransactionInstruction({
    keys: [
      {
        pubkey: wallet.publicKey,
        isSigner: true,
        isWritable: false,
      },
      { pubkey: farming_account, isSigner: false, isWritable: true },
    ],
    programId: programId,
    data: sendData,
  });

  // solTransaction = web3.SystemProgram.transfer({
  //     fromPubkey: wallet.publicKey,
  //     toPubkey: destination,
  //     lamports: depositedSol * 1e9,
  // });

  tokenTransaction = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    wallet.publicKey,
    ata,
    wallet.publicKey,
    [],
    depositedLP * 1e2
  );
  // }

  farming_account = await PublicKey.createWithSeed(
    wallet.publicKey,
    "computer",
    programId
  );
  _sendData = {
    instructionId: Buffer.from("0"),
    data: Buffer.from(""),
  };
  sendData = Buffer.alloc(97);
  INSTRUCTION_LAYOUT.encode(_sendData, sendData);
  let initializeAccount = new TransactionInstruction({
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: farming_account, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    programId: programId,
    data: sendData,
  });

  let tx = new Transaction();
  if ((await connection.getBalance(farming_account)) == 0) {
    tx.add(farmAccountTx, initializeAccount);
  } else {
    if (tokenATA == "") {
      const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        LP_TOKENS_HS, // mint
        ata, // ata
        destination, // owner of token account
        wallet.publicKey // fee payer
      );
      tx.add(ataAccountTx, tokenTransaction, solTransaction, setFarmIx);
    } else {
      tx.add(tokenTransaction, solTransaction, setFarmIx);
    }
  }

  let { blockhash } = await connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  // to sign
  let signedTx = await wallet.signTransaction(tx);
  let txId = await connection.sendRawTransaction(signedTx.serialize());

  await connection.confirmTransaction(txId);
  alert("Please, refresh the page to see the updated transaction.");
};
