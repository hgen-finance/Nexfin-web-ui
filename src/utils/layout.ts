import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";

import { TOKEN_SWAP_PROGRAM_ID } from "@/utils/tokenSwap";

import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

// set this for farming
export const farmingProgramIdString =
  "EXgCpsUR6DayempLFhq4mMdaKuZroRmjtRTRo6t9iGMB";
//set this for borrow
// export const EscrowProgramIdString = '2NybGeQqFutpNn29DyvS4LgyHX8wLd9Dy4KMhpTTvS8i'
// export const EscrowProgramIdString = "5kLDDxNQzz82UtPA5hJmyKR3nUKBtRTfu4nXaGZmLanS";
//export const EscrowProgramIdString = '4XpqGMbFvrvHxXWyCDWNgyhVVVdh4G7Btp18NKr4Yp6T'
export const EscrowProgramIdString =
  "HPwvr8B9KtM3CZwQg7V8pevfgsZfZBLiR3gL1HcEsGiD";

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};
const dateArray = (property = "date") => {
  return BufferLayout.seq(BufferLayout.u8(), 32, property);
};

const u8Array = (property = "data") => {
  return BufferLayout.seq(BufferLayout.u8(), 96, property);
};

// TODO: use borsh for buffer
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
  uint64("depositedLp"),
  uint64("depositedSol"),
  uint64("depositedHgen"),
  uint64("dayLength"),
  uint64("dayLeft"),
]);

export const INSTRUCTION_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("instructionId"),
  u8Array("data"),
]);

export interface InstructionLayout {
  instructionId: number;
  data: Uint8Array;
}

export interface TroveLayout {
  isInitialized: number;
  isLiquidated: number;
  isReceived: number;
  borrowAmount: Uint8Array;
  lamports: Uint8Array;
  teamFee: Uint8Array;
  depositorFee: Uint8Array;
  amountToClose: Uint8Array;
  owner: Uint8Array;
}

export interface DepositLayout {
  isInitialized: number;
  tokenAmount: Uint8Array;
  rewardTokenAmount: Uint8Array;
  rewardGovernanceTokenAmount: Uint8Array;
  rewardCoinAmount: Uint8Array;
  bank: Uint8Array;
  governanceBank: Uint8Array;
  owner: Uint8Array;
}

export interface FarmingLayout {
  isInitialized: number;
  startDate: Uint8Array;
  endDate: Uint8Array;
  depositedLp: Uint8Array;
  depositedSol: Uint8Array;
  depositedHgen: Uint8Array;
  dayLength: Uint8Array;
  dayLeft: Uint8Array;
}

export const WSOL_ADDR = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

// export const TOKEN_GENS = new PublicKey('JCnyD2wyimf5P3MBVAxB5yCVhotmswDhvrwXdS9xNbAq')
//export const TOKEN_GENS = new PublicKey('C6tfES3TrhTzQnRopAyqHAjx4ixShAzJ16QeffWvoXBk')
// export const TOKEN_GENS = new PublicKey(
//     "2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe"
// );
export const TOKEN_GENS = new PublicKey(
  "2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8"
);
// export const TOKEN_GENS_ACC = new PublicKey(
//     "Dgb9x1ay5qEFHPimLJY9JZpTHcssdvYgM7aC5c2DVA73"
// );
export const TOKEN_GENS_ACC = new PublicKey(
  "HqESSnK1XaQ33Ww4YecraNxEXJEs6zVwxDgQ5vWkSutX"
);

//export const TOKEN_HGEN = new PublicKey('4MxiWoWWgRmd7YAPmJNtaivDATVgpoGjHbrdF4d2EmoJ')
// export const TOKEN_HGEN = new PublicKey(
//     "6UeYcgjzpij4wGhVShJQsoCoi3nk2bPvz4v4Dz4cmMVv"
// );

// export const TOKEN_HGEN = new PublicKey(
//     "97MxeDbRgc6vYP1Sty2XdPXks3QhMD97EVYJ9pP4XcR3"
// );
export const TOKEN_HGEN = new PublicKey(
  "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC"
);

export const SYS_ACCOUNT = new PublicKey(
  "54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"
);
export const CHAINLINK_SOL_USD_PUBKEY = new PublicKey(
  "FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf"
);

export const PYTH_SOL_USD_PUBKEY = new PublicKey(
  "J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"
);

export const CLUSTER = process.env.CLUSTER || "devnet";

export const TOKEN_A_MINT_ADDR = new PublicKey(
  "2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8"
);
export const TOKEN_B_MINT_ADDR = new PublicKey(
  "E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC"
);

//for gens-hgen pool
export const TOKEN_ACC_A = new PublicKey(
  "5etMNHVBgVRXxPKXiuqt4GAMSk3K4oqHoZ7FcsghHSg6"
);
export const TOKEN_ACC_B = new PublicKey(
  "FG9tYQWdukBL5iBQ7G5UrKqHDDszxbgxQwsnjYa9JYgC"
);

export const TOKEN_SWAP_ACCOUNT = new PublicKey(
  "FDgib3oNr1dipJbju236c7fkNYmb65duGe1MFuSoStew"
);

export const POOL_AUTHORITY = new PublicKey(
  "3fzxHa3ugMuqvsqgVL9TpusxnoxqdHBok7RSchAYrPHv"
);

export const LP_TOKENS_HGEN_GENS = new PublicKey(
  "6NeC6rBQH9RDyW3cwJ9Lp93DRPUr7DWmeVLYJP7ZGX7K"
);
export const LP_POOL_OWNER = new PublicKey(
  "424v2hHJtDA879UfMikVWr7VTvJsFqE9XaZkkbe6Uv2J"
);

// for gens-sol pool
export const TOKEN_ACC_GENS_GS = new PublicKey(
  "9uA19MdcUKgbU3Uc5dwifigdoebG78qR6a8ycqoCDVua"
);
export const TOKEN_ACC_SOL_GS = new PublicKey(
  "5LVAjApVWfkKKiXe3ve4HosaJ3WrAroXzopZ5En4mRCS"
);

export const TOKEN_SWAP_GEN_SOL_ACCOUNT = new PublicKey(
  "rZe7AtEeej9yjFzvhzQT4Sby37DTwc5wB5ma7BioxBP"
);

export const POOL_AUTHORITY_GS = new PublicKey(
  "2eq5ia3cexzXFxFocJCtRBg5EkyBvAUQmMVBrhG1YAeE"
);

export const LP_TOKENS_GS = new PublicKey(
  "BCgsj9tygk6ANpna1Qy3x4eEcUF5RtVcS1pQG2o6NWZw"
);
export const LP_TOOKS_GS_POOL_ACC = new PublicKey(
  "LiJKg7UJVmDGFcF2NWdmgKTixD1DJGwyufohGg54qNu"
);
export const LP_POOL_OWNER_GS = new PublicKey(
  "424v2hHJtDA879UfMikVWr7VTvJsFqE9XaZkkbe6Uv2J"
);

// for hgen-sol pool
export const TOKEN_ACC_HGEN_HS = new PublicKey(
  "G7BXM8B9qzW1reYsD6myAxCEm176WNG7UgiSNauHaQZ8"
);
export const TOKEN_ACC_SOL_HS = new PublicKey(
  "9LGdVahCQQ8MHK1EQsKS965tNi69iH5qyoYASFN2r6kU"
);

export const TOKEN_SWAP_HGEN_SOL_ACCOUNT = new PublicKey(
  "FsQ4J8i2kziaihjCjMszeDCCmi9EzUFiFMXwkv5wLmv5"
);

export const LP_TOKENS_HS = new PublicKey(
  "JCGWBPdM5q172VFfZV43uQr6bmcJM3pASmCqMNb1MEVn"
);
export const LP_TOOKS_HS_POOL_ACC = new PublicKey(
  "gMa8KUkxASTJqKQCEGGWzrJMCXJcL83tdfa7UpP16fq"
);
export const LP_POOL_OWNER_HS = new PublicKey(
  "424v2hHJtDA879UfMikVWr7VTvJsFqE9XaZkkbe6Uv2J"
);

export const POOL_AUTHORITY_HS = new PublicKey(
  "qSt4fR5GTs2u3w3xCnTErWxXdrUDNu7VPbCs7TGxKzT"
);

export const getCollateral = (gens: string, lamports: string, usd: string) => {
  // TODO might need to change the value later here
  //   console.log(`gens:${gens}, lamports:${lamports}, usd:${usd}}`);
  let result = 0;
  if (gens === "0") {
    return result;
  } else {
    result = new BN(lamports)
      .mul(new BN(usd))
      .div(new BN(gens))
      .div(new BN("10000000"))
      .toNumber();
  }
  return result;
};

// cr = lamport/1000000000 * usd / gens
// gens = lamport / 100000000
