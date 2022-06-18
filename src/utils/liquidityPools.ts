import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { EscrowProgramIdString } from "./layout";
import { Market } from "@project-serum/serum";
import Wallet from "@project-serum/sol-wallet-adapter";

export const addLiquidityUtil = async (
    wallet: Wallet,
    price: number,
    from: string,
    to: string,
    connection: Connection
) => {
    //TODO: Add the logic here later
};