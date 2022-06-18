import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
    Connection,
    PublicKey,
    Transaction,
} from "@solana/web3.js";
import {
    EscrowProgramIdString,
} from "./layout";
import Wallet from "@project-serum/sol-wallet-adapter";

// anchor
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

export const claimRewardUtil = async (
    wallet: Wallet,
    depositId: string,
    tokenMintAccountPubkey: PublicKey,
    pdaToken: string,
    governanceToken: string,
    connection: Connection,
    escrowProgram
) => {
    const depositAccount = new PublicKey(depositId);
    const escrowProgramId = new PublicKey(EscrowProgramIdString);
    const tokenMintAcc = tokenMintAccountPubkey;
    const pdaTokenAcc = new PublicKey(pdaToken);
    const governanceTokenAcc = new PublicKey(governanceToken);

    // setup pda for deposit account
    const [_, deposit_account_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("deposit"), anchor.getProvider().wallet.publicKey.toBuffer()],
        escrowProgramId
    );

    //setup for mint authroity account
    const [pda_mint, mint_account_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("mint-authority")],
        new PublicKey(EscrowProgramIdString)
    );

    //setup for mint authroity account
    const [reward_vault_pda, reward_vault_bump] = await PublicKey.findProgramAddress(
        [anchor.utils.bytes.utf8.encode("rewardVault")],
        new PublicKey(EscrowProgramIdString)
    );


    let claimDepositRewardIx;
    try {
        claimDepositRewardIx = escrowProgram.instruction.claimDepositReward(new anchor.BN(mint_account_bump), new anchor.BN(deposit_account_bump), new anchor.BN(reward_vault_bump),
            {
                accounts: {
                    authority: wallet.publicKey,
                    deposit: depositAccount,
                    tokenAuthority: pda_mint,
                    stableCoin: tokenMintAcc,
                    userTokenAccount: pdaTokenAcc,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    userGovToken: governanceTokenAcc,
                    rewardCoinVault: reward_vault_pda,
                    systemProgram: SystemProgram.programId,

                }
            },
        );

    } catch (err) {
        console.error(err, "Anchor error");
    }


    const tx = new Transaction().add(claimDepositRewardIx);

    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;

    // to sign
    let signedTx = await wallet.signTransaction(tx);
    let txId = await connection.sendRawTransaction(signedTx.serialize());


    return {
        txId,
        depositAccountPubkey: depositAccount.toBase58(),
        rewardVaultPubkey: reward_vault_pda.toBase58(),
    };
};
