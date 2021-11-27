import * as BufferLayout from "buffer-layout";
import {PublicKey} from "@solana/web3.js";
import BN from "bn.js"

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

// set this for farming
// export const EscrowProgramIdString = 'EXgCpsUR6DayempLFhq4mMdaKuZroRmjtRTRo6t9iGMB'
//set this for borrow
 export const EscrowProgramIdString = '5uqKRHcKyEJ4Pw4cRVus32a1wfEMGdHpgMa1FLqoQaN8'
//export const EscrowProgramIdString = '4XpqGMbFvrvHxXWyCDWNgyhVVVdh4G7Btp18NKr4Yp6T'

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};
const dateArray = (property = "date") => {
  return BufferLayout.seq(BufferLayout.u8(), 32, property)
}

const u8Array = (property = "data") => {
  return BufferLayout.seq(BufferLayout.u8(), 96, property)
}

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

export const FARMING_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  dateArray("startDate"),
  dateArray("endDate"),
  uint64("depositedSol"),
  uint64("depositedHgen"),
  uint64("dayLength"),
  uint64("dayLeft")
])

export const INSTRUCTION_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("instructionId"),
  u8Array("data")
])

export interface InstructionLayout {
  instructionId: number,
  data : Uint8Array
}

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

export interface FarmingLayout {
  isInitialized: number,
  startDate: Uint8Array,
  endDate: Uint8Array,
  depositedSol: Uint8Array,
  depositedHgen: Uint8Array,
  dayLength: Uint8Array,
  dayLeft: Uint8Array
}

export const TOKEN_GENS = new PublicKey('JCnyD2wyimf5P3MBVAxB5yCVhotmswDhvrwXdS9xNbAq')
//export const TOKEN_GENS = new PublicKey('2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe')
export const TOKEN_HGEN = new PublicKey('97MxeDbRgc6vYP1Sty2XdPXks3QhMD97EVYJ9pP4XcR3')
export const SYS_ACCOUNT = new PublicKey('H8zGtK1u7wtGmcYFLcrES4trMRAz8BR2WH83k3uYYiLo')
//export const SYS_ACCOUNT = new PublicKey('54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t')
export const CHAINLINK_SOL_USD_PUBKEY = new PublicKey('FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf')

export const getCollateral = (gens: string, lamports: string, usd: string) => {
    console.log("the value of the collateral gens are ", gens)
    let test = new BN(lamports).div(new BN("10000000")).mul(new BN(usd)).div(new BN(gens))
    console.log("testing for get Collateral", test)
    return test
}
