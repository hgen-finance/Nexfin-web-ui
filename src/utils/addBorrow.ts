import {
    Account,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    Connection,
    TransactionInstruction,
    SystemInstruction
  } from '@solana/web3.js';
  import BN from "bn.js";
  import {TroveLayout, TROVE_ACCOUNT_DATA_LAYOUT, EscrowProgramIdString, CHAINLINK_SOL_USD_PUBKEY, TOKEN_GENS_ACC, SYS_ACCOUNT} from './layout';
  import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
  import Wallet from "@project-serum/sol-wallet-adapter";
  
  export const addBorrowUtil = async (
      wallet: Wallet,
      troveId:string,
      borrowAmount: number,
      lamportAmount: number,
      connection: Connection,
  ) => {
    
    
      const troveAccount = new PublicKey(troveId);
      const escrowProgramId = new PublicKey(EscrowProgramIdString);
      
      const transferIx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey:troveAccount,
        lamports: lamportAmount
      })

      console.log(transferIx)

      const addBorrowIx = new TransactionInstruction({
          programId: escrowProgramId,
          keys: [
              {pubkey: wallet.publicKey, isSigner: true, isWritable: false},
              {pubkey: troveAccount, isSigner: false, isWritable: true},
              {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
              {pubkey: CHAINLINK_SOL_USD_PUBKEY, isSigner: false, isWritable: false},
          ],
          data: Buffer.from(
              Uint8Array.of(
                  12,
                  ...new BN(borrowAmount).toArray("le", 8),
                  ...new BN(lamportAmount).toArray("le", 8),
              )
          )
      })
      console.log(addBorrowIx)

      // add instruction to the transaction
      const tx = new Transaction().add(transferIx, addBorrowIx);
      console.log("the tx is working", tx);

      // add data for signature generation
      let {blockhash} = await connection.getRecentBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;
  
      // to sign
      let signedTx = await wallet.signTransaction(tx);
    //   // to write without signer
    //   signedTx.partialSign(troveAccount)
      let txId = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txId);
  
      // Info
      const encodedTroveState = (await connection.getAccountInfo(troveAccount, 'singleGossip'))!.data;
      const decodedTroveState = TROVE_ACCOUNT_DATA_LAYOUT.decode(encodedTroveState) as TroveLayout;
  
      return {
        troveAccountPubkey: troveAccount.toBase58(),
        isInitialized: !!decodedTroveState.isInitialized,
        isLiquidated: !!decodedTroveState.isLiquidated,
        isReceived: !!decodedTroveState.isReceived,
        borrowAmount: new BN(decodedTroveState.borrowAmount, 10, 'le').toNumber(),
        lamports: new BN(decodedTroveState.lamports, 10, 'le').toString(),
        teamFee: new BN(decodedTroveState.teamFee, 10, 'le').toString(),
        depositorFee: new BN(decodedTroveState.depositorFee, 10, 'le').toString(),
        amountToClose: new BN(decodedTroveState.amountToClose, 10, 'le').toString(),
        owner: new PublicKey(decodedTroveState.owner).toBase58(),
      }
  }
  