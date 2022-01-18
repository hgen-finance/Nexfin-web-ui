import { PublicKey, Transaction, Connection, Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";
import { TOKEN_GENS } from "./layout";
import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import Wallet from "@project-serum/sol-wallet-adapter";

export const createATA = async (wallet: Wallet, connection: Connection) => {
  let mintPubkey = new PublicKey(TOKEN_GENS);

  //TODO use env variable for secretkey
  const feePayer = Keypair.fromSecretKey(
    bs58.decode(
      "5G6hqugxKdq4nhH5MpKVVjbJZ2EiA1iDeW1JyPk6W2XaxJ4iDvwbhZrSBJdyZZFopBM4adMNxaW4CvFxEybfNAq6"
    )
  );
  // calculate ATA
  const ata = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
    TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
    mintPubkey, // mint
    wallet.publicKey // owner
  );

  console.log(`ATA: ${ata.toBase58()}`);

  let ataAccountTx = new Transaction().add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      mintPubkey, // mint
      ata, // ata
      wallet.publicKey, // owner of token account
      feePayer.publicKey // fee payer
    )
  );

  let txHash = await connection.sendTransaction(ataAccountTx, [feePayer]);
  console.log(`Transaction succeeded. TxHash: ${txHash}`);
};
