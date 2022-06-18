import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
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
    TroveLayout,
    TROVE_ACCOUNT_DATA_LAYOUT,
    EscrowProgramIdString,
    CHAINLINK_SOL_USD_PUBKEY,
    SYS_ACCOUNT,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const payBorrowUtil = async (
    wallet: Wallet,
    //gens token address
    tokenMintAccountPubkey: string,
    troveId: string,
    //wallet address of the user gens token
    pdaToken: string,
    amount: number,
    lamports: number,
    connection: Connection,
    escrowProgram: any,
) => {
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const troveAccount = new PublicKey(troveId);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);

    // finding a program address for the trove pda
    let [troveAccountPDA, bump_trove] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("borrowertrove"), anchor.getProvider().wallet.publicKey.toBuffer()],
        escrowProgramId
    );

    // finding a program address for the trove pda
    let [solTroveAccountPDA, bump_sol_trove] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("solTrove"), anchor.getProvider().wallet.publicKey.toBuffer()],
        escrowProgramId
    );

    let payBorrowIx;
    let transferSolIx;
    try {
        payBorrowIx = escrowProgram.instruction.updateTrove(new anchor.BN(amount),
            {
                accounts: {
                    authority: wallet.publicKey,
                    trove: troveAccount,
                    solTrove: solTroveAccountPDA,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    userToken: pdaTokenAcc,
                    tokenMint: tokenMintAcc,
                },
            },
        );

        transferSolIx = escrowProgram.instruction.withdrawCoin(new anchor.BN(lamports), new anchor.BN(bump_trove),
            {
                accounts: {
                    authority: wallet.publicKey,
                    trove: troveAccount,
                    solTrove: solTroveAccountPDA,
                    systemProgram: SystemProgram.programId
                },
            },
        );
    } catch (err) {
        console.error(err, "Anchor error")
    }

    const tx = new Transaction().add(payBorrowIx, transferSolIx);

    // добавляем данне для возможност формирования подписи
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());


    return {
        troveAccountPubkey: troveAccount.toBase58(),
        txId
    };
};
