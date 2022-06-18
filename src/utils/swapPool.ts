import {
    Account,
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    Keypair,
    TransactionInstruction
} from '@solana/web3.js';

import { AccountLayout, Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TOKEN_A_MINT_ADDR, TOKEN_B_MINT_ADDR, POOL_AUTHORITY, TOKEN_ACC_A, TOKEN_ACC_B, LP_TOKENS_HGEN_GENS } from '@/utils/layout';

import { TokenSwap, CurveType, TOKEN_SWAP_PROGRAM_ID, Numberu64 } from '@/utils/tokenSwap';
import { sendAndConfirmTransaction } from '@/utils/tokenSwap/util/send-and-confirm-transaction';
import { newAccountWithLamports } from '@/utils/tokenSwap/util/new-account-with-lamports';
import { url, walletUrl } from '@/utils/tokenSwap/util/url';
import { sleep } from '@/utils/tokenSwap/util/sleep';

import { Pool } from '@/store/interfaces/poolInterface';
import Wallet from "@project-serum/sol-wallet-adapter";

import BN from 'bn.js';
import * as bs58 from "bs58";

import { connect } from 'http2';

import { getMintInfo, getAccountInfo } from "@/utils/accounts";
import { sign } from 'crypto';


// The following globals are created by `createTokenSwap` and used by subsequent tests
// Token swap
let tokenSwap: TokenSwap;
// authority of the token and accounts
let authority: PublicKey;
// bump seed used to generate the authority public key
let bumpSeed: number;
// owner of the user accounts
let owner: Account;
// payer
let payer: Account;

// Token pool
let tokenPool: Token;
let tokenAccountPool: PublicKey;
let feeAccount: PublicKey;
// Tokens swapped
let GENS: Token; // GENS TOKEN
let HGEN: Token; // HGEN TOKEN
let tokenAccountGENS: PublicKey;
let tokenAccountHGEN: PublicKey;

// user tokens account
let userAccountGENS: PublicKey;
let userAccountHGEN: PublicKey;

// pool info
let poolInfo: Pool;

// Hard-coded fee address, for testing production mode
const SWAP_PROGRAM_OWNER_FEE_ADDRESS =
    process.env.SWAP_PROGRAM_OWNER_FEE_ADDRESS || "54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t";

const WSOL_ADDR = new PublicKey("So11111111111111111111111111111111111111112")
const GENS_ADDR = new PublicKey("2aNEZTF7Lw9nfYv6qQEuWDyngSrB5hbdfx35jpqwcKz8");
const HGEN_ADDR = new PublicKey("E2UTFZCt7iCAgaCMC3Qf7MQB73Zwjc6J1avz298tn6UC");


// Pool fees
const TRADING_FEE_NUMERATOR = 25;
const TRADING_FEE_DENOMINATOR = 10000;
const OWNER_TRADING_FEE_NUMERATOR = 5;
const OWNER_TRADING_FEE_DENOMINATOR = 10000;
const OWNER_WITHDRAW_FEE_NUMERATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 1 : 0;
const OWNER_WITHDRAW_FEE_DENOMINATOR = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 6 : 0;
const HOST_FEE_NUMERATOR = 0;
const HOST_FEE_DENOMINATOR = 100;

// Initial amount in each swap token
let currentSwapTokenA = 1000000;
let currentSwapTokenB = 1000000;
// TODO: use it when tokenAccount is finalized
// let currentFeeAmount = await tokenPool.getAccountInfo(feeAccount);
// only for testing
let currentFeeAmount = 0;

// Swap instruction constants
// Because there is no withdraw fee in the production version, these numbers
// need to get slightly tweaked in the two cases.
let SWAP_AMOUNT_IN = 100000;
// 90661 : 90674;
let SWAP_AMOUNT_OUT = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 5 * SWAP_AMOUNT_IN / 100 : 1 * SWAP_AMOUNT_IN / 100;
// 22273 : 22277;
const SWAP_FEE = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? 22273 : 22277;
const HOST_SWAP_FEE = SWAP_PROGRAM_OWNER_FEE_ADDRESS
    ? Math.floor((SWAP_FEE * HOST_FEE_NUMERATOR) / HOST_FEE_DENOMINATOR)
    : 0;
const OWNER_SWAP_FEE = SWAP_FEE - HOST_SWAP_FEE;

// Pool token amount minted on init
const DEFAULT_POOL_TOKEN_AMOUNT = 1000000000;
// Pool token amount to withdraw / deposit
//10000000
let POOL_TOKEN_AMOUNT = 100000;

// TODO: Add it to backend
payer = new Account(bs58.decode("1hDLdJbrt3UdQrkZTu2RRisUYWzTQCx7hQXTBk4uvCibdSAox6qHPTXj2Vw4RkB62ug6cGj5zW77ReWGA7kPRum"));
owner = new Account(bs58.decode("C6G4xgk4e6gEKuaqjW9z5DJNnsEJeFiGf6CJ818yNTCjeTU1FRE3vQTHFKWqBGhKq3FfJZsL5RyVqgNU3XigoaE"));

function assert(condition: boolean, message?: string) {
    if (!condition) {
        console.log(Error().stack + ':../cli/swapPool.ts');
        throw message || 'Assertion failed';
    }
}

let connection: Connection;
async function getConnection(): Promise<Connection> {
    if (connection) return connection;

    connection = new Connection("https://api.devnet.solana.com");
    const version = await connection.getVersion();

    console.log('Connection to cluster established:', url, version);
    return connection;
}

// check if the wallet user has the mint addr token account
async function checkATA(wallet: Wallet, mintAcc: PublicKey) {
    let check_token = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: GENS.publicKey,
    });
    let tokenATA = check_token.value[0] ? check_token.value[0].pubkey.toBase58() : "";
    return tokenATA == "" ? true : false;
}

export async function addToken(wallet: Wallet) {
    console.log(owner.publicKey.toBase58())
    const connection = await getConnection();
    let hgenMintAddr = TOKEN_B_MINT_ADDR;
    let gensMintAddr = TOKEN_A_MINT_ADDR;

    let check_gens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: gensMintAddr,
    });
    let genATA = check_gens.value[0] ? check_gens.value[0].pubkey.toBase58() : "";

    let check_hgen = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: hgenMintAddr,
    });
    let hgenATA = check_hgen.value[0] ? check_hgen.value[0].pubkey.toBase58() : "";

    // check if there is already an gens and hgen account for the user
    let ataGens;
    let tx = new Transaction();

    // await GENS.mintTo(userAccountGENS, owner, [], 100000);
    let mintTokenAIx;

    if (genATA == "") {
        // userAccountGENS = await GENS.createAccount(wallet.publicKey);
        ataGens = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            gensMintAddr, // mint
            wallet.publicKey // owner
        );
        const ataGensAccountTx = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            gensMintAddr, // mint
            ataGens, // ata
            wallet.publicKey, // owner of token account
            wallet.publicKey // fee payer
        )
        mintTokenAIx = Token.createMintToInstruction(TOKEN_PROGRAM_ID, TOKEN_A_MINT_ADDR, ataGens, owner.publicKey, [], 100000);
        tx.add(ataGensAccountTx, mintTokenAIx);
    } else {
        mintTokenAIx = Token.createMintToInstruction(TOKEN_PROGRAM_ID, TOKEN_A_MINT_ADDR, check_gens.value[0].pubkey, owner.publicKey, [], 100000);
        tx.add(mintTokenAIx);
    }

    let ataHgen;

    // await HGEN.mintTo(userAccountHGEN, owner, [], 100000);
    let mintTokenBIx;
    if (hgenATA == "") {
        // userAccountHGEN = await HGEN.createAccount(wallet.publicKey);
        ataHgen = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            hgenMintAddr, // mint
            wallet.publicKey // owner
        );
        const ataHgenAccountTx = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            hgenMintAddr, // mint
            ataHgen, // ata
            wallet.publicKey, // owner of token account
            wallet.publicKey // fee payer
        )
        mintTokenBIx = Token.createMintToInstruction(TOKEN_PROGRAM_ID, TOKEN_B_MINT_ADDR, ataHgen, owner.publicKey, [], 100000);
        tx.add(ataHgenAccountTx, mintTokenBIx);

    } else {
        mintTokenBIx = Token.createMintToInstruction(TOKEN_PROGRAM_ID, TOKEN_B_MINT_ADDR, check_hgen.value[0].pubkey, owner.publicKey, [], 100000);
        tx.add(mintTokenBIx);
    }

    await sendAndConfirmTransaction("Add tokens", wallet, connection, tx, owner);
}


// helper function to create a wrapped account 
//TODO add a clear up instrction for temporary wrapoed sol accounts
async function getWrappedAccount(
    wallet: Wallet,
    amount: number,
    owner,
    instructions: TransactionInstruction[],
    signers: Account[],
) {
    // fixed lamports of 50 sol, which is equivalent to 50 * 10e9 lamports

    const account = new Account(); // for storing the sol 

    console.log("new account from wrapper sol is ", account.publicKey.toBase58());
    console.log("secret key for the wrap sol accoun is ", account.secretKey);
    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: account.publicKey,
            lamports: amount,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
        })
    );

    instructions.push(
        Token.createInitAccountInstruction(
            TOKEN_PROGRAM_ID,
            WSOL_ADDR,
            account.publicKey,
            owner,
        )
    );
    console.log(signers, "signers is retruning")

    signers.push(account);

    return account.publicKey;
}

// helper function to create a spl account 
//TODO add a clear up instrction for temporary wrapoed sol accounts
async function createSplAccount(
    wallet: Wallet,
    owner,
    instructions: TransactionInstruction[],
    rent,
    mint_addr,
    signers: Account[],
) {
    // fixed lamports of 50 sol, which is equivalent to 50 * 10e9 lamports
    const account = new Account(); // for storing the sol 
    console.log("new account from spl account is ", account.publicKey.toBase58());
    console.log("secret key for the spl account is ", account.secretKey);
    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: account.publicKey,
            lamports: rent,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
        })
    );

    instructions.push(
        Token.createInitAccountInstruction(
            TOKEN_PROGRAM_ID,
            mint_addr,
            account.publicKey,
            owner
        )
    );
    console.log(signers, "signers is retruning")
    signers.push(account);

    return account.publicKey;
}

export async function createTokenSwap(
    curveType: number,
    wallet: Wallet,
    curveParameters?: Numberu64,
): Promise<any> {
    const signers: Account[] = [];
    const instructions: TransactionInstruction[] = [];

    const connection = await getConnection();

    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
    );

    // payer = await newAccountWithLamports(connection, 1000000000);
    let payer = Keypair.fromSecretKey(bs58.decode("1hDLdJbrt3UdQrkZTu2RRisUYWzTQCx7hQXTBk4uvCibdSAox6qHPTXj2Vw4RkB62ug6cGj5zW77ReWGA7kPRum"));
    let owner = Keypair.fromSecretKey(bs58.decode("C6G4xgk4e6gEKuaqjW9z5DJNnsEJeFiGf6CJ818yNTCjeTU1FRE3vQTHFKWqBGhKq3FfJZsL5RyVqgNU3XigoaE"));
    // owner = await newAccountWithLamports(connection, 1000000000);
    const tokenSwapAccount = new Account();

    console.log(tokenSwapAccount.publicKey.toBase58(), "token swap account ");
    console.log(tokenSwapAccount.secretKey, "token swap account secret key");

    [authority, bumpSeed] = await PublicKey.findProgramAddress(
        [tokenSwapAccount.publicKey.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );

    console.log(authority.toBase58(), "pda Authority pubkey");
    console.log(owner.publicKey.toBase58(), "Owner of the token account pool");
    console.log(owner.secretKey, "owner secret key for the mint token")
    console.log(payer.publicKey.toBase58(), "the payer for the account");
    console.log(payer.secretKey, "payer secret key");

    console.log('creating pool mint');
    tokenPool = await Token.createMint(
        connection,
        payer,
        authority,
        null,
        2,
        TOKEN_PROGRAM_ID,
    );
    console.log(tokenPool.publicKey.toBase58(), "Pool token mint addr for gens and sol")

    console.log('creating pool account');
    tokenAccountPool = await tokenPool.createAccount(owner.publicKey);
    console.log("token Account POOl is ", tokenAccountPool);
    console.log("token account pool pubkey is ", tokenAccountPool.toBase58());
    const ownerKey = SWAP_PROGRAM_OWNER_FEE_ADDRESS || owner.publicKey.toString();
    console.log("the owner key is ", ownerKey)
    feeAccount = await tokenPool.createAccount(new PublicKey(ownerKey));
    console.log(feeAccount.toBase58(), "fee account");

    console.log('creating token HGEN');
    // GENS = await Token.createMint(
    //     connection,
    //     payer,
    //     owner.publicKey,
    //     null,
    //     2,
    //     TOKEN_PROGRAM_ID,
    // );

    // user hgen account (source)
    let check_hgen = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: HGEN_ADDR,
    });
    let hgenATA = check_hgen.value[0] ? check_hgen.value[0].pubkey.toBase58() : "";

    let tokenAccountHGEN = await createSplAccount(wallet, authority, instructions, accountRentExempt, HGEN_ADDR, signers);

    instructions.push(Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(hgenATA),
        tokenAccountHGEN,
        wallet.publicKey,
        [],
        8000 * 1e2
    ));

    // user hgen account (source)
    console.log('creating token GENS');
    let check_gens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: GENS_ADDR,
    });
    let gensATA = check_hgen.value[0] ? check_gens.value[0].pubkey.toBase58() : "";

    let tokenAccountGENS = await createSplAccount(wallet, authority, instructions, accountRentExempt, GENS_ADDR, signers);

    instructions.push(Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(gensATA),
        tokenAccountGENS,
        wallet.publicKey,
        [],
        9000 * 1e2
    ));
    // await GENS.mintTo(tokenAccountGENS, owner, [], currentSwapTokenA);

    // console.log('creating token HGEN');
    console.log('creating token account for wrapper sol');

    // let tokenAccountWSOL = await getWrappedAccount(wallet, accountRentExempt, authority, instructions, signers)

    // const from = await getWrappedAccount(wallet, 200 * 1e9 + accountRentExempt, wallet.publicKey, instructions, signers)

    // instructions.push(
    //     Token.createTransferInstruction(
    //         TOKEN_PROGRAM_ID,
    //         from,
    //         tokenAccountWSOL, // should be the wrapped account of the pool
    //         wallet.publicKey,
    //         [],
    //         200 * 1e9
    //     )
    // );

    console.log('creating token swap');
    const swapPayer = wallet;
    console.log(swapPayer.publicKey.toBase58(), "payer for the token of swap pool")

    console.log(TOKEN_SWAP_PROGRAM_ID.toBase58(), "token_swap_program_id")
    try {
        tokenSwap = await TokenSwap.createTokenSwap(
            connection,
            swapPayer,
            tokenSwapAccount,
            authority,
            tokenAccountGENS,
            tokenAccountHGEN,
            tokenPool.publicKey,
            GENS_ADDR, // for the gens mint addr
            HGEN_ADDR, // mint for the hgen addr
            feeAccount,
            tokenAccountPool,
            TOKEN_SWAP_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            TRADING_FEE_NUMERATOR,
            TRADING_FEE_DENOMINATOR,
            OWNER_TRADING_FEE_NUMERATOR,
            OWNER_TRADING_FEE_DENOMINATOR,
            OWNER_WITHDRAW_FEE_NUMERATOR,
            OWNER_WITHDRAW_FEE_DENOMINATOR,
            HOST_FEE_NUMERATOR,
            HOST_FEE_DENOMINATOR,
            curveType,
            curveParameters,
            instructions,
            signers,
        );
    } catch (err) {
        console.error(err, "Token swap creation error")
    }

    console.log('loading token swap');
    const fetchedTokenSwap = await TokenSwap.loadTokenSwap(
        connection,
        tokenSwapAccount.publicKey,
        TOKEN_SWAP_PROGRAM_ID,
        swapPayer.publicKey,
    );

    console.log(fetchedTokenSwap, "Token swap info")

    // testing for the created pool
    // assert(fetchedTokenSwap.tokenProgramId.equals(TOKEN_PROGRAM_ID));
    // assert(fetchedTokenSwap.tokenAccountA.equals(tokenAccountGENS));
    // assert(fetchedTokenSwap.tokenAccountB.equals(tokenAccountWSOL));
    // assert(fetchedTokenSwap.mintA.equals(GENS.publicKey));
    // assert(fetchedTokenSwap.mintB.equals(WSOL_ADDR));
    // assert(fetchedTokenSwap.poolToken.equals(tokenPool.publicKey));
    // assert(fetchedTokenSwap.feeAccount.equals(feeAccount));
    // assert(
    //     TRADING_FEE_NUMERATOR == fetchedTokenSwap.tradeFeeNumerator.toNumber(),
    // );
    // assert(
    //     TRADING_FEE_DENOMINATOR == fetchedTokenSwap.tradeFeeDenominator.toNumber(),
    // );
    // assert(
    //     OWNER_TRADING_FEE_NUMERATOR ==
    //     fetchedTokenSwap.ownerTradeFeeNumerator.toNumber(),
    // );
    // assert(
    //     OWNER_TRADING_FEE_DENOMINATOR ==
    //     fetchedTokenSwap.ownerTradeFeeDenominator.toNumber(),
    // );
    // assert(
    //     OWNER_WITHDRAW_FEE_NUMERATOR ==
    //     fetchedTokenSwap.ownerWithdrawFeeNumerator.toNumber(),
    // );
    // assert(
    //     OWNER_WITHDRAW_FEE_DENOMINATOR ==
    //     fetchedTokenSwap.ownerWithdrawFeeDenominator.toNumber(),
    // );
    // assert(HOST_FEE_NUMERATOR == fetchedTokenSwap.hostFeeNumerator.toNumber());
    // assert(
    //     HOST_FEE_DENOMINATOR == fetchedTokenSwap.hostFeeDenominator.toNumber(),
    // );
    // assert(curveType == fetchedTokenSwap.curveType);

    let gens_info = (await getAccountInfo(connection, tokenAccountHGEN)).info.amount;
    let hgen_info = (await getAccountInfo(connection, tokenAccountGENS)).info.amount;

    poolInfo = {
        authority,
        owner: owner.publicKey,
        payer: payer.publicKey,
        tokenAccountPool,
        feeAccount,
        tokenAMintAddr: HGEN.publicKey,
        tokenBMintAddr: GENS.publicKey,
        tokenAmountA: gens_info.toNumber(),
        tokenAmountB: hgen_info.toNumber(),
        tokenAccountA: tokenAccountGENS, // pool gen account pubkey
        tokenAccountB: tokenAccountHGEN // pool hgen account pubkey
    }
    console.log(poolInfo)
    return poolInfo;
}

export async function depositAllTokenTypes(
    wallet: Wallet,
    tokenSwapAccount: PublicKey,
    lp_tokens: PublicKey,
    poolTokenAccountA: PublicKey,
    poolTokenAccountB: PublicKey,
    tokenAMintAddr: PublicKey,
    tokenBMintAddr: PublicKey,
    tokenAmountA: number,
    tokenAmountB: number,
): Promise<void> {

    console.log(wallet, tokenSwapAccount.toBase58(), lp_tokens.toBase58(), poolTokenAccountA.toBase58(), poolTokenAccountB.toBase58(), tokenAMintAddr.toBase58(), tokenBMintAddr.toBase58(), tokenAmountA, tokenAmountB, "testing")

    const connection = await getConnection();
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
    );

    const signers: Account[] = [];
    const instructions: TransactionInstruction[] = [];

    [authority, bumpSeed] = await PublicKey.findProgramAddress(
        [tokenSwapAccount.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );

    console.log("starting deposit..")
    const poolMintInfo = await getMintInfo(connection, lp_tokens);
    console.log(poolMintInfo, "poolmintinfo")
    const supply = poolMintInfo.supply.toNumber();
    console.log(supply, "supply");

    const swapTokenA = await getAccountInfo(connection, poolTokenAccountA);
    console.log(swapTokenA.info.amount.toNumber(), "swap token a in the pool");

    const swapTokenB = await getAccountInfo(connection, poolTokenAccountB);
    console.log(swapTokenB.info.amount.toNumber(), "swap token b in the pool");



    const userTransferAuthority = wallet.publicKey

    console.log('Creating depositor pool token account');
    let LP_TOKEN = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: lp_tokens,
    });
    let tokenATA = LP_TOKEN.value[0] ? LP_TOKEN.value[0].pubkey.toBase58() : "";

    // create a ATA account if the wallet user doesnt have one
    let ata: PublicKey;
    if (tokenATA != "") {
        ata = new PublicKey(tokenATA);
    }

    if (tokenATA == "") {
        // Only create tx if the account wasnt present
        // calculate ATA
        ata = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            lp_tokens, // mint
            wallet.publicKey // owner
        );
    }
    console.log(tokenATA, "|", ata.toBase58());

    let tokenAATA;
    let tokenBATA;
    try {
        // check if the token is for native (SOL)
        // if (tokenAMintAddr.toBase58() == WSOL_ADDR.toBase58()) {

        //     tokenAATA = await getWrappedAccount(wallet, tokenAmountA * 1e7 + accountRentExempt, wallet.publicKey, instructions, signers);
        //     tokenAmountA = tokenAmountA * 1e7
        //     console.log(tokenAATA, "tokenA ata")
        // }
        // else {
        //     let check_A = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        //         mint: tokenAMintAddr,
        //     });
        //     tokenAATA = check_A.value[0] ? check_A.value[0].pubkey.toBase58() : "";
        //     tokenAATA = new PublicKey(tokenAATA);
        //     console.log(tokenAATA, "tokenA ata")
        //     console.log(tokenAMintAddr, "tokenAMintAddr")
        // }

        let check_A = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
            mint: tokenAMintAddr,
        });

        tokenAATA = check_A.value[0] ? check_A.value[0].pubkey.toBase58() : "";
        tokenAmountA = tokenAmountA * 100;
        tokenAATA = new PublicKey(tokenAATA);

        if (tokenBMintAddr.toBase58() == WSOL_ADDR.toBase58()) {
            tokenBATA = await getWrappedAccount(wallet, tokenAmountB * 1e9 + accountRentExempt, wallet.publicKey, instructions, signers);
            tokenAmountB = tokenAmountB * 1e9
            console.log(tokenBATA, "tokenB ata")
        }
        else {
            let check_B = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                mint: tokenBMintAddr,
            });
            tokenBATA = check_B.value[0] ? check_B.value[0].pubkey.toBase58() : "";
            tokenBATA = new PublicKey(tokenBATA);
            console.log(tokenBATA, "tokenB ata")
        }

    } catch (err) {
        console.log(err, "account mint token error")
    }

    // liqidity for the pool token
    POOL_TOKEN_AMOUNT = Math.min(tokenAmountA * supply / swapTokenA.info.amount.toNumber(), tokenAmountB * supply / swapTokenB.info.amount.toNumber());
    console.log(tokenAmountA * supply / swapTokenA.info.amount.toNumber(), tokenAmountB * supply / swapTokenB.info.amount.toNumber(), "testing")
    console.log(POOL_TOKEN_AMOUNT, "liquidity")


    // TODO uncomment for test only
    if (tokenATA == "") {
        const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            lp_tokens, // mint
            ata, // ata
            wallet.publicKey, // owner of token account
            wallet.publicKey // fee payer
        )
        instructions.push(ataAccountTx)
        try {
            await TokenSwap.depositAllTokenTypes(
                wallet,
                connection,
                tokenSwapAccount,
                authority,
                (tokenAATA),
                (tokenBATA),
                poolTokenAccountA,
                poolTokenAccountB,
                lp_tokens,
                ata,
                userTransferAuthority,
                POOL_TOKEN_AMOUNT,
                tokenAmountA,
                tokenAmountB,
                signers,
                instructions
            );

        } catch (err) {
            console.error(err, "deposit liquidity")
        }

    }
    else {
        await TokenSwap.depositAllTokenTypes(
            wallet,
            connection,
            tokenSwapAccount,
            authority,
            new PublicKey(tokenAATA),
            new PublicKey(tokenBATA),
            poolTokenAccountA,
            poolTokenAccountB,
            lp_tokens,
            ata,
            userTransferAuthority,
            POOL_TOKEN_AMOUNT,
            tokenAmountA,
            tokenAmountB,
            signers,
            instructions
        );
    }


    // TODO only for testing
    // let info;
    // info = await GENS.getAccountInfo(userAccountGENS);
    // assert(info.amount.toNumber() == 0);
    // info = await HGEN.getAccountInfo(userAccountHGEN);
    // assert(info.amount.toNumber() == 0);
    // info = await GENS.getAccountInfo(tokenAccountGENS);
    // assert(info.amount.toNumber() == currentSwapTokenA + tokenA);
    // currentSwapTokenA += tokenA;
    // info = await HGEN.getAccountInfo(tokenAccountHGEN);
    // assert(info.amount.toNumber() == currentSwapTokenB + tokenB);
    // currentSwapTokenB += tokenB;
    // info = await tokenPool.getAccountInfo(newAccountPool);
    // assert(info.amount.toNumber() == POOL_TOKEN_AMOUNT);
}

export async function withdrawAllTokenTypes(
    wallet: Wallet,
    tokenSwapAccount: PublicKey,
    lp_tokens: PublicKey,
    ownertokenAccountPool: PublicKey,
    poolTokenAccountA: PublicKey,
    poolTokenAccountB: PublicKey,
    tokenAMintAddr: PublicKey,
    tokenBMintAddr: PublicKey,
    LP_POOL_TOKEN_AMOUNT: number,
    ownerfeeAccount: PublicKey,

): Promise<void> {
    const connection = await getConnection();
    [authority, bumpSeed] = await PublicKey.findProgramAddress(
        [tokenSwapAccount.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );
    const poolMintInfo = await getMintInfo(connection, lp_tokens);
    console.log(poolMintInfo, "poolmintinfo")
    const supply = poolMintInfo.supply.toNumber();
    console.log(supply, "supply");

    const swapTokenA = await getAccountInfo(connection, poolTokenAccountA);
    console.log(swapTokenA.info.amount.toNumber(), "swap token a in the pool");

    const swapTokenB = await getAccountInfo(connection, poolTokenAccountB);
    console.log(swapTokenB.info.amount.toNumber(), "swap token b in the pool");

    let checkWsolAccount = false;
    if (tokenAMintAddr.toBase58() == WSOL_ADDR.toBase58()) {
        checkWsolAccount = true;
    }

    if (tokenBMintAddr.toBase58() == WSOL_ADDR.toBase58()) {
        checkWsolAccount = true;
    }

    let feeAmount = 0;
    if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
        feeAmount = Math.floor(
            (LP_POOL_TOKEN_AMOUNT * OWNER_WITHDRAW_FEE_NUMERATOR) /
            OWNER_WITHDRAW_FEE_DENOMINATOR,
        );
    }
    const poolTokenAmount = LP_POOL_TOKEN_AMOUNT - feeAmount;
    const tokenA = Math.floor(
        (swapTokenA.info.amount.toNumber() * poolTokenAmount) / supply,
    );
    const tokenB = Math.floor(
        (swapTokenB.info.amount.toNumber() * poolTokenAmount) / supply,
    );

    let check_A = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: tokenAMintAddr,
    });
    let aATA = check_A.value[0] ? check_A.value[0].pubkey.toBase58() : "";

    let check_B = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        mint: tokenBMintAddr,
    });
    let bATA = check_B.value[0] ? check_B.value[0].pubkey.toBase58() : "";

    console.log(' withdraw token A account');
    let userAccountA = new PublicKey(aATA);
    console.log(' withdraw token B account');
    let userAccountB = new PublicKey(bATA);

    // Only for testing
    // const userTransferAuthority = new Account();

    // console.log('Approving withdrawal from pool account');
    // await tokenPool.approve(
    //     tokenAccountPool,
    //     userTransferAuthority.publicKey,
    //     owner,
    //     [],
    //     POOL_TOKEN_AMOUNT,
    // );
    const userTransferAuthority = wallet.publicKey;


    console.log('Withdrawing pool tokens for A and B tokens');
    await TokenSwap.withdrawAllTokenTypes(
        wallet,
        connection,
        tokenSwapAccount,
        authority,
        userAccountA,
        userAccountB,
        poolTokenAccountA,
        poolTokenAccountB,
        lp_tokens, //poolToken
        ownertokenAccountPool,
        userTransferAuthority,
        LP_POOL_TOKEN_AMOUNT * 100, // 2 decimal token
        tokenA,
        tokenB,
        ownerfeeAccount,
        checkWsolAccount
    );

    //TODO only for testing
    // let info = await tokenPool.getAccountInfo(tokenAccountPool);
    // assert(
    //     info.amount.toNumber() == DEFAULT_POOL_TOKEN_AMOUNT - POOL_TOKEN_AMOUNT,
    // );
    // assert(swapTokenA.info.amount.toNumber() == currentSwapTokenA - tokenA);
    // currentSwapTokenA -= tokenA;
    // assert(swapTokenB.info.amount.toNumber() == currentSwapTokenB - tokenB);
    // currentSwapTokenB -= tokenB;
    // info = await GENS.getAccountInfo(userAccountGENS);
    // assert(info.amount.toNumber() == tokenA);
    // info = await HGEN.getAccountInfo(userAccountHGEN);
    // assert(info.amount.toNumber() == tokenB);
    // info = await tokenPool.getAccountInfo(feeAccount);
    // assert(info.amount.toNumber() == feeAmount);
    // currentFeeAmount = feeAmount;
}

// export async function createAccountAndSwapAtomic(
//     wallet: Wallet
// ): Promise<void> {
//     console.log('Creating swap token GENS account');
//     let userAccountGENS = await GENS.createAccount(owner.publicKey);
//     await GENS.mintTo(userAccountGENS, owner, [], SWAP_AMOUNT_IN);

//     // @ts-ignore
//     const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
//         connection,
//     );
//     const newAccount = new Account();
//     const transaction = new Transaction();
//     transaction.add(
//         SystemProgram.createAccount({
//             fromPubkey: owner.publicKey,
//             newAccountPubkey: newAccount.publicKey,
//             lamports: balanceNeeded,
//             space: AccountLayout.span,
//             programId: HGEN.programId,
//         }),
//     );

//     transaction.add(
//         Token.createInitAccountInstruction(
//             HGEN.programId,
//             HGEN.publicKey,
//             newAccount.publicKey,
//             owner.publicKey,
//         ),
//     );

//     const userTransferAuthority = new Account();
//     transaction.add(
//         Token.createApproveInstruction(
//             GENS.programId,
//             userAccountGENS,
//             userTransferAuthority.publicKey,
//             owner.publicKey,
//             [owner],
//             SWAP_AMOUNT_IN,
//         ),
//     );

//     transaction.add(
//         TokenSwap.swapInstruction(
//             tokenSwap.tokenSwap,
//             tokenSwap.authority,
//             userTransferAuthority.publicKey,
//             userAccountGENS,
//             tokenSwap.tokenAccountA,
//             tokenSwap.tokenAccountB,
//             newAccount.publicKey,
//             tokenSwap.poolToken,
//             tokenSwap.feeAccount,
//             null,
//             tokenSwap.swapProgramId,
//             tokenSwap.tokenProgramId,
//             SWAP_AMOUNT_IN,
//             0,
//         ),
//     );

//     // Send the instructions
//     console.log('sending big instruction');
//     await sendAndConfirmTransaction(
//         'create account, approve transfer, swap',
//         wallet,
//         connection,
//         transaction,
//         owner,
//         newAccount,
//         userTransferAuthority,
//     );

//     let info;
//     info = await GENS.getAccountInfo(tokenAccountGENS);
//     currentSwapTokenA = info.amount.toNumber();
//     info = await HGEN.getAccountInfo(tokenAccountHGEN);
//     currentSwapTokenB = info.amount.toNumber();
// }

export async function swap(
    wallet: Wallet,
    connection: Connection,
    tokenSwapAccount: PublicKey,
    // authority: PublicKey,
    lp_tokens: PublicKey,
    ownertokenAccountPool: PublicKey,
    poolTokenAccountA: PublicKey,
    poolTokenAccountB: PublicKey,
    tokenAMintAddr: PublicKey,
    tokenBMintAddr: PublicKey,
    hostFeeAccount: PublicKey,
    amount: number,
    slippagePrice: number,
): Promise<void> {
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
        AccountLayout.span
    );

    const signers: Account[] = [];
    const instructions: TransactionInstruction[] = [];
    connection = await getConnection();

    [authority, bumpSeed] = await PublicKey.findProgramAddress(
        [tokenSwapAccount.toBuffer()],
        TOKEN_SWAP_PROGRAM_ID,
    );
    SWAP_AMOUNT_IN = amount;
    // SWAP_AMOUNT_OUT = SWAP_PROGRAM_OWNER_FEE_ADDRESS ? slippagePrice : slippagePrice; // TODO add the fee later with the slipapge price
    SWAP_AMOUNT_OUT = slippagePrice;
    let tokenAATA;
    let tokenBATA;
    try {
        // check if the token is for native (SOL)
        if (tokenAMintAddr.toBase58() == WSOL_ADDR.toBase58()) {

            tokenAATA = await getWrappedAccount(wallet, amount * 1e7 + accountRentExempt, wallet.publicKey, instructions, signers);
            SWAP_AMOUNT_IN = amount * 1e7
            console.log(tokenAATA.toBase58(), "tokenA ata")
        }
        else {
            let check_A = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                mint: tokenAMintAddr,
            });
            tokenAATA = check_A.value[0] ? check_A.value[0].pubkey.toBase58() : "";
            tokenAATA = new PublicKey(tokenAATA);
            console.log(tokenAATA.toBase58(), "tokenA ata")
            console.log(tokenAMintAddr, "tokenAMintAddr")
        }
        if (tokenBMintAddr.toBase58() == WSOL_ADDR.toBase58()) {
            tokenBATA = await getWrappedAccount(wallet, accountRentExempt, wallet.publicKey, instructions, signers);
            console.log(tokenBATA.toBase58(), "tokenB ata")
        }
        else {
            let check_B = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
                mint: tokenBMintAddr,
            });
            tokenBATA = check_B.value[0] ? check_B.value[0].pubkey.toBase58() : "";
            tokenBATA = new PublicKey(tokenBATA);
            console.log(tokenBATA.toBase58(), "tokenB ata")
        }

    } catch (err) {
        console.log(err, "account mint token error")
    }


    let userTransferAuthority;
    let checkWsolAccount = false;
    try {
        console.log('Creating swap token GENS account');
        // TODO only for testing
        // change it for testing
        // let userAccountGENS = await GENS.createAccount(wallet.publicKey);
        // await GENS.mintTo(userAccountGENS, owner, [], SWAP_AMOUNT_IN);
        userTransferAuthority = wallet.publicKey;   // new Account();

        // TODO only for testing
        // await GENS.approve(
        //     userAccountGENS,
        //     userTransferAuthority,
        //     owner,
        //     [],
        //     SWAP_AMOUNT_IN,
        // );
        // console.log('Creating swap token HGEN account');

        // if (tokenAATA == "")
        //     userAccountGENS = await GENS.createAccount(wallet.publicKey);
        //TODO: only for testing
        // let userAccountHGEN = await HGEN.createAccount(wallet.publicKey);

        let check_pool_token = await connection.getParsedTokenAccountsByOwner(owner.publicKey, {
            mint: lp_tokens,
        });
        console.log("pool token", check_pool_token.value[0].pubkey.toBase58())
        let poolATA = check_pool_token.value[0] ? check_pool_token.value[0].pubkey.toBase58() : "";

        console.log("get pool ATA", poolATA)

        let poolAccount = SWAP_PROGRAM_OWNER_FEE_ADDRESS && !poolATA
            ? await tokenPool.createAccount(owner.publicKey)
            : ownertokenAccountPool
        // : null; only for testing 

        // Get token swap amount value at this moment
        // Calculating for constant product curve x * y = k(variant)
        // For swap A->B, (token_a_amount + swap_a_amount) * (token_b_amount - swap_b_amount) = invariant
        let swapAmountA = await (await getAccountInfo(connection, poolTokenAccountA)).info.amount;
        // TODO: remove this later
        if (tokenAMintAddr.toBase58() == WSOL_ADDR.toBase58()) {
            swapAmountA = new BN(swapAmountA).div(new BN(10000000))
        }
        let swapAmountB = await (await getAccountInfo(connection, poolTokenAccountB)).info.amount;
        if (tokenBMintAddr.toBase58() == WSOL_ADDR.toBase58()) {
            swapAmountB = new BN(swapAmountB).div(new BN(10000000))
            checkWsolAccount = true;
        }
        console.log(swapAmountA.toNumber(), swapAmountB.toNumber(), "swap values")

        let invariant = new BN(swapAmountA).mul(new BN(swapAmountB));
        let numerator = invariant;
        let denominator = new BN(swapAmountA).add(new BN(SWAP_AMOUNT_IN));
        console.log(denominator.toNumber(), "denom value")

        // new swap price for the token A->B
        let swapTokenB = new BN(swapAmountB).sub(numerator.div(denominator));
        console.log(swapTokenB.toString(), 'swap value for token B');

        // swaptokenB with fees
        let trade_fees = new BN(25).mul(new BN(swapTokenB)).div(new BN(10000));
        let owner_fees = new BN(5).mul(new BN(swapTokenB)).div(new BN(10000));
        let swap_fees = trade_fees.add(owner_fees);
        let swapTokenBWithFees = swapTokenB.sub(swap_fees);
    } catch (err) {
        console.error(err, "swap setup error")
    }

    console.log('Swapping');
    console.log(SWAP_AMOUNT_IN, "swap amount in")
    console.log(tokenSwapAccount.toBase58(), "token swap account")
    let swap;
    if (tokenBATA == "") {
        tokenBATA = await Token.getAssociatedTokenAddress(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            tokenBMintAddr, // mint
            wallet.publicKey // owner
        );

        const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
            TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
            tokenBMintAddr, // mint
            tokenBATA, // ata
            wallet.publicKey, // owner of token account
            wallet.publicKey // fee payer
        )

        instructions.push(ataAccountTx);

        try {

            swap = await TokenSwap.swap(
                wallet,
                connection,
                tokenSwapAccount,
                authority,
                tokenAATA,
                poolTokenAccountA,
                poolTokenAccountB,
                tokenBATA,
                lp_tokens,
                ownertokenAccountPool,
                hostFeeAccount,
                userTransferAuthority,
                SWAP_AMOUNT_IN,
                SWAP_AMOUNT_OUT,
                checkWsolAccount,
                signers,
                instructions
            );
        } catch (err) {
            console.error(err, "swap error")
        }

    }
    else {
        try {


            console.log(instructions)

            swap = await TokenSwap.swap(
                wallet,
                connection,
                tokenSwapAccount,
                authority,
                (tokenAATA),
                poolTokenAccountA,
                poolTokenAccountB,
                (tokenBATA),
                lp_tokens,
                ownertokenAccountPool,
                hostFeeAccount,
                userTransferAuthority,
                SWAP_AMOUNT_IN,
                SWAP_AMOUNT_OUT,
                checkWsolAccount,
                signers,
                instructions
            );
        } catch (err) {
            console.error(err, "swap error")
        }
    }
    console.log('loading token swap');
    let testTokenSwap = await TokenSwap.loadTokenSwap(
        connection,
        tokenSwapAccount,
        TOKEN_SWAP_PROGRAM_ID,
        wallet.publicKey,
    );
    console.log("**************************************", testTokenSwap.tokenAccountA.toBase58());
    console.log(testTokenSwap.tokenAccountB.toBase58());
    console.log(testTokenSwap.mintA.toBase58());
    console.log(testTokenSwap.mintB.toBase58());
    console.log(testTokenSwap.poolToken.toBase58());
    console.log(testTokenSwap.feeAccount.toBase58());
    console.log(
        testTokenSwap.tradeFeeNumerator.toNumber(),
    );
    console.log(
        testTokenSwap.tradeFeeDenominator.toNumber(),
    );

    return swap;

    // TODO: for testing only
    // await sleep(500);

    // let info;
    // info = await GENS.getAccountInfo(userAccountGENS);
    // assert(info.amount.toNumber() == 0);

    // info = await HGEN.getAccountInfo(userAccountHGEN);
    // assert(info.amount.toNumber() == SWAP_AMOUNT_OUT);

    // info = await GENS.getAccountInfo(tokenAccountGENS);
    // assert(info.amount.toNumber() == currentSwapTokenA + SWAP_AMOUNT_IN);
    // currentSwapTokenA += SWAP_AMOUNT_IN;

    // info = await HGEN.getAccountInfo(tokenAccountHGEN);
    // assert(info.amount.toNumber() == currentSwapTokenB - SWAP_AMOUNT_OUT);
    // currentSwapTokenB -= SWAP_AMOUNT_OUT;

    // info = await tokenPool.getAccountInfo(tokenAccountPool);
    // assert(
    //     info.amount.toNumber() == DEFAULT_POOL_TOKEN_AMOUNT - POOL_TOKEN_AMOUNT,
    // );

    // info = await tokenPool.getAccountInfo(feeAccount);
    // assert(info.amount.toNumber() == currentFeeAmount + OWNER_SWAP_FEE);

    // if (poolAccount != null) {
    //     info = await tokenPool.getAccountInfo(poolAccount);
    //     assert(info.amount.toNumber() == HOST_SWAP_FEE);
    // }
}

function tradingTokensToPoolTokens(
    sourceAmount: number,
    swapSourceAmount: number,
    poolAmount: number,
): number {
    const tradingFee =
        (sourceAmount / 2) * (TRADING_FEE_NUMERATOR / TRADING_FEE_DENOMINATOR);
    const sourceAmountPostFee = sourceAmount - tradingFee;
    const root = Math.sqrt(sourceAmountPostFee / swapSourceAmount + 1);
    return Math.floor(poolAmount * (root - 1));
}

export async function depositSingleTokenTypeExactAmountIn(
    wallet: Wallet
): Promise<void> {
    // Pool token amount to deposit on one side
    const depositAmount = 10000;

    const poolMintInfo = await tokenPool.getMintInfo();
    const supply = poolMintInfo.supply.toNumber();
    const swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    const poolTokenA = tradingTokensToPoolTokens(
        depositAmount,
        swapTokenA.amount.toNumber(),
        supply,
    );
    const swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);
    const poolTokenB = tradingTokensToPoolTokens(
        depositAmount,
        swapTokenB.amount.toNumber(),
        supply,
    );

    const userTransferAuthority = new Account();
    console.log('Creating depositor token GENS account');
    const userAccountGENS = await GENS.createAccount(owner.publicKey);
    await GENS.mintTo(userAccountGENS, owner, [], depositAmount);
    await GENS.approve(
        userAccountGENS,
        userTransferAuthority.publicKey,
        owner,
        [],
        depositAmount,
    );
    console.log('Creating depositor token HGEN account');
    const userAccountHGEN = await HGEN.createAccount(owner.publicKey);
    await HGEN.mintTo(userAccountHGEN, owner, [], depositAmount);
    await HGEN.approve(
        userAccountHGEN,
        userTransferAuthority.publicKey,
        owner,
        [],
        depositAmount,
    );
    console.log('Creating depositor pool token account');
    const newAccountPool = await tokenPool.createAccount(owner.publicKey);

    console.log('Depositing token GENS into swap');
    await tokenSwap.depositSingleTokenTypeExactAmountIn(
        wallet,
        userAccountGENS,
        newAccountPool,
        userTransferAuthority,
        depositAmount,
        poolTokenA,
    );

    let info;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == 0);
    info = await GENS.getAccountInfo(tokenAccountGENS);
    assert(info.amount.toNumber() == currentSwapTokenA + depositAmount);
    currentSwapTokenA += depositAmount;

    console.log('Depositing token HGEN into swap');
    await tokenSwap.depositSingleTokenTypeExactAmountIn(
        wallet,
        userAccountHGEN,
        newAccountPool,
        userTransferAuthority,
        depositAmount,
        poolTokenB,
    );

    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == 0);
    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    assert(info.amount.toNumber() == currentSwapTokenB + depositAmount);
    currentSwapTokenB += depositAmount;
    info = await tokenPool.getAccountInfo(newAccountPool);
    assert(info.amount.toNumber() >= poolTokenA + poolTokenB);
}

export async function withdrawSingleTokenTypeExactAmountOut(
    payer: Wallet
): Promise<void> {
    // Pool token amount to withdraw on one side
    const withdrawAmount = 50000;
    const roundingAmount = 1.0001; // make math a little easier

    const poolMintInfo = await tokenPool.getMintInfo();
    const supply = poolMintInfo.supply.toNumber();

    const swapTokenA = await GENS.getAccountInfo(tokenAccountGENS);
    const swapTokenAPost = swapTokenA.amount.toNumber() - withdrawAmount;
    const poolTokenA = tradingTokensToPoolTokens(
        withdrawAmount,
        swapTokenAPost,
        supply,
    );
    let adjustedPoolTokenA = poolTokenA * roundingAmount;
    if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
        adjustedPoolTokenA *=
            1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;
    }

    const swapTokenB = await HGEN.getAccountInfo(tokenAccountHGEN);
    const swapTokenBPost = swapTokenB.amount.toNumber() - withdrawAmount;
    const poolTokenB = tradingTokensToPoolTokens(
        withdrawAmount,
        swapTokenBPost,
        supply,
    );
    let adjustedPoolTokenB = poolTokenB * roundingAmount;
    if (OWNER_WITHDRAW_FEE_NUMERATOR !== 0) {
        adjustedPoolTokenB *=
            1 + OWNER_WITHDRAW_FEE_NUMERATOR / OWNER_WITHDRAW_FEE_DENOMINATOR;
    }

    const userTransferAuthority = new Account();
    console.log('Creating withdraw token GENS account');
    const userAccountGENS = await GENS.createAccount(owner.publicKey);
    console.log('Creating withdraw token HGEN account');
    const userAccountHGEN = await GENS.createAccount(owner.publicKey);
    console.log('Creating withdraw pool token account');
    const poolAccount = await tokenPool.getAccountInfo(tokenAccountPool);
    const poolTokenAmount = poolAccount.amount.toNumber();
    await tokenPool.approve(
        tokenAccountPool,
        userTransferAuthority.publicKey,
        owner,
        [],
        adjustedPoolTokenA + adjustedPoolTokenB,
    );

    console.log('Withdrawing token A only');
    await tokenSwap.withdrawSingleTokenTypeExactAmountOut(
        payer,
        userAccountGENS,
        tokenAccountPool,
        userTransferAuthority,
        withdrawAmount,
        adjustedPoolTokenA,
    );

    let info;
    info = await GENS.getAccountInfo(userAccountGENS);
    assert(info.amount.toNumber() == withdrawAmount);
    info = await GENS.getAccountInfo(tokenAccountGENS);
    assert(info.amount.toNumber() == currentSwapTokenA - withdrawAmount);
    currentSwapTokenA += withdrawAmount;
    info = await tokenPool.getAccountInfo(tokenAccountPool);
    assert(info.amount.toNumber() >= poolTokenAmount - adjustedPoolTokenA);

    console.log('Withdrawing token B only');
    await tokenSwap.withdrawSingleTokenTypeExactAmountOut(
        payer,
        userAccountHGEN,
        tokenAccountPool,
        userTransferAuthority,
        withdrawAmount,
        adjustedPoolTokenB,
    );

    info = await HGEN.getAccountInfo(userAccountHGEN);
    assert(info.amount.toNumber() == withdrawAmount);
    info = await HGEN.getAccountInfo(tokenAccountHGEN);
    assert(info.amount.toNumber() == currentSwapTokenB - withdrawAmount);
    currentSwapTokenB += withdrawAmount;
    info = await tokenPool.getAccountInfo(tokenAccountPool);
    assert(
        info.amount.toNumber() >=
        poolTokenAmount - adjustedPoolTokenA - adjustedPoolTokenB,
    );
}
