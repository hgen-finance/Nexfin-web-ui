import { PublicKey, sendAndConfirmTransaction as realSendAndConfirmTransaction } from '@solana/web3.js';
import type {
    Account,
    Connection,
    Transaction,
    TransactionSignature,
    Keypair
} from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';

export async function sendAndConfirmTransaction(
    title: string,
    wallet: Wallet,
    connection: Connection,
    transaction: Transaction,
    ...signers: Array<Account>
): Promise<TransactionSignature> {

    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;

    //sign transaction
    let signedTx = await wallet.signTransaction(transaction)

    // to write without signer for new accounts
    if (signers.length > 0)
        signedTx.partialSign(...signers);

    let txId = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'recent',
    });
    await connection.confirmTransaction(txId, 'recent');
    return txId

    // For only test
    // return realSendAndConfirmTransaction(connection, transaction, signers, {
    //     skipPreflight: false,
    //     commitment: 'recent',
    //     preflightCommitment: 'recent',
    // });
}