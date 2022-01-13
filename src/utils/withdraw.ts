import {Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  Keypair
} from '@solana/web3.js';
import BN from "bn.js";
import * as bs58 from "bs58";

import {DEPOSIT_ACCOUNT_DATA_LAYOUT, DepositLayout, EscrowProgramIdString} from './layout';
import Wallet from "@project-serum/sol-wallet-adapter";

export const withdrawUtil = async (
    wallet: Wallet,
    depositId: string,
    tokenMintAccountPubkey: string,
    tokenAmount: number, 
    pdaToken: string,  
    connection: Connection,
) => {

    const depositAccount = new PublicKey(depositId);
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey)
    const pdaTokenAcc = new PublicKey(pdaToken)
    // const governanceTokenAcc = new PublicKey(governanceToken);

    // mint authority
    const alice = Keypair.fromSecretKey(
        bs58.decode(process.env.mintAuthority)
      );
    

    const WithdrawIx = new TransactionInstruction({
        programId: escrowProgramId,
        keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
            { pubkey: depositAccount, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: pdaTokenAcc, isSigner: false, isWritable: true },
            { pubkey: tokenMintAcc, isSigner: false, isWritable: true },
        ],
        data: Buffer.from(
            Uint8Array.of(7,
            ...new BN(tokenAmount).toArray('le', 8),
        ))
    })
    console.log(tokenAmount,'tokenAmount')
    const mintTx = Token.createMintToInstruction(
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        tokenMintAcc, // mint
        pdaTokenAcc, // receiver (sholud be a token account)
        alice.publicKey, // mint authority
        [], // only multisig account will use. leave it empty now.
        tokenAmount*1e9 // amount. our decimals is 9, you mint 10^9 for 1 token.
      ) 


    const tx = new Transaction().add(WithdrawIx, mintTx);
    console.log("the transaction is ", tx)

    let {blockhash} = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId);

    // Info
    const encodedDepositAccount = (await connection.getAccountInfo(depositAccount, 'singleGossip'))!.data;
    const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(encodedDepositAccount) as DepositLayout;

    return {
        depositAccountPubkey: depositAccount.toBase58(),
        isInitialized: !!decodedDepositState.isInitialized,
        tokenAmount: new BN(decodedDepositState.tokenAmount, 10, 'le').toNumber(),
        rewardTokenAmount: new BN(decodedDepositState.rewardTokenAmount, 10, 'le').toNumber(),
        rewardGovernanceTokenAmount: new BN(decodedDepositState.rewardGovernanceTokenAmount, 10, 'le').toNumber(),
        rewardCoinAmount: new BN(decodedDepositState.rewardCoinAmount, 10, 'le').toNumber(),
        bank: new PublicKey(decodedDepositState.bank).toBase58(),
        governanceBank: new PublicKey(decodedDepositState.governanceBank).toBase58(),
        owner: new PublicKey(decodedDepositState.owner).toBase58(),
    }
}
