import { u64 } from '@solana/spl-token';
import {
    PublicKey,
} from '@solana/web3.js';

export interface Pool {
    authority: PublicKey;
    owner: PublicKey;
    payer: PublicKey;
    tokenAccountPool: PublicKey;
    feeAccount: PublicKey;
    tokenAMintAddr: PublicKey;
    tokenBMintAddr: PublicKey;
    tokenAccountA: PublicKey;
    tokenAccountB: PublicKey;
    tokenAmountA: number; // pool gen account amount 
    tokenAmountB: number; // pool hgen account amount
}