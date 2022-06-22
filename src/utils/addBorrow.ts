import {
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Connection,
} from "@solana/web3.js";

import {
  EscrowProgramIdString,
  TOKEN_GENS,
  PYTH_SOL_USD_PUBKEY,
} from "./layout";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const addBorrowUtil = async (
  wallet: Wallet,
  troveId: string,
  borrowAmount: number,
  lamportAmount: number,
  connection: Connection,
  escrowProgram: any
) => {
  console.log("Add borrow in process");

  // setup pda for minting
  // TODO set the seed to be wallet as well
  const [pda_mint, bump_mint] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("mint-authority")],
    new PublicKey(EscrowProgramIdString)
  );

  const escrowProgramId = new PublicKey(EscrowProgramIdString);

  // finding a program address for the trove pda
  // TODO pass the sol trove bump to the smartcontract for validation
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

  // finding a program address for the trove pda
  // TODO: pass the bump_trove to the smart contract for validation
  let [troveAccountPDA, bump_trove] = await PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("borrowertrove"),
      anchor.getProvider().wallet.publicKey.toBuffer(),
    ],
    escrowProgramId
  );
  console.log(`trove_bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);

  const troveAccount = troveAccountPDA;

  let mintPubkey = new PublicKey(TOKEN_GENS);

  const GENS = await connection.getParsedTokenAccountsByOwner(
    wallet.publicKey,
    { mint: new PublicKey(TOKEN_GENS) }
  );
  const tokenADA = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

  let addBorrowIx;
  try {
    addBorrowIx = escrowProgram.instruction.addBorrow(
      new anchor.BN(borrowAmount),
      new anchor.BN(lamportAmount),
      new anchor.BN(bump_mint),
      new anchor.BN(bump_fee),
      new anchor.BN(bump_team_fee),
      {
        accounts: {
          authority: wallet.publicKey,
          trove: troveAccount,
          solTrove: solTroveAccountPDA,
          feeAccount: feeAccountPDA,
          teamFeeAccount: teamFeeAccountPDA,
          tokenAuthority: pda_mint,
          stableCoin: mintPubkey,
          userToken: tokenADA,
          pythSolAccount: PYTH_SOL_USD_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }
    );
  } catch (err) {
    console.error(err, "anchor error");
  }

  // add instruction to the transaction
  const tx = new Transaction().add(addBorrowIx);

  // add data for signature generation
  let { blockhash } = await connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = wallet.publicKey;

  // to sign
  let signedTx = await wallet.signTransaction(tx);

  let txId = await connection.sendRawTransaction(signedTx.serialize());

  return {
    txId,
    troveAccountPubkey: troveAccount.toBase58(),
  };
};
