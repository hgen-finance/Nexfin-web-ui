import {
    Account,
    PublicKey,
    SystemProgram,
    Connection,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import {
    FarmingLayout,
    FARMING_ACCOUNT_DATA_LAYOUT,
    INSTRUCTION_LAYOUT,
    InstructionLayout,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";
import axios from "axios";
import * as web3 from "@solana/web3.js";
import web3Plugin from "@/plugins/web3";
import * as bs58 from "bs58";

// // anchor
// const anchor = require("@project-serum/anchor");
// const { SystemProgram } = anchor.web3;

//farming
const programId = new PublicKey("3PtvnRuzC68zrDQoRsoKVQoVvhbVF7fTxeYzLF6mN3EE");
const destination = new PublicKey(
    "FnKXCAbNzvAGKtTqSxH2NrWemR4CoJhCMrdk4ihBG2P6"
);
const privateKey =
    "224128Zpov8A1AVMGC3Ys46oZEerngk24PQCpbkyBdnSS3jBS1jtbQPMJzwY3bdqyYVegYHF9eK9Vqa4vp78epY4";
var farming_account: PublicKey;

let getEndDate = (sDate: Date, length: number) => {
    let res = new Date(sDate);
    res.setDate(Number(res.getDate()) + Number(length));
    return res;
}

export const farmUtil = async (
    startDate: any,
    endDate: any,
    depositedSol: number,
    depositedHgen: number,
    dayLength: number,
    dayLeft: number,
    wallet: Wallet,
    connection: Connection,
) => {

    let tokenTransaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
            fromPubkey: destination,
            toPubkey: wallet.publicKey,
            lamports: depositedSol * 1e9,
        })
    );
    let keypair = web3.Keypair.fromSecretKey(bs58.decode(privateKey));

    let dt = 0;
    let start = Buffer.alloc(32);
    start = Buffer.concat([Buffer.from("")], 32);
    let end = Buffer.alloc(32);
    end = Buffer.concat([Buffer.from("")], 32);
    let sol_amount = Buffer.alloc(8);
    sol_amount = Buffer.concat([Buffer.from(dt.toString())], 8);
    let hgen_amount = Buffer.alloc(8);
    hgen_amount = Buffer.concat([Buffer.from(dt.toString())], 8);
    let day_total = Buffer.alloc(8);
    day_total = Buffer.concat([Buffer.from(dt.toString())], 8);
    let day_left = Buffer.alloc(8);
    day_left = Buffer.concat([Buffer.from(dt.toString())], 8);
    let data = Buffer.alloc(96);
    data = Buffer.concat(
        [start, end, sol_amount, hgen_amount, day_total, day_left],
        96
    );
    let _sendData = {
        instructionId: Buffer.from("1"),
        data: data,
    };
    let sendData = Buffer.alloc(97);
    INSTRUCTION_LAYOUT.encode(_sendData, sendData);
    let withdrawIx = new TransactionInstruction({
        keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
            { pubkey: farming_account, isSigner: false, isWritable: true },
        ],
        programId: programId,
        data: sendData,
    });

    let tx = new Transaction();
    tx.add(tokenTransaction, withdrawIx);

    // добавляем данне для возможност формирования подписи
    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    // let signedTx = await wallet.signTransaction(tx);
    // let txId = await connection.sendRawTransaction(signedTx.serialize());
    // await connection.confirmTransaction(txId)

    await web3.sendAndConfirmTransaction(
        connection,
        tx,
        [keypair]
    );
};
