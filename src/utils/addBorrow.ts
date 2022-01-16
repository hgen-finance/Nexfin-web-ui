import {
    Account,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    Connection,
    TransactionInstruction,
    SystemInstruction,
    Keypair
  } from '@solana/web3.js';
  import BN from "bn.js";
  import * as bs58 from "bs58";
  import {TroveLayout, TROVE_ACCOUNT_DATA_LAYOUT, EscrowProgramIdString, CHAINLINK_SOL_USD_PUBKEY, TOKEN_GENS_ACC, SYS_ACCOUNT, TOKEN_GENS} from './layout';
  import { TOKEN_PROGRAM_ID, Token, AuthorityType } from "@solana/spl-token";
  import Wallet from "@project-serum/sol-wallet-adapter";
  
  export const addBorrowUtil = async (
      wallet: Wallet,
      troveId:string,
      borrowAmount: number,
      lamportAmount: number,
      connection: Connection,
  ) => {

      // setup pda for minting
      // TODO set the seed to be wallet as well
     const [pda_mint, bump_mint] = await PublicKey.findProgramAddress([Buffer.from('test')], new PublicKey(EscrowProgramIdString));     
     console.log(`bump: ${bump_mint}, pubkey: ${pda_mint.toBase58()}`);
    
      const troveAccount = new PublicKey(troveId);
      const escrowProgramId = new PublicKey(EscrowProgramIdString);
      
      const transferIx = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey:troveAccount,
        lamports: lamportAmount
      })

    //   console.log(transferIx)

      const GENS = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {mint: new PublicKey(TOKEN_GENS)});
      const tokenADA = GENS.value[0] ? GENS.value[0].pubkey.toBase58() : "";

      Token.createMintToInstruction

      const addBorrowIx = new TransactionInstruction({
          programId: escrowProgramId,
          keys: [
             { pubkey: wallet.publicKey, isSigner: true, isWritable: false},
                { pubkey: troveAccount, isSigner: false, isWritable: false},
                { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
                { pubkey: TOKEN_PROGRAM_ID, isSigner:false, isWritable:false },
                { pubkey: new PublicKey(TOKEN_GENS), isSigner:false, isWritable:true},
                { pubkey: new PublicKey(tokenADA), isSigner:false, isWritable:true},
                { pubkey: pda_mint, isSigner:false, isWritable:true},
          ],
          data: Buffer.from(
              Uint8Array.of(
                  12,
                  ...new BN(borrowAmount).toArray("le", 8),
                  ...new BN(lamportAmount).toArray("le", 8),
                  bump_mint
              )
          )
      })

    // let mint_type: AuthorityType = "MintTokens"
    // let pda_account_mint = pda_mint

    // change mint authority
    // const changeMintIx = Token.createSetAuthorityInstruction(
    //     TOKEN_PROGRAM_ID,
    //     new PublicKey(TOKEN_GENS),
    //     pda_account_mint,
    //     mint_type,
    //     wallet.publicKey,
    //     []
    // )
      
      // add instruction to the transaction
      const tx = new Transaction().add(transferIx, addBorrowIx);
      console.log("the tx is working", tx);

      // add data for signature generation
      let {blockhash} = await connection.getRecentBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;
  
      // to sign
      let signedTx = await wallet.signTransaction(tx);
    // //   // to write without signer
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
  