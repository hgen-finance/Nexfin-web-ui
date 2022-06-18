import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { EscrowProgramIdString } from "./layout";
import { Market } from "@project-serum/serum";
import Wallet from "@project-serum/sol-wallet-adapter";

export const swapUtil = async (
    wallet: Wallet,
    price: number,
    from: string,
    to: string,
    connection: Connection
) => {
    let marketAddress = new PublicKey(
        "SwaPpA9LAaLfeLi3a68M4DjnLqgtticKg6CnyNwgAC8"
    );
    let programAddress = new PublicKey(
        "BPFLoaderUpgradeab1e11111111111111111111111"
    );
    let market = await Market.load(connection, marketAddress, {}, programAddress);
    // Fetching orderbooks
    let bids = await market.loadBids(connection);
    let asks = await market.loadAsks(connection);
    // L2 orderbook data
    for (let [price, size] of bids.getL2(20)) {
        console.log(price, size);
    }
    // Full orderbook data
    for (let order of asks) {
        console.log(
            order.orderId,
            order.price,
            order.size,
            order.side // 'buy' or 'sell'
        );
    }

    return {
        status: true,
    };
};
