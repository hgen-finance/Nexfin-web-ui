import {
  TOKEN_PROGRAM_ID,
  Token,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Account,
  PublicKey,
  SystemProgram,
  Connection,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  FarmingLayout,
  FARMING_ACCOUNT_DATA_LAYOUT,
  INSTRUCTION_LAYOUT,
  LP_TOKENS_HS,
} from "./layout";
import * as web3 from "@solana/web3.js";
import * as bs58 from "bs58";

const programId = new PublicKey("3PtvnRuzC68zrDQoRsoKVQoVvhbVF7fTxeYzLF6mN3EE");
const destination = new PublicKey(
  "GvAQoq7SKdYhTNvjmEV5q8CNvkuufJH2oJCJWnx2YRj9"
);
const privateKey =
  "4HSyzYxopDieeTKG8jRX6iznPM9ALWSiR2Va9xzSfYnk25o41SNrJiMZZTEnxkmfWnQnuvg4h7MbJDEK4WBzUGTm";
var farming_account: PublicKey;

export default class farmingUtil {
  connection: Connection;
  provider: any;
  instructions: web3.TransactionInstruction[] = [];

  constructor() {
    this.connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    this.provider = (window as any).solana;
  }
  async buildFarmingAccount() {
    console.log("building");
    let lamports = await this.connection.getMinimumBalanceForRentExemption(97);
    farming_account = await PublicKey.createWithSeed(
      this.provider.publicKey,
      "computer",
      programId
    );
    let transaction = SystemProgram.createAccountWithSeed({
      fromPubkey: this.provider.publicKey,
      basePubkey: this.provider.publicKey,
      seed: "computer",
      newAccountPubkey: farming_account,
      lamports: lamports,
      space: 97,
      programId: programId,
    });

    this.instructions.push(transaction);
  }
  async getTotalAmount() {
    let total = 0;
    let accounts = await this.connection.getProgramAccounts(programId);
    for (let i = 0; i < accounts.length; i++) {
      let accountInfo = await this.connection.getAccountInfo(
        accounts[i].pubkey
      );
      console.log(accountInfo.data);
      total += parseInt(
        Buffer.from(
          (
            FARMING_ACCOUNT_DATA_LAYOUT.decode(
              accountInfo.data
            ) as FarmingLayout
          ).depositedSol
        ).toString("utf8")
      );
    }
    return total;
  }
  async getFarmingAccount(): Promise<any> {
    this.connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    this.provider = (window as any).solana;
    farming_account = await PublicKey.createWithSeed(
      this.provider.publicKey,
      "computer",
      programId
    );
    let accountInfo = await this.connection.getAccountInfo(farming_account);

    console.log("the data is", accountInfo);
    if (accountInfo == null) return;
    let data = FARMING_ACCOUNT_DATA_LAYOUT.decode(
      accountInfo.data
    ) as FarmingLayout;

    let startDate = Buffer.from(data.startDate).toString("utf8");
    let endDate = Buffer.from(data.endDate).toString("utf8");
    let depositedLp = parseInt(Buffer.from(data.depositedLp).toString("utf8"));
    let depositedSol = parseInt(
      Buffer.from(data.depositedSol).toString("utf8")
    );
    let depositedHgen = parseInt(
      Buffer.from(data.depositedHgen).toString("utf8")
    );
    let dayLength = parseInt(Buffer.from(data.dayLength).toString("utf8"));
    let dayLeft = parseInt(Buffer.from(data.dayLeft).toString("utf8"));
    return {
      startDate,
      endDate,
      depositedLp,
      depositedSol,
      depositedHgen,
      dayLength,
      dayLeft,
    };
  }
  async setFarmingAccount(
    depositedLp: number,
    depositedSol: number,
    depositedHgen: number,
    dayLength: number
  ): Promise<boolean> {
    console.log("it reaches here first");
    this.connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    this.provider = (window as any).solana;
    farming_account = await PublicKey.createWithSeed(
      this.provider.publicKey,
      "computer",
      programId
    );
    console.log("the farming account is ", farming_account);
    if ((await this.connection.getBalance(farming_account)) == 0) {
      console.log("building account");
      await this.buildFarmingAccount().then(() => {
        console.log("successfully built");
      });
      await this.initializeAccount().then(() => {
        console.log("successfully initialized");
      });
    }

    // let accountInfo = await this.connection.getAccountInfo(farming_account);
    // if (accountInfo == null) return false;
    let today = new Date();
    let startDate =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      "-" +
      today.getHours() +
      ":" +
      today.getMinutes();
    let endDateD = this.getEndDate(today, dayLength);
    let endDate =
      endDateD.getFullYear() +
      "-" +
      (endDateD.getMonth() + 1) +
      "-" +
      endDateD.getDate() +
      "  " +
      endDateD.getHours() +
      ":" +
      endDateD.getMinutes();
    let start = Buffer.alloc(32);
    start = Buffer.concat([Buffer.from(startDate)], 32);
    let end = Buffer.alloc(32);
    end = Buffer.concat([Buffer.from(endDate)], 32);

    let lp_amount = Buffer.alloc(8);
    lp_amount = Buffer.concat([Buffer.from(depositedLp.toString())], 8);

    let sol_amount = Buffer.alloc(8);
    sol_amount = Buffer.concat([Buffer.from(depositedSol.toString())], 8);
    let hgen_amount = Buffer.alloc(8);
    hgen_amount = Buffer.concat([Buffer.from(depositedHgen.toString())], 8);
    let day_total = Buffer.alloc(8);
    day_total = Buffer.concat([Buffer.from(dayLength.toString())], 8);
    let day_left = Buffer.alloc(8);
    day_left = Buffer.concat([Buffer.from(dayLength.toString())], 8);
    let data = Buffer.alloc(96);
    data = Buffer.concat(
      [start, end, lp_amount, sol_amount, hgen_amount, day_total, day_left],
      96
    );
    let _sendData = {
      instructionId: Buffer.from("1"),
      data: data,
    };
    let sendData = Buffer.alloc(97);
    INSTRUCTION_LAYOUT.encode(_sendData, sendData);
    let balance = await this.connection.getBalance(this.provider.publicKey);

    // get the token account info of the wallet
    let LP_TOKEN_HS = await this.connection.getParsedTokenAccountsByOwner(
      destination,
      {
        mint: LP_TOKENS_HS,
      }
    );
    let tokenATA = LP_TOKEN_HS.value[0]
      ? LP_TOKEN_HS.value[0].pubkey.toBase58()
      : "";

    let source_LP = await this.connection.getParsedTokenAccountsByOwner(
      this.provider.publicKey,
      {
        mint: LP_TOKENS_HS,
      }
    );
    let sourceATA = source_LP.value[0]
      ? source_LP.value[0].pubkey.toBase58()
      : "";

    // create a ATA account if the wallet user doesnt have one
    let ata;
    if (tokenATA != "") {
      ata = new PublicKey(tokenATA);
    }

    if (tokenATA == "") {
      // Only create tx if the account wasnt present
      // calculate ATA
      ata = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        LP_TOKENS_HS, // mint
        destination // owner
      );
    }
    console.log(tokenATA, "|", ata);

    // if (depositedSol * 1e9 > balance) {
    //     alert("Deposited SOL amount is too much!");
    //     return false;
    // } else {
    let instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: this.provider.publicKey,
          isSigner: true,
          isWritable: false,
        },
        { pubkey: farming_account, isSigner: false, isWritable: true },
      ],
      programId: programId,
      data: sendData,
    });

    // let tokenTransaction =
    //     web3.SystemProgram.transfer({
    //         fromPubkey: this.provider.publicKey,
    //         toPubkey: destination,
    //         lamports: depositedSol * 1e9,
    //     })

    // let keypair = web3.Keypair.fromSecretKey(bs58.decode(privateKey));

    console.log("the ata is ", ata.toBase58());

    let lpTokenTx;
    lpTokenTx = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      new PublicKey(sourceATA),
      ata,
      this.provider.publicKey,
      [],
      depositedLp * 1e2
    );

    if (tokenATA == "") {
      const ataAccountTx = Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
        TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
        LP_TOKENS_HS, // mint
        ata, // ata
        destination, // owner of token account
        this.provider.publicKey // fee payer
      );
      this.instructions.push(ataAccountTx, instruction, lpTokenTx);
    } else {
      this.instructions.push(instruction, lpTokenTx);
    }

    const transaction = new web3.Transaction().add(...this.instructions);
    this.sendTransaction(transaction);

    return true;
  }
  async withdrawFarm() {
    let {
      startDate,
      endDate,
      depositedLp,
      depositedSol,
      depositedHgen,
      dayLength,
      dayLeft,
    } = await this.getFarmingAccount();
    // let tokenTransaction =
    //     web3.SystemProgram.transfer({
    //         fromPubkey: destination,
    //         toPubkey: this.provider.publicKey,
    //         lamports: depositedSol * 1e9,
    //     })

    // get the token account info of the wallet
    let LP_TOKEN = await this.connection.getParsedTokenAccountsByOwner(
      this.provider.publicKey,
      {
        mint: LP_TOKENS_HS,
      }
    );
    let tokenATA = LP_TOKEN.value[0] ? LP_TOKEN.value[0].pubkey.toBase58() : "";

    // create a ATA account if the wallet user doesnt have one
    let ata;
    if (tokenATA != "") {
      ata = new PublicKey(tokenATA);
    }

    let source_LP = await this.connection.getParsedTokenAccountsByOwner(
      destination,
      {
        mint: LP_TOKENS_HS,
      }
    );
    let sourceTokenATA = source_LP.value[0]
      ? source_LP.value[0].pubkey.toBase58()
      : "";

    let LpTokenIx;
    LpTokenIx = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      new PublicKey(sourceTokenATA),
      ata,
      destination,
      [],
      depositedLp * 1e2
    );
    let tx = new Transaction();

    tx.add(LpTokenIx);
    // await web3.sendAndConfirmTransaction(this.connection, tx, [, keypair])

    let dt = 0;
    let start = Buffer.alloc(32);
    start = Buffer.concat([Buffer.from("")], 32);

    let end = Buffer.alloc(32);
    end = Buffer.concat([Buffer.from("")], 32);

    let lp_amount = Buffer.alloc(8);
    lp_amount = Buffer.concat([Buffer.from(dt.toString())], 8);

    let sol_amount = Buffer.alloc(8);
    sol_amount = Buffer.concat([Buffer.from(dt.toString())], 8);

    let hgen_amount = Buffer.alloc(8);
    hgen_amount = Buffer.concat([Buffer.from(dt.toString())], 8);

    let day_total = Buffer.alloc(8);
    day_total = Buffer.concat([Buffer.from(dt.toString())], 8);

    let day_left = Buffer.alloc(8);
    day_left = Buffer.concat([Buffer.from(dt.toString())], 8);

    let data = Buffer.alloc(96);
    data = Buffer.concat(
      [start, end, lp_amount, sol_amount, hgen_amount, day_total, day_left],
      96
    );

    let _sendData = {
      instructionId: Buffer.from("1"),
      data: data,
    };
    let sendData = Buffer.alloc(97);
    INSTRUCTION_LAYOUT.encode(_sendData, sendData);
    let instruction = new TransactionInstruction({
      keys: [
        { pubkey: this.provider.publicKey, isSigner: true, isWritable: false },
        { pubkey: farming_account, isSigner: false, isWritable: true },
      ],
      programId: programId,
      data: sendData,
    });

    try {
      let tx = new Transaction();
      tx.add(instruction, LpTokenIx);

      this.sendTransactionKey(tx);
    } catch (err) {
      console.error(err, "aerror");
    }

    // alert("Withdraw has finished. Please reload the page.");
  }
  getEndDate(startDate: Date, length: number) {
    let res = new Date(startDate);
    res.setDate(Number(res.getDate()) + Number(length));
    return res;
  }
  async initializeAccount(): Promise<boolean> {
    console.log("initializing");
    this.connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    this.provider = (window as any).solana;
    farming_account = await PublicKey.createWithSeed(
      this.provider.publicKey,
      "computer",
      programId
    );
    let _sendData = {
      instructionId: Buffer.from("0"),
      data: Buffer.from(""),
    };
    let sendData = Buffer.alloc(97);
    INSTRUCTION_LAYOUT.encode(_sendData, sendData);
    let instruction = new TransactionInstruction({
      keys: [
        { pubkey: this.provider.publicKey, isSigner: true, isWritable: false },
        { pubkey: farming_account, isSigner: false, isWritable: true },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: programId,
      data: sendData,
    });

    this.instructions.push(instruction);
    // let transaction = new Transaction().add(instruction);
    // await this.sendTransaction(transaction);
    return true;
  }
  // async getMBalance() {
  //     this.connection = new Connection(
  //         "https://api.devnet.solana.com",
  //         "confirmed"
  //     );
  //     this.provider = (window as any).solana;
  //     let sol_balance =
  //         (await this.connection.getBalance(this.provider.publicKey)) / 1e9;
  //     let usd = sol_balance * 180.22;
  //     let hgen = (12213432.9873 / 2000.34) * usd;
  //     let gens = (20000.01 / 2000.34) * usd;
  //     return {
  //         sol_balance,
  //         usd,
  //         hgen,
  //         gens,
  //     };
  // }
  // getTokenBalance = async (walletAddress, tokenMintAddress) => {
  //     const response = await axios({
  //         url: "https://api.devnet.solana.com",
  //         method: "post",
  //         headers: { "Content-Type": "application/json" },
  //         data: {
  //             jsonrpc: "2.0",
  //             id: 1,
  //             method: "getTokenAccountsByOwner",
  //             params: [
  //                 walletAddress,
  //                 {
  //                     mint: tokenMintAddress,
  //                 },
  //                 {
  //                     encoding: "jsonParsed",
  //                 },
  //             ],
  //         },
  //     });
  //     // return (
  //     //     Number(
  //     //         response?.data?.result?.value[0]?.account?.data?.parsed?.info
  //     //             ?.tokenAmount?.amount
  //     //     ) / 1000000000
  //     // );
  //     return (
  //         Number(
  //             response?.data?.result?.value[0]?.account?.data?.parsed?.info
  //                 ?.tokenAmount?.amount
  //         ) / 100
  //     );
  // };
  async sendTransactionKey(transaction: Transaction) {
    transaction.feePayer = this.provider.publicKey;
    transaction.setSigners(this.provider.publicKey);
    let { blockhash } = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    let signedTransaction = await this.provider.signTransaction(transaction);
    let keypair = web3.Keypair.fromSecretKey(bs58.decode(privateKey));
    signedTransaction.partialSign(keypair);

    await this.connection.sendRawTransaction(
      signedTransaction.serialize(),
      this.provider.publicKey
    );
  }

  async sendTransaction(transaction: Transaction) {
    transaction.feePayer = this.provider.publicKey;
    transaction.setSigners(this.provider.publicKey);

    let { blockhash } = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    let signedTransaction = await this.provider.signTransaction(transaction);
    console.log(signedTransaction, "tx");
    await this.connection.sendRawTransaction(
      signedTransaction.serialize(),
      this.provider.publicKey
    );
  }
}
