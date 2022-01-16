import {Token, TOKEN_PROGRAM_ID, AuthorityType } from "@solana/spl-token";
import {
  Account,
  PublicKey,
  SystemProgram,
  Connection,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';
import BN from "bn.js";
import {TroveLayout, TROVE_ACCOUNT_DATA_LAYOUT, DEPOSIT_ACCOUNT_DATA_LAYOUT, DepositLayout, EscrowProgramIdString, SYS_ACCOUNT} from './layout';
import Wallet from "@project-serum/sol-wallet-adapter";
import { setAuthority } from "@project-serum/serum/lib/token-instructions";

export const depositUtil = async (
    wallet: Wallet,
    // Адрес токена GENS
    tokenMintAccountPubkey: string,
    tokenAmount: number,
    // Адрес кошелька токена пользователя GENS
    pdaToken: string,
    // Адрес кошелька токена пользователя HGEN
    governanceToken: string,
    connection: Connection,
) => {

    const depositAccount = new Account();
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);
    const governanceTokenAcc = new PublicKey(governanceToken);

    // setup pda for minting
    const [pda_mint, bump_mint] = await PublicKey.findProgramAddress([Buffer.from("test")], new PublicKey(EscrowProgramIdString));
    console.log(`bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);

    const createDepositAccountIx = SystemProgram.createAccount({
        space: DEPOSIT_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(DEPOSIT_ACCOUNT_DATA_LAYOUT.span),
        fromPubkey: wallet.publicKey,
        newAccountPubkey: depositAccount.publicKey,
        programId: escrowProgramId
    });

    const depositIx = new TransactionInstruction({
        programId: escrowProgramId,
        keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
            { pubkey: depositAccount.publicKey, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: pdaTokenAcc, isSigner: false, isWritable: true },
            { pubkey: governanceTokenAcc, isSigner: false, isWritable: true },
            { pubkey: tokenMintAcc, isSigner: false, isWritable: true },
        ],
        data: Buffer.from(
            Uint8Array.of(6,
            ...new BN(tokenAmount).toArray('le', 8),
        ))
    })

     let mint_type: AuthorityType = "MintTokens"
     let pda_account_mint = pda_mint

    // const changeMintIx = Token.createSetAuthorityInstruction(
    //     TOKEN_PROGRAM_ID,
    //     tokenMintAcc,
    //     new PublicKey(pda_account_mint),
    //     mint_type,
    //     wallet.publicKey,
    //     []
    // )

    const tx = new Transaction().add(createDepositAccountIx, depositIx);

    // добавляем данне для возможност формирования подписи
    let {blockhash} = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    //TODO add pda to sign for writing balance info in deposit Account
    // to write without signer
    signedTx.partialSign(depositAccount)
    let txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId);

    // Info
    const encodedDepositAccount = (await connection.getAccountInfo(depositAccount.publicKey, 'singleGossip'))!.data;
    const decodedDepositState = DEPOSIT_ACCOUNT_DATA_LAYOUT.decode(encodedDepositAccount) as DepositLayout;

    return {
        depositAccountPubkey: depositAccount.publicKey.toBase58(),
        isInitialized: !!decodedDepositState.isInitialized,
        tokenAmount: new BN(decodedDepositState.tokenAmount, 10, 'le').toNumber(),
        rewardTokenAmount: new BN(decodedDepositState.rewardTokenAmount, 10, 'le').toNumber(),
        rewardGovernanceTokenAmount: new BN(decodedDepositState.rewardGovernanceTokenAmount, 10, 'le').toNumber(),
        rewardCoinAmount: new BN(decodedDepositState.rewardCoinAmount, 10, 'le').toNumber(),
        owner: new PublicKey(decodedDepositState.owner).toBase58(),
    };
}
