import {
  Account,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Connection,
  TransactionInstruction,
  Keypair,
} from "@solana/web3.js";
import BN from "bn.js";
import * as bs58 from "bs58";
import {
  EscrowProgramIdString,
  PYTH_SOL_USD_PUBKEY,
  TOKEN_GENS,
  TOKEN_A_MINT_ADDR,
  TOKEN_HGEN,
} from "./layout";

const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import Wallet from "@project-serum/sol-wallet-adapter";
import { consoleSandbox } from "@sentry/utils";

export const borrowUtil = async (
  wallet: Wallet,
  mintAmount: number,
  borrowAmount: number,
  lamportAmount: number,
  connection: Connection,
  escrowProgram: any
) => {
  console.log("Borrow in process");
  const escrowProgramId = new PublicKey(EscrowProgramIdString);

  // setup pda for minting
  const [pda_mint, bump_mint] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("mint-authority")],
    escrowProgramId
  );
  console.log(`bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);

  // finding a program address for the trove pda
  let [troveAccountPDA, bump_trove] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("borrowertrove"),
      anchor.getProvider().wallet.publicKey.toBuffer(),
    ],
    escrowProgramId
  );

  // finding a program address for the trove pda
  let [solTroveAccountPDA, bump_sol_trove] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("solTrove"),
      anchor.getProvider().wallet.publicKey.toBuffer(),
    ],
    escrowProgramId
  );

  // finding a program address for the fee pda
  let [feeAccountPDA, bump_fee] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("fee")],
    escrowProgramId
  );

  // finding a program address for the fee pda
  let [teamFeeAccountPDA, bump_team_fee] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("teamfee")],
    escrowProgramId
  );

  const troveAccount = troveAccountPDA;
  let mintPubkey = TOKEN_GENS;

  // get the token account info of the wallet
  let GENS = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
    mint: TOKEN_GENS,
  });
  let tokenATA = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

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
      mintPubkey, // mint
      wallet.publicKey // owner
    );
  }
  console.log(`ATA: ${ata.toBase58()}`);

  let borrowIx;
  try {
    borrowIx = escrowProgram.instruction.borrow(
      new anchor.BN(borrowAmount),
      new anchor.BN(lamportAmount),
      new anchor.BN(bump_trove),
      new anchor.BN(bump_sol_trove),
      new anchor.BN(bump_mint),
      new anchor.BN(bump_fee),
      new anchor.BN(bump_team_fee),
      {
        accounts: {
          authority: wallet.publicKey,
          troveAccount,
          solTrove: solTroveAccountPDA,
          feeAccount: feeAccountPDA,
          teamFeeAccount: teamFeeAccountPDA,
          tokenAuthority: pda_mint,
          stableCoin: mintPubkey,
          userToken: ata,
          pythSolAccount: PYTH_SOL_USD_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }
    );
  } catch (e) {
    console.error(e, "Anchor borrow error");
  }

  // добавялем инструкции в транзакцию (add instruction to the transaction)
  let tx = new Transaction();
  if (tokenATA == "") {
    const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      mintPubkey, // mint
      ata, // ata
      wallet.publicKey, // owner of token account
      wallet.publicKey // fee payer
    );

    tx = tx.add(ataAccountTx, borrowIx);
  } else {
    tx = tx.add(borrowIx);
  }

  console.log(tx, "tx");

  // //change mint authrority
  // let changeTx = Token.createSetAuthorityInstruction(
  //     TOKEN_PROGRAM_ID,
  //     TOKEN_A_MINT_ADDR,
  //     pda_mint,
  //     "MintTokens",
  //     new PublicKey("424v2hHJtDA879UfMikVWr7VTvJsFqE9XaZkkbe6Uv2J"),
  //     []
  // )
  // tx.add(changeTx);

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

  return {
    txId,
    troveAccountPubkey: troveAccount,
  };
};
