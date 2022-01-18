import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import {
  TroveLayout,
  TROVE_ACCOUNT_DATA_LAYOUT,
  EscrowProgramIdString,
  CHAINLINK_SOL_USD_PUBKEY,
  SYS_ACCOUNT,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

export const payBorrowUtil = async (
  wallet: Wallet,
  //gens token address
  tokenMintAccountPubkey: string,
  troveId: string,
  //wallet address of the user gens token
  pdaToken: string,
  amount: number,
  connection: Connection
) => {
  const escrowProgramId = new PublicKey(EscrowProgramIdString);
  const troveAccount = new PublicKey(troveId);
  const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
  const pdaTokenAcc = new PublicKey(pdaToken);

  const payBorrowIx = new TransactionInstruction({
    programId: escrowProgramId,
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: troveAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: pdaTokenAcc, isSigner: false, isWritable: true },
      { pubkey: tokenMintAcc, isSigner: false, isWritable: true },
      { pubkey: CHAINLINK_SOL_USD_PUBKEY, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(
      Uint8Array.of(
        11, // id of instruction
        ...new BN(amount).toArray("le", 8)
      )
    ),
  });

  const tx = new Transaction().add(payBorrowIx);

  // добавляем данне для возможност формирования подписи
  let { blockhash } = await connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  // to sign
  let signedTx = await wallet.signTransaction(tx);
  let txId = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction(txId);

  const encodedTroveState = await connection.getAccountInfo(
    troveAccount,
    "singleGossip"
  );
  if (encodedTroveState === null) {
    return null;
  }
  const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(
    encodedTroveState!.data
  ) as TroveLayout;

  return {
    troveAccountPubkey: troveAccount.toBase58(),
    isInitialized: !!decodedTroveState.isInitialized,
    isLiquidated: !!decodedTroveState.isLiquidated,
    isReceived: !!decodedTroveState.isReceived,
    borrowAmount: new BN(decodedTroveState.borrowAmount, 10, "le").toNumber(),
    lamports: new BN(decodedTroveState.lamports, 10, "le").toString(),
    teamFee: new BN(decodedTroveState.teamFee, 10, "le").toString(),
    depositorFee: new BN(decodedTroveState.depositorFee, 10, "le").toString(),
    amountToClose: new BN(decodedTroveState.amountToClose, 10, "le").toString(),
    owner: new PublicKey(decodedTroveState.owner).toBase58(),
  };
};
