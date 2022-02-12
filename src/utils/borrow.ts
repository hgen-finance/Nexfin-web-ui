import {
  Account,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Connection,
  TransactionInstruction,
  Keypair,
} from "@solana/web3.js";
import BN from "bn.js";
import * as bs58 from "bs58";
import {
  TroveLayout,
  TROVE_ACCOUNT_DATA_LAYOUT,
  EscrowProgramIdString,
  CHAINLINK_SOL_USD_PUBKEY,
  TOKEN_GENS_ACC,
  SYS_ACCOUNT,
  TOKEN_GENS,
} from "./layout";
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import Wallet from "@project-serum/sol-wallet-adapter";

export const borrowUtil = async (
  wallet: Wallet,
  mintAmount: number,
  borrowAmount: number,
  lamportAmount: number,
  connection: Connection
) => {
  const escrowProgramId = new PublicKey(EscrowProgramIdString);

  // setup pda for minting
  // TODO: This should be moved to the smart contract
  const [pda_mint, bump_mint] = await PublicKey.findProgramAddress(
    [Buffer.from("test")],
    new PublicKey(EscrowProgramIdString)
  );
  console.log(`bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);

  // finding a program address for the trove pda
  let [troveAccountPDA, bump_trove] = await PublicKey.findProgramAddress(
    [wallet.publicKey.toBuffer()],
    escrowProgramId
  );
  console.log(`bump: ${bump_trove}, pubkey: ${troveAccountPDA.toBase58()}`);

  const troveAccount = new Account();
  const createBorrowAccountIx = SystemProgram.createAccount({
    space: TROVE_ACCOUNT_DATA_LAYOUT.span,
    lamports: lamportAmount,
    fromPubkey: wallet.publicKey,
    newAccountPubkey: troveAccount.publicKey,
    programId: escrowProgramId,
  });

  let mintPubkey = new PublicKey(TOKEN_GENS);

  // get the token account info of the wallet
  let GENS = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
    mint: new PublicKey(TOKEN_GENS),
  });
  let tokenATA = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

  // create a ATA account if the wallet user doesnt have one
  let ata;
  if (tokenATA != "") {
    ata = tokenATA;
  }

  console.log(tokenATA, "|", ata);

  // TODO: Add creating of trove account to different intruction and create another tx for it.
  const borrowIx = new TransactionInstruction({
    programId: escrowProgramId,
    keys: [
      { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
      { pubkey: troveAccount.publicKey, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: mintPubkey, isSigner: false, isWritable: true },
      { pubkey: ata, isSigner: false, isWritable: true },
      { pubkey: pda_mint, isSigner: false, isWritable: true },
    ],
    data: Buffer.from(
      Uint8Array.of(
        0,
        ...new BN(borrowAmount).toArray("le", 8),
        ...new BN(lamportAmount).toArray("le", 8),
        bump_mint
      )
    ),
  });

  // добавялем инструкции в транзакцию (add instruction to the transaction)
  let tx;
  if (tokenATA == "") {
    // Only create tx if the account wasnt present
    // calculate ATA
    ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      mintPubkey, // mint
      wallet.publicKey // owner
    );

    console.log(`ATA: ${ata.toBase58()}`);

    const ataAccountTx = new Transaction().add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        mintPubkey, // mint
        ata, // ata
        wallet.publicKey, // owner of token account
        wallet.publicKey // fee payer
      )
    );
    tx = new Transaction().add(ataAccountTx, createBorrowAccountIx, borrowIx);
  } else {
    tx = new Transaction().add(createBorrowAccountIx, borrowIx);
  }

  // add data for signature generation
  // добавляем данне для возможност формирования подписи
  let { blockhash } = await connection.getRecentBlockhash();
  // TODO: update the recent blockhash in certain interval so transaction doesnt use the expired one
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  // to sign
  let signedTx = await wallet.signTransaction(tx);

  // to write without signer
  // TODO: use pda to sign in transaction for trove details instead of troveAccount. Enable write for trove details with signer
  signedTx.partialSign(troveAccount);
  let txId = await connection.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: true,
  });

  return {
    txId,
    troveAccountPubkey: troveAccount.publicKey.toBase58(),
  };
};
