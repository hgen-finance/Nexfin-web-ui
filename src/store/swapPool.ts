// Import Typed
import { getterTree, mutationTree, actionTree } from "typed-vuex";
import { ManagerAppDepInstallRequired } from '@ledgerhq/errors';
import {
    addToken,
    createTokenSwap,
    swap,
    depositAllTokenTypes,
    withdrawAllTokenTypes,
    depositSingleTokenTypeExactAmountIn,
    withdrawSingleTokenTypeExactAmountOut,
} from '@/utils/swapPool'

import { TOKEN_A_MINT_ADDR, TOKEN_B_MINT_ADDR, POOL_AUTHORITY, TOKEN_ACC_A, TOKEN_ACC_B, LP_TOKENS_HGEN_GENS, WSOL_ADDR, LP_POOL_OWNER, TOKEN_SWAP_ACCOUNT, POOL_AUTHORITY_GS, TOKEN_ACC_GENS_GS, TOKEN_ACC_SOL_GS, POOL_AUTHORITY_HS, TOKEN_ACC_HGEN_HS, TOKEN_ACC_SOL_HS, LP_TOKENS_GS, TOKEN_SWAP_HGEN_SOL_ACCOUNT, LP_TOKENS_HS, TOKEN_SWAP_GEN_SOL_ACCOUNT } from '@/utils/layout';
import { CurveType, Numberu64 } from '@/utils/tokenSwap';
import { Pool } from '@/store/interfaces/poolInterface';

import { Account, AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import { WRAPPED_SOL_MINT } from "@/utils/ids";
import { AccountLayout, u64, MintInfo, MintLayout, Token } from "@solana/spl-token";
import { TokenAccount, PoolInfo } from "./../models";
import { EventEmitter } from "@/utils/eventEmitter";

import * as bs58 from "bs58";


const accountEmitter = new EventEmitter();

export interface ParsedAccountBase {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
    info: any; // TODO: change to unkown
}

export interface ParsedAccount<T> extends ParsedAccountBase {
    info: T;
}

const pendingMintCalls = new Map<string, Promise<MintInfo>>();
const mintCache = new Map<string, MintInfo>();
const pendingAccountCalls = new Map<string, Promise<TokenAccount>>();
const accountsCache = new Map<string, TokenAccount>();

const pendingCalls = new Map<string, Promise<ParsedAccountBase>>();
const genericCache = new Map<string, ParsedAccountBase>();

// const getAccountInfo = async (connection: Connection, pubKey: PublicKey) => {
//     const info = await connection.getAccountInfo(pubKey);
//     if (info === null) {
//         throw new Error("Failed to find account");
//     }

//     return tokenAccountFactory(pubKey, info);
// };

// const getMintInfo = async (connection: Connection, pubKey: PublicKey) => {
//     const info = await connection.getAccountInfo(pubKey);
//     if (info === null) {
//         throw new Error("Failed to find mint account");
//     }

//     const data = Buffer.from(info.data);

//     return deserializeMint(data);
// };

export type AccountParser = (
    pubkey: PublicKey,
    data: AccountInfo<Buffer>
) => ParsedAccountBase;
export const MintParser = (pubKey: PublicKey, info: AccountInfo<Buffer>) => {
    const buffer = Buffer.from(info.data);

    const data = deserializeMint(buffer);

    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: data,
    } as ParsedAccountBase;

    return details;
};

export const TokenAccountParser = tokenAccountFactory;

export const GenericAccountParser = (
    pubKey: PublicKey,
    info: AccountInfo<Buffer>
) => {
    const buffer = Buffer.from(info.data);

    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: buffer,
    } as ParsedAccountBase;

    return details;
};

export const keyToAccountParser = new Map<string, AccountParser>();

export const cache = {
    query: async (
        connection: Connection,
        pubKey: string | PublicKey,
        parser?: AccountParser
    ) => {
        let id: PublicKey;
        if (typeof pubKey === "string") {
            id = new PublicKey(pubKey);
        } else {
            id = pubKey;
        }

        const address = id.toBase58();

        let account = genericCache.get(address);
        if (account) {
            return account;
        }

        let query = pendingCalls.get(address);
        if (query) {
            return query;
        }

        query = connection.getAccountInfo(id).then((data) => {
            if (!data) {
                throw new Error("Account not found");
            }

            return cache.add(id, data, parser);
        }) as Promise<TokenAccount>;
        pendingCalls.set(address, query as any);

        return query;
    },
    add: (id: PublicKey, obj: AccountInfo<Buffer>, parser?: AccountParser) => {
        const address = id.toBase58();
        const deserialize = parser ? parser : keyToAccountParser.get(address);
        if (!deserialize) {
            throw new Error(
                "Deserializer needs to be registered or passed as a parameter"
            );
        }

        cache.registerParser(id, deserialize);
        pendingCalls.delete(address);
        const account = deserialize(id, obj);
        genericCache.set(address, account);
        return account;
    },
    get: (pubKey: string | PublicKey) => {
        let key: string;
        if (typeof pubKey !== "string") {
            key = pubKey.toBase58();
        } else {
            key = pubKey;
        }

        return genericCache.get(key);
    },
    registerParser: (pubkey: PublicKey, parser: AccountParser) => {
        keyToAccountParser.set(pubkey.toBase58(), parser);
    },

    queryAccount: async (connection: Connection, pubKey: string | PublicKey) => {
        let id: PublicKey;
        if (typeof pubKey === "string") {
            id = new PublicKey(pubKey);
        } else {
            id = pubKey;
        }

        const address = id.toBase58();

        let account = accountsCache.get(address);
        if (account) {
            return account;
        }

        let query = pendingAccountCalls.get(address);
        if (query) {
            return query;
        }

        query = getAccountInfo(connection, id).then((data) => {
            pendingAccountCalls.delete(address);
            accountsCache.set(address, data);
            return data;
        }) as Promise<TokenAccount>;
        pendingAccountCalls.set(address, query as any);

        return query;
    },
    addAccount: (pubKey: PublicKey, obj: AccountInfo<Buffer>) => {
        const account = tokenAccountFactory(pubKey, obj);
        accountsCache.set(account.pubkey.toBase58(), account);
        return account;
    },
    deleteAccount: (pubkey: PublicKey) => {
        const id = pubkey?.toBase58();
        accountsCache.delete(id);
        accountEmitter.raiseAccountUpdated(id);
    },
    getAccount: (pubKey: string | PublicKey) => {
        let key: string;
        if (typeof pubKey !== "string") {
            key = pubKey.toBase58();
        } else {
            key = pubKey;
        }

        return accountsCache.get(key);
    },
    queryMint: async (connection: Connection, pubKey: string | PublicKey) => {
        let id: PublicKey;
        if (typeof pubKey === "string") {
            id = new PublicKey(pubKey);
        } else {
            id = pubKey;
        }

        const address = id.toBase58();
        let mint = mintCache.get(address);
        if (mint) {
            return mint;
        }

        let query = pendingMintCalls.get(address);
        if (query) {
            return query;
        }

        query = getMintInfo(connection, id).then((data) => {
            pendingAccountCalls.delete(address);

            mintCache.set(address, data);
            return data;
        }) as Promise<MintInfo>;
        pendingAccountCalls.set(address, query as any);

        return query;
    },
    getMint: (pubKey: string | PublicKey | undefined) => {
        if (!pubKey) {
            return;
        }

        let key: string;
        if (typeof pubKey !== "string") {
            key = pubKey.toBase58();
        } else {
            key = pubKey;
        }

        return mintCache.get(key);
    },
    addMint: (pubKey: PublicKey, obj: AccountInfo<Buffer>) => {
        const mint = deserializeMint(obj.data);
        const id = pubKey.toBase58();
        mintCache.set(id, mint);
        return mint;
    },
};

export const getCachedAccount = (
    predicate: (account: TokenAccount) => boolean
) => {
    for (const account of accountsCache.values()) {
        if (predicate(account)) {
            return account as TokenAccount;
        }
    }
};

export const wrapNativeAccount = (
    pubkey: PublicKey,
    address: PublicKey,
    account?: AccountInfo<Buffer>,
): TokenAccount | undefined => {
    if (!account) {
        return undefined;
    }

    return {
        pubkey: pubkey,
        account,
        info: {
            address,
            mint: WRAPPED_SOL_MINT,
            owner: pubkey,
            amount: new u64(account.lamports),
            delegate: null,
            delegatedAmount: new u64(0),
            isInitialized: true,
            isFrozen: false,
            isNative: true,
            rentExemptReserve: null,
            closeAuthority: null,
        },
    };
}

const PRECACHED_OWNERS = new Set<string>();
const precacheUserTokenAccounts = async (
    connection: Connection,
    owner?: PublicKey
) => {
    if (!owner) {
        return;
    }

    // used for filtering account updates over websocket
    PRECACHED_OWNERS.add(owner.toBase58());

    // user accounts are update via ws subscription
    const accounts = await connection.getTokenAccountsByOwner(owner, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    });

    accounts.value
        .map((info) => {
            const data = deserializeAccount(info.account.data);
            // TODO: move to web3.js for decoding on the client side... maybe with callback
            const details = {
                pubkey: info.pubkey,
                account: {
                    ...info.account,
                },
                info: data,
            } as TokenAccount;

            return details;
        })
        .forEach((acc) => {
            accountsCache.set(acc.pubkey.toBase58(), acc);
        });
};

const deserializeAccount = (data: Buffer) => {
    const accountInfo = AccountLayout.decode(data);
    accountInfo.mint = new PublicKey(accountInfo.mint);
    accountInfo.owner = new PublicKey(accountInfo.owner);
    accountInfo.amount = u64.fromBuffer(accountInfo.amount);

    if (accountInfo.delegateOption === 0) {
        accountInfo.delegate = null;
        accountInfo.delegatedAmount = new u64(0);
    } else {
        accountInfo.delegate = new PublicKey(accountInfo.delegate);
        accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
    }

    accountInfo.isInitialized = accountInfo.state !== 0;
    accountInfo.isFrozen = accountInfo.state === 2;

    if (accountInfo.isNativeOption === 1) {
        accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
        accountInfo.isNative = true;
    } else {
        accountInfo.rentExemptReserve = null;
        accountInfo.isNative = false;
    }

    if (accountInfo.closeAuthorityOption === 0) {
        accountInfo.closeAuthority = null;
    } else {
        accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
    }

    return accountInfo;
};

const deserializeMint = (data: Buffer) => {
    if (data.length !== MintLayout.span) {
        throw new Error("Not a valid Mint");
    }

    const mintInfo = MintLayout.decode(data);

    if (mintInfo.mintAuthorityOption === 0) {
        mintInfo.mintAuthority = null;
    } else {
        mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
    }

    mintInfo.supply = u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized !== 0;

    if (mintInfo.freezeAuthorityOption === 0) {
        mintInfo.freezeAuthority = null;
    } else {
        mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
    }

    return mintInfo as MintInfo;
};

function tokenAccountFactory(pubKey: PublicKey, info: AccountInfo<Buffer>) {
    const buffer = Buffer.from(info.data);

    const data = deserializeAccount(buffer);

    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: data,
    } as TokenAccount;

    return details;
}


import { getMintInfo, getAccountInfo } from "@/utils/accounts";

// State
export const state = () => ({
    pools: [],
    poolInfo: {},
    tokenAmountA: 0,
    tokenAmountB: 0,
    tokenAmountGensGS: 0,
    tokenAmountSOLGS: 0,
    tokenAmountHgenHS: 0,
    tokenAmountSOLHS: 0,
    withdrawOrDeposit: true,
    nativeAccount: null,
    tokenAccounts: [],
    userAccounts: [],
    gensHgenLPsupply: 0,
    hgenSolLPsupply: 0,
    gensSolLPsupply: 0,
    loading: false,
    clearTime: 3000,
});

// Getters
export const getters = getterTree(state, {});

// Mutation
export const mutations = mutationTree(state, {
    setPool(state, newValue: Pool) {
        state.poolInfo = newValue;
    },
    setTokenAmountA(state, newValue: number) {
        state.tokenAmountA = newValue;
    },
    setTokenAmountB(state, newValue: number) {
        state.tokenAmountB = newValue;
    },

    setTokenAmountGensGS(state, newValue: number) {
        state.tokenAmountGensGS = newValue;
    },

    setTokenAmountSOLGS(state, newValue: number) {
        state.tokenAmountSOLGS = newValue;
    },

    setTokenAmountHgenHS(state, newValue: number) {
        state.tokenAmountHgenHS = newValue;
    },

    setTokenAmountSOLHS(state, newValue: number) {
        state.tokenAmountSOLHS = newValue;
    },

    setLiquidityState(state, newValue: boolean) {
        state.withdrawOrDeposit = newValue;
    },
    setNativeAccount(state, newValue: AccountInfo<Buffer>) {
        state.nativeAccount = newValue;
    },
    setTokenAccounts(state, newValue: TokenAccount[]) {
        state.tokenAccounts = newValue;
    },
    setUserAccounts(state, newValue: TokenAccount[]) {
        state.userAccounts = newValue;
    },

    setLoading(state, newValue: boolean) {
        state.loading = newValue;
    }

});

// Actions
export const actions = actionTree(
    { state, getters, mutations },
    {

        useNativeAccount({ commit, state }, value) {
            if (!this.$web3 || !this.$wallet?.publicKey) {
                return;
            }
            this.$web3.getAccountInfo(this.$wallet.publicKey).then(acc => {
                if (acc) {
                    commit("setNativeAccount", acc);
                }
            })

            this.$web3.onAccountChange(this.$wallet.publicKey, (acc) => {
                if (acc) {
                    commit("setNativeAccount", acc);
                }
            })

            const account = wrapNativeAccount(this.$wallet?.publicKey, state.nativeAccount);
            if (!account) {
                return;
            }
            accountsCache.set(account.pubkey.toBase58(), account);
        },

        // change liquiditity state
        async changeLiquidityState({ commit, dispatch, state }, value) {
            commit('setLiquidityState', value);
        },

        // Create token pool
        async createTokenSwapPool({ commit, dispatch, state }) {
            console.log(
                'CreateTokenSwap (constant product)',
            );
            let poolInfo: Pool = await createTokenSwap(CurveType.ConstantProduct, this.$wallet);
            // commit('setPool', poolInfo);
            // commit('setTokenAmountA', poolInfo.tokenAmountA / 100); // 2 decimal 
            // commit('setTokenAmountB', poolInfo.tokenAmountB / 100); // 2 decimal 
            // dispatch("onTokenAChange", { authority: poolInfo.authority, tokenAccountA: poolInfo.tokenAccountA, tokenAMintAddr: poolInfo.tokenAMintAddr });
            // dispatch("onTokenBChange", { authority: poolInfo.authority, tokenAccountB: poolInfo.tokenAccountB, tokenBMintAddr: poolInfo.tokenBMintAddr });
        },

        // Add liquidity
        async depositAllToken({ commit, state }, value) {
            console.log('add liquidity for all token types');
            let tokenSwapAccount;
            // if (value.tokenType == "HG") {
            //     try {
            //         tokenSwapAccount = new Account([71, 29, 9, 134, 253, 202, 211, 116, 196, 165, 151, 138, 46, 7, 99, 248, 233, 247, 175, 85, 236, 46, 230, 12, 88, 81, 175, 18, 236, 220, 192, 244, 52, 114, 171, 93, 94, 29, 33, 249, 39, 180, 91, 249, 67, 223, 69, 72, 155, 180, 170, 127, 88, 137, 220, 75, 29, 191, 203, 35, 176, 62, 63, 43]);
            //     } catch (err) {
            //         console.error(err, "Account creation error");
            //     }
            // }


            tokenSwapAccount = TOKEN_SWAP_HGEN_SOL_ACCOUNT;


            try {
                await depositAllTokenTypes(this.$wallet, tokenSwapAccount, value.tokenLP, value.tokenAacc, value.tokenBacc, value.tokenAMintAddr, value.tokenBMintAddr, value.from, value.to);
            } catch (err) {
                console.error(err, "Deposit error");
            }
            this.$accessor.wallet.getBalance();
            this.$accessor.wallet.getGENSBalance();
            this.$accessor.wallet.getHGENBalance();
            this.$accessor.liquidity.getLpTokens();
        },

        // Remove Liquidity
        async withdrawToken({ commit, state }, value) {
            // console.log(value.tokenLP, value.tokenAacc, value.tokenBacc, value.tokenAMintAddr, "after", value.tokenBMintAddr, value.from, "testing........");
            let tokenSwapAccount;
            let feeAccount;
            let ownerTokenPoolAccount;
            if (value.tokenType == "HS") {
                try {
                    tokenSwapAccount = TOKEN_SWAP_HGEN_SOL_ACCOUNT;
                    let LP_TOKEN = await this.$web3.getParsedTokenAccountsByOwner(this.$wallet.publicKey, {
                        mint: LP_TOKENS_HS,
                    });
                    let tokenATA = LP_TOKEN.value[0] ? LP_TOKEN.value[0].pubkey.toBase58() : "";
                    console.log(tokenATA, "tokenATA")

                    let LP_TOKEN_FEE = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_HS,
                    });
                    console.log(LP_TOKEN_FEE, "owner")
                    let tokenATAFee = LP_TOKEN_FEE.value[0] ? LP_TOKEN_FEE.value[0].pubkey.toBase58() : "";
                    console.log(tokenATAFee, "tokenATAFee")

                    feeAccount = new PublicKey(tokenATAFee);
                    ownerTokenPoolAccount = new PublicKey(tokenATA);
                } catch (err) {
                    console.error(err, "Account creation error");
                }
            }

            await withdrawAllTokenTypes(this.$wallet, tokenSwapAccount, value.tokenLP, ownerTokenPoolAccount, value.tokenAacc, value.tokenBacc, value.tokenAMintAddr, value.tokenBMintAddr, value.from, feeAccount);
            this.$accessor.wallet.getBalance();
            this.$accessor.wallet.getGENSBalance();
            this.$accessor.wallet.getHGENBalance();
            this.$accessor.liquidity.getLpTokens();
        },

        // swap tokens for the pool
        async swap({ state, commit }, value) {
            console.log('swapping');
            let ownerTokenPoolAccount;
            let tokenSwapAccount;
            let hostFeeAccount;
            let swapTx;
            if (value.tokenType == "GH") {
                tokenSwapAccount = TOKEN_SWAP_ACCOUNT

                try {

                    commit("setLoading", true);
                    let LP_TOKEN = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_HGEN_GENS,
                    });
                    let tokenATA = LP_TOKEN.value[0] ? LP_TOKEN.value[0].pubkey.toBase58() : "";

                    let LP_TOKEN_FEE = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_HGEN_GENS,
                    });
                    let tokenATAFee = LP_TOKEN_FEE.value[0] ? LP_TOKEN_FEE.value[0].pubkey.toBase58() : "";

                    ownerTokenPoolAccount = new PublicKey(tokenATA);
                    hostFeeAccount = new PublicKey(tokenATAFee);


                    swapTx = await swap(this.$wallet, this.$web3, tokenSwapAccount, value.tokenLP, ownerTokenPoolAccount, value.tokenAacc, value.tokenBacc, value.tokenAMintAddr, value.tokenBMintAddr, hostFeeAccount, value.from, value.slippagePrice);
                    this.$accessor.wallet.getBalance();
                    this.$accessor.wallet.getGENSBalance();
                    this.$accessor.wallet.getHGENBalance();

                    commit("setLoading", false);
                    console.log(swapTx, "txId..")
                    // pass wait transaction notification

                    if (swapTx) {
                        this.$accessor.notification.notify({
                            title: "Transaction sent",
                            description: "Transaction Successful",
                            type: "confirm",
                            txId: swapTx
                        });
                    }

                } catch (err) {
                    console.error(err, "gens-hgen Account error")
                }
            }
            if (value.tokenType == "GS") {
                tokenSwapAccount = TOKEN_SWAP_GEN_SOL_ACCOUNT;
                console.log(tokenSwapAccount.toBase58(), "gens sol token swap account")
                try {
                    commit("setLoading", true);
                    let LP_TOKEN = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_GS,
                    });
                    let tokenATA = LP_TOKEN.value[0] ? LP_TOKEN.value[0].pubkey.toBase58() : "";
                    let LP_TOKEN_FEE = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_GS,
                    });
                    let tokenATAFee = LP_TOKEN_FEE.value[0] ? LP_TOKEN_FEE.value[0].pubkey.toBase58() : "";
                    ownerTokenPoolAccount = new PublicKey(tokenATA);
                    hostFeeAccount = new PublicKey(tokenATAFee);

                    swapTx = await swap(this.$wallet, this.$web3, tokenSwapAccount, value.tokenLP, ownerTokenPoolAccount, value.tokenAacc, value.tokenBacc, new PublicKey(value.tokenAMintAddr), new PublicKey(value.tokenBMintAddr), hostFeeAccount, value.from, value.slippagePrice);
                    this.$accessor.wallet.getBalance();
                    this.$accessor.wallet.getGENSBalance();
                    this.$accessor.wallet.getHGENBalance();
                    commit("setLoading", false);
                    if (swapTx) {
                        this.$accessor.notification.notify({
                            title: "Transaction sent",
                            description: "Transaction Successful",
                            type: "confirm",
                            txId: swapTx,
                        });
                    }

                } catch (err) {
                    console.error(err, "Gens-Sol account error")
                }
            }
            if (value.tokenType == "HS") {
                tokenSwapAccount = TOKEN_SWAP_HGEN_SOL_ACCOUNT;
                console.log(tokenSwapAccount.toBase58(), "hgen sol token swap account")

                try {
                    commit("setLoading", true);
                    let LP_TOKEN = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_HS,
                    });
                    let tokenATA = LP_TOKEN.value[0] ? LP_TOKEN.value[0].pubkey.toBase58() : "";
                    let LP_TOKEN_FEE = await this.$web3.getParsedTokenAccountsByOwner(new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t"), {
                        mint: LP_TOKENS_HS,
                    });
                    let tokenATAFee = LP_TOKEN_FEE.value[0] ? LP_TOKEN_FEE.value[0].pubkey.toBase58() : "";
                    ownerTokenPoolAccount = new PublicKey(tokenATA);
                    hostFeeAccount = new PublicKey(tokenATAFee);
                    swapTx = await swap(this.$wallet, this.$web3, tokenSwapAccount, value.tokenLP, ownerTokenPoolAccount, value.tokenAacc, value.tokenBacc, new PublicKey(value.tokenAMintAddr), new PublicKey(value.tokenBMintAddr), hostFeeAccount, value.from, value.slippagePrice);

                    this.$accessor.wallet.getBalance();
                    this.$accessor.wallet.getGENSBalance();
                    this.$accessor.wallet.getHGENBalance();
                    commit("setLoading", false);

                    if (swapTx) {
                        this.$accessor.notification.notify({
                            title: "Transaction sent",
                            description: "Transaction Successful",
                            type: "confirm",
                            txId: swapTx
                        });
                    }
                    return;
                } catch (err) {
                    console.error(err, "Gens-Sol account error")
                }
            }
        },

        // for adding gens and hgen tokens
        async addToken() {
            console.log("Adding GENS and HGENS")
            await addToken(this.$wallet)
        },

        // getting info for pool token A
        async getTokenAInfo({ state, commit }, value) {
            let tokenA = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY, { mint: TOKEN_A_MINT_ADDR });
            let result: number = tokenA.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountA', result);

            tokenA = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY_GS, { mint: TOKEN_A_MINT_ADDR });
            result = tokenA.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountGensGS', result);

            tokenA = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY_HS, { mint: TOKEN_B_MINT_ADDR });
            result = tokenA.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountHgenHS', result);
        },

        // getting info for pool token B
        // TODO: use the value paramter instead of harcoding the values
        async getTokenBInfo({ state, commit }, value) {
            let tokenB = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY, { mint: TOKEN_B_MINT_ADDR });
            let result: number = tokenB.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountB', result);

            tokenB = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY_GS, { mint: WSOL_ADDR });
            result = tokenB.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountSOLGS', result);

            tokenB = await this.$web3.getParsedTokenAccountsByOwner(POOL_AUTHORITY_HS, { mint: WSOL_ADDR });
            result = tokenB.value[0].account.data.parsed.info.tokenAmount.uiAmount;
            commit('setTokenAmountSOLHS', result);
        },

        // subscribe for pool hgen and gen account
        // on account change for the tokenA account
        // TODO: set timeout on account change
        // TODO separate it so only the specific account detail is rendered when their respective account changes, instead of rendering all of them.
        async onTokenAChange({ dispatch }, value) {
            this.$web3.onAccountChange(
                (TOKEN_ACC_A),
                () => dispatch("swapPool/getTokenAInfo", { authority: POOL_AUTHORITY, tokenAMintAddr: TOKEN_A_MINT_ADDR }, { root: true }),
            );

            this.$web3.onAccountChange(
                (TOKEN_ACC_GENS_GS),
                () => dispatch("swapPool/getTokenAInfo", { authority: POOL_AUTHORITY_GS, tokenAMintAddr: TOKEN_A_MINT_ADDR }, { root: true }),
            );

            this.$web3.onAccountChange(
                (TOKEN_ACC_HGEN_HS),
                () => dispatch("swapPool/getTokenAInfo", { authority: POOL_AUTHORITY_HS, tokenAMintAddr: TOKEN_B_MINT_ADDR }, { root: true }),
            );
        },

        // on account change for the tokenA account
        // TODO: set timeout on account change
        // TODO separate it so only the specific account detail is rendered when their respective account changes, instead of rendering all of them.
        async onTokenBChange({ dispatch }, value) {
            this.$web3.onAccountChange(
                (TOKEN_ACC_B),
                () => dispatch("swapPool/getTokenBInfo", { authority: POOL_AUTHORITY, tokenBMintAddr: TOKEN_A_MINT_ADDR }, { root: true }),
            );
            this.$web3.onAccountChange(
                (TOKEN_ACC_SOL_GS),
                () => dispatch("swapPool/getTokenBInfo", { authority: POOL_AUTHORITY_GS, tokenBMintAddr: WSOL_ADDR }, { root: true }),
            );
            this.$web3.onAccountChange(
                (TOKEN_ACC_SOL_HS),
                () => dispatch("swapPool/getTokenBInfo", { authority: POOL_AUTHORITY_HS, tokenBMintAddr: WSOL_ADDR }, { root: true }),
            );
        },

    }
);
