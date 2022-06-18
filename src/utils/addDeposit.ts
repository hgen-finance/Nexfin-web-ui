import { Token, TOKEN_PROGRAM_ID, AuthorityType } from "@solana/spl-token";
import {
    Account,
    Connection,
    PublicKey,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import {
    DEPOSIT_ACCOUNT_DATA_LAYOUT,
    DepositLayout,
    EscrowProgramIdString,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const addDepositUtil = async (
    wallet: Wallet,
    depositId: string,
    // Адрес токена GENS
    tokenMintAccountPubkey: string,
    tokenAmount: number,
    // Адрес кошелька токена пользователя GENS
    pdaToken: string,
    // Адрес кошелька токена пользователя HGEN
    governanceToken: string,
    connection: Connection,
    escrowProgram
) => {
    const depositAccount = new PublicKey(depositId);
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);
    const governanceTokenAcc = new PublicKey(governanceToken);


    // setup pda for deposit account
    const [_, deposit_account_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("deposit"), anchor.getProvider().wallet.publicKey.toBuffer()],
        escrowProgramId
    );

    let addDepositIx;
    try {
        addDepositIx = escrowProgram.instruction.addDeposit(new anchor.BN(tokenAmount), new anchor.BN(deposit_account_bump),
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
                }
            },
        );

    } catch (err) {
        console.error(err, "Anchor error");
    }


    const tx = new Transaction().add(addDepositIx);
    console.log("the transaction is ", tx);

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
