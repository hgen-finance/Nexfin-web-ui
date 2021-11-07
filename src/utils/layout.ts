import * as BufferLayout from "buffer-layout";
import {PublicKey} from "@solana/web3.js";
import BN from "bn.js"

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

export const EscrowProgramIdString = '5uqKRHcKyEJ4Pw4cRVus32a1wfEMGdHpgMa1FLqoQaN8'

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

export const TROVE_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("isLiquidated"),
  BufferLayout.u8("isReceived"),
  uint64("borrowAmount"),
  uint64("lamports"),
  uint64("teamFee"),
  uint64("depositorFee"),
  uint64("amountToClose"),
  publicKey("owner"),
]);

export const DEPOSIT_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  uint64("tokenAmount"),
  uint64("rewardTokenAmount"),
  uint64("rewardGovernanceTokenAmount"),
  uint64("rewardCoinAmount"),
  publicKey("bank"),
  publicKey("governanceBank"),
  publicKey("owner"),
]);

export const OWNER_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("bank"),
  publicKey("governanceBank"),
  publicKey("owner"),
]);

export interface TroveLayout {
  isInitialized: number,
  isLiquidated: number,
  isReceived: number,
  borrowAmount: Uint8Array,
  lamports: Uint8Array,
  teamFee: Uint8Array,
  depositorFee: Uint8Array,
  amountToClose: Uint8Array,
  owner: Uint8Array
}

export interface DepositLayout {
  isInitialized: number,
  tokenAmount: Uint8Array,
  rewardTokenAmount: Uint8Array,
  rewardGovernanceTokenAmount: Uint8Array,
  rewardCoinAmount: Uint8Array,
  bank: Uint8Array,
  governanceBank: Uint8Array,
  owner: Uint8Array
}

export const TOKEN_GENS = new PublicKey('JCnyD2wyimf5P3MBVAxB5yCVhotmswDhvrwXdS9xNbAq')
export const SYS_ACCOUNT = new PublicKey('H8zGtK1u7wtGmcYFLcrES4trMRAz8BR2WH83k3uYYiLo')
export const CHAINLINK_SOL_USD_PUBKEY = new PublicKey('FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf')

export const getCollateral = (gens: string, lamports: string, usd: string) => {
  return new BN(lamports).div(new BN("10000000")).mul(new BN(usd)).div(new BN(gens))
}
