import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { TroveLayout, TROVE_ACCOUNT_DATA_LAYOUT } from "./layout";

export const encodeUtil = async (trove, encodedTroveState) => {
  const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(
    encodedTroveState
  ) as TroveLayout;

  return {
    troveAccountPubkey: trove.toBase58(),
    isInitialized: !!decodedTroveState.isInitialized,
    isLiquidated: !!decodedTroveState.isLiquidated,
    isReceived: !!decodedTroveState.isReceived,
    borrowAmount: new BN(decodedTroveState.borrowAmount, 10, "le").toNumber(),
    lamports: new BN(decodedTroveState.lamports, 10, "le").toString(),
    teamFee: new BN(decodedTroveState.teamFee, 10, "le").toString(),
    depositorFee: new BN(decodedTroveState.depositorFee, 10, "le").toString(),
    amountToClose: new BN(decodedTroveState.amountToClose, 10, "le").toString(),
    owner: new PublicKey(decodedTroveState.owner).toBase58(),
  };
};
