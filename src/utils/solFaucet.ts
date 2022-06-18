import {
    Connection,
} from "@solana/web3.js";

import Wallet from "@project-serum/sol-wallet-adapter";

const LAMPORTS_PER_SOL = 2000000000

export const faucetUtil = async (
    wallet: Wallet,
    connection: Connection,
) => {

    // air drop signature for tx
    const airDropSignature = await connection.requestAirdrop(
        wallet.publicKey,
        LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(airDropSignature);

};




