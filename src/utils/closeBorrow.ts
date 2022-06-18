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

// TODO: add the program type for anchor instead of any
export const closeBorrowUtil = async (
    wallet: Wallet,
    troveId: string,
    //gens token address
    tokenMintAccountPubkey: string,
    //wallet address of the user gens token
    pdaToken: string,
    connection: Connection,
    escrowProgram: any,
) => {
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const troveAccount = new PublicKey(troveId);
    const tokenMintAcc = new PublicKey(tokenMintAccountPubkey);
    const pdaTokenAcc = new PublicKey(pdaToken);

    // finding a program address for the trove pda
    let [solTroveAccountPDA, bump_sol_trove] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("solTrove"), anchor.getProvider().wallet.publicKey.toBuffer()],
        escrowProgramId
    );


    let closeBorrowIx;
    try {
        closeBorrowIx = escrowProgram.instruction.closeTrove(new anchor.BN(bump_sol_trove),
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

    } catch (err) {
        console.error(err)
    }

    const tx = new Transaction().add(closeBorrowIx);

    // добавляем данне для возможност формирования подписи
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());

    return {
        txId
    };
};
