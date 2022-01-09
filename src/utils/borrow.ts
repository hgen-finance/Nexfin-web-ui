import {
  Account,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  Connection,
  TransactionInstruction
} from '@solana/web3.js';
import BN from "bn.js";
import {TroveLayout, TROVE_ACCOUNT_DATA_LAYOUT, EscrowProgramIdString, CHAINLINK_SOL_USD_PUBKEY, TOKEN_GENS_ACC, SYS_ACCOUNT} from './layout';
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import Wallet from "@project-serum/sol-wallet-adapter";

export const borrowUtil = async (
    wallet: Wallet,
    borrowAmount: number,
    lamportAmount: number,
    connection: Connection,
) => {

    const troveAccount = new Account();
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const createBorrowAccountIx = SystemProgram.createAccount({
        space: TROVE_ACCOUNT_DATA_LAYOUT.span,
        lamports: lamportAmount,
        fromPubkey: wallet.publicKey,
        newAccountPubkey: troveAccount.publicKey,
        programId: escrowProgramId
    })

    const borrowIx = new TransactionInstruction({
        programId: escrowProgramId,
        keys: [
            {pubkey: wallet.publicKey, isSigner: true, isWritable: false},
            {pubkey: troveAccount.publicKey, isSigner: false, isWritable: true},
            {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            {pubkey: CHAINLINK_SOL_USD_PUBKEY, isSigner: false, isWritable: false},
        ],
        data: Buffer.from(
            Uint8Array.of(
                0,
                ...new BN(borrowAmount).toArray("le", 8),
                ...new BN(lamportAmount).toArray('le', 8),
            )
        )
    })

    //TODO: add the mint transaction with the borrowed transaction
    // transaction for minting gens token
    // generate a new keypair for token account
    // const tokenAccount = Keypair.generate();
    // console.log(`token account: ${tokenAccount.publicKey.toBase58()}`);

    //  // create token account
    // let createTokenAccountIx = SystemProgram.createAccount({
    //     fromPubkey: feePayer.publicKey,
    //     newAccountPubkey: tokenAccount.publicKey,
    //     space: AccountLayout.span,
    //     lamports: await Token.getMinBalanceRentForExemptAccount(connection),
    //     programId: TOKEN_PROGRAM_ID,
    // })

    // // init mint account 
    // let initMintIx = Token.createInitAccountInstruction(
    //     TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
    //     mintPubkey, // mint
    //     tokenAccount.publicKey, // token account
    //     alice.publicKey // owner of token account
    // )


    // transaction completed
    // добавялем инструкции в транзакцию (add instruction to the transaction)
    const tx = new Transaction().add(createBorrowAccountIx, borrowIx);
    
    //TODO: add the mint transaction with the borrowed transaction
    //console.log(`txhash: ${await connection.sendTransaction(tx, [tx.feePayer, tokenAccount])}`);

    // add data for signature generation
    // добавляем данне для возможност формирования подписи
    let {blockhash} = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    // to write without signer
    signedTx.partialSign(troveAccount)
    let txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId);

    // Info
    const encodedTroveState = (await connection.getAccountInfo(troveAccount.publicKey, 'singleGossip'))!.data;
    const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(encodedTroveState) as TroveLayout;

    return {
      troveAccountPubkey: troveAccount.publicKey.toBase58(),
      isInitialized: !!decodedTroveState.isInitialized,
      isLiquidated: !!decodedTroveState.isLiquidated,
      isReceived: !!decodedTroveState.isReceived,
      borrowAmount: new BN(decodedTroveState.borrowAmount, 10, 'le').toNumber(),
      lamports: new BN(decodedTroveState.lamports, 10, 'le').toString(),
      teamFee: new BN(decodedTroveState.teamFee, 10, 'le').toString(),
      depositorFee: new BN(decodedTroveState.depositorFee, 10, 'le').toString(),
      amountToClose: new BN(decodedTroveState.amountToClose, 10, 'le').toString(),
      owner: new PublicKey(decodedTroveState.owner).toBase58(),
    }
}
