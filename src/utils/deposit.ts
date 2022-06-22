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
import {
  TroveLayout,
  TROVE_ACCOUNT_DATA_LAYOUT,
  DEPOSIT_ACCOUNT_DATA_LAYOUT,
  DepositLayout,
  EscrowProgramIdString,
  SYS_ACCOUNT,
  TOKEN_HGEN,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const depositUtil = async (
  wallet: Wallet,
  // Адрес токена GENS
  tokenMintAccountPubkey: string,
  amount: number,
  // Адрес кошелька токена пользователя GENS
  pdaToken: string,
  // Адрес кошелька токена пользователя HGEN
  governanceToken: string,
  connection: Connection,
  escrowProgram: any
) => {
  console.log(anchor, "anchor");
  const escrowProgramId = new PublicKey(EscrowProgramIdString);
  const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
  const pdaTokenAcc = new PublicKey(pdaToken);
  let governanceTokenAcc;
  if (governanceToken) governanceTokenAcc = new PublicKey(governanceToken);

  // setup pda for deposit account
  console.log(
    escrowProgram.programId.toBase58(),
    " | ",
    escrowProgramId.toBase58()
  );
  const [depositAccountPDA, depositAccountBump] =
    await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("deposit"), wallet.publicKey.toBuffer()],
      escrowProgramId
    );
  const depositAccount = depositAccountPDA;

  let ata;
  if (governanceToken == "") {
    ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      TOKEN_HGEN, // mint
      wallet.publicKey // owner
    );

    governanceTokenAcc = ata;
  }

  console.log("amoutn:", amount);
  console.log("bump", depositAccountBump);
  console.log("pda token acc", pdaTokenAcc.toBase58());
  console.log("goven token acc", governanceTokenAcc.toBase58());
  console.log("tokenmint", tokenMintAcc.toBase58());
  let depositIx;
  try {
    depositIx = escrowProgram.instruction.addDeposit(
      new anchor.BN(amount),
      new anchor.BN(depositAccountBump),
      {
        accounts: {
          authority: wallet.publicKey,
          depositAccount: depositAccount,
          rent: SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          userToken: pdaTokenAcc,
          userGovToken: governanceTokenAcc,
          tokenMint: tokenMintAcc,
          systemProgram: SystemProgram.programId,
        },
      }
    );
  } catch (err) {
    console.error(err);
  }

  let tx = new Transaction();
  if (governanceToken == "") {
    const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      TOKEN_HGEN, // mint
      governanceTokenAcc, // ata
      wallet.publicKey, // owner of token account
      wallet.publicKey // fee payer
    );
    console.log("THis tx is called");
    tx = tx.add(ataAccountTx, depositIx);
  } else {
    tx = tx.add(depositIx);
  }

  // добавляем данне для возможност формирования подписи
  let { blockhash } = await connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  // to sign
  let signedTx = await wallet.signTransaction(tx);
  let txId = await connection.sendRawTransaction(signedTx.serialize());

  return {
    txId,
    depositAccountPubkey: depositAccount.toBase58(),
  };
};
