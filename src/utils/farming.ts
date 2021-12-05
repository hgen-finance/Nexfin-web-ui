import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import {
  Account,
  PublicKey,
  SystemProgram,
  Connection,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js';
import BN from "bn.js";
import {FarmingLayout, FARMING_ACCOUNT_DATA_LAYOUT, INSTRUCTION_LAYOUT, InstructionLayout} from './layout';
import Wallet from "@project-serum/sol-wallet-adapter";
import axios from "axios";
import * as web3 from '@solana/web3.js';
import web3Plugin from "@/plugins/web3";
import * as bs58 from 'bs58';
const programId = new PublicKey("HCJ6A2fsypx8C6SYE4poKT395av9hZmhamvXEM3dZzia")
const destination = new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t")
const destHgen = new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t")
const mintHgen = new PublicKey("97MxeDbRgc6vYP1Sty2XdPXks3QhMD97EVYJ9pP4XcR3")
const destGens = new PublicKey("54sdQpgCMN1gQRG7xwTmCnq9vxdbPy8akfP1KrbeZ46t")
const mintGens = new PublicKey("2U3Mf4umT4CpLhhdwpfmGiktyvhdrLrNNv4z4GgsXNMe")
// const privateKey = "224128Zpov8A1AVMGC3Ys46oZEerngk24PQCpbkyBdnSS3jBS1jtbQPMJzwY3bdqyYVegYHF9eK9Vqa4vp78epY4"
const privateKey = "5G6hqugxKdq4nhH5MpKVVjbJZ2EiA1iDeW1JyPk6W2XaxJ4iDvwbhZrSBJdyZZFopBM4adMNxaW4CvFxEybfNAq6"

var farming_account : PublicKey
export default class farmingUtil {
    connection: Connection
    provider: any
    constructor() {
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
    }
    async buildFarmingAccount() {
        console.log("building")
        let lamports = await this.connection.getMinimumBalanceForRentExemption(97);
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "computer", programId)
        let transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: this.provider.publicKey,
                basePubkey: this.provider.publicKey,
                seed: "computer",
                newAccountPubkey: farming_account,
                lamports: lamports,
                space: 97,
                programId: programId
            })
        )
        await this.sendTransaction(transaction)
    }
    async getTotalAmount() {
        let total = 0
        let accounts = await this.connection.getProgramAccounts(programId);
        for (let i =0; i<accounts.length; i++) {
            let accountInfo = await this.connection.getAccountInfo(accounts[i].pubkey);
            console.log(accountInfo.data)
            total += parseInt(Buffer.from((FARMING_ACCOUNT_DATA_LAYOUT.decode(accountInfo.data) as FarmingLayout).depositedSol).toString('utf8'));
        }
        return total
    }
    async getFarmingAccount() : Promise<any> {
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "computer", programId)
        let accountInfo = await this.connection.getAccountInfo(farming_account)
        if (accountInfo == null) return
        let data = FARMING_ACCOUNT_DATA_LAYOUT.decode(accountInfo.data) as FarmingLayout
        let startDate = Buffer.from(data.startDate).toString('utf8')
        let endDate = Buffer.from(data.endDate).toString('utf8')
        let depositedSol = parseInt(Buffer.from(data.depositedSol).toString('utf8'))
        let depositedHgen = parseInt(Buffer.from(data.depositedHgen).toString('utf8'))
        let dayLength = parseInt(Buffer.from(data.dayLength).toString('utf8'))
        let dayLeft = parseInt(Buffer.from(data.dayLeft).toString('utf8'))
        return {
            startDate, endDate, depositedSol, depositedHgen, dayLength, dayLeft
        }
    }
    async setFarmingAccount(depositedSol: number, depositedHgen: number, dayLength: number) : Promise<boolean> {
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
       
        this.provider = (window as any).solana

        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "computer", programId)
        console.log("the farming account is", farming_account)
        if (await this.connection.getBalance(farming_account) == 0) {
            console.log("building account")
            await this.buildFarmingAccount().then(() => {
                console.log("successfully built")
            });
            await this.initializeAccount().then(() => {
                console.log("successfully initialized")
            });;
        }
        let accountInfo = await this.connection.getAccountInfo(farming_account)
        if (accountInfo == null) return false
        let today = new Date()
        let startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours()+':'+today.getMinutes();
        let endDateD = this.getEndDate(today, dayLength)
        let endDate = endDateD.getFullYear()+'-'+(endDateD.getMonth()+1)+'-'+endDateD.getDate()+'  '+endDateD.getHours()+':'+endDateD.getMinutes();
        let start = Buffer.alloc(32);
        start = Buffer.concat([Buffer.from(startDate)],32);
        let end = Buffer.alloc(32);
        end = Buffer.concat([Buffer.from(endDate)],32);
        let sol_amount = Buffer.alloc(8);
        sol_amount = Buffer.concat([Buffer.from(depositedSol.toString())],8);
        let hgen_amount = Buffer.alloc(8);
        hgen_amount = Buffer.concat([Buffer.from(depositedHgen.toString())],8);
        let day_total = Buffer.alloc(8);
        day_total = Buffer.concat([Buffer.from(dayLength.toString())],8);
        let day_left = Buffer.alloc(8);
        day_left = Buffer.concat([Buffer.from(dayLength.toString())],8);
        let data = Buffer.alloc(96);
        data = Buffer.concat([start, end, sol_amount, hgen_amount, day_total, day_left], 96);
        let _sendData = {
            instructionId: Buffer.from('1'),
            data: data
        }
        let sendData = Buffer.alloc(97)
        INSTRUCTION_LAYOUT.encode(_sendData, sendData)
        let balance = await this.connection.getBalance(this.provider.publicKey)
        let hgenBalance = await this.getTokenBalance(mintHgen)
        let hgenAccount = await this.getTokenAccount(mintHgen)
        let gensAccount = await this.getTokenAccount(mintGens)

        if (depositedSol*1e9 > balance || depositedHgen*1e9 > hgenBalance) {
            alert("Deposited amount is too much!")
            return false
        } else {
            let instruction = new TransactionInstruction({
                keys:[
                    {pubkey: this.provider.publicKey, isSigner: true, isWritable: false},
                    {pubkey: farming_account, isSigner: false, isWritable: true}
                ],
                programId: programId,
                data: sendData
            })
            
            let tokenInstruction = web3.SystemProgram.transfer({
                fromPubkey: this.provider.publicKey,
                toPubkey: destination,
                lamports: depositedSol*1e9
            });
            let hgenInstruction = Token.createTransferInstruction(TOKEN_PROGRAM_ID,hgenAccount,destHgen,this.provider.publicKey,[],depositedHgen*1e9);
            
            let transaction = new Transaction().add(instruction, tokenInstruction, hgenInstruction)

            await this.sendTransaction(transaction)
        }
        alert("Success!!!, please reload the page.")
        return true
    }
    async withdrawFarm() {
        let {
            startDate, 
            endDate, 
            depositedSol, 
            depositedHgen, 
            dayLength, 
            dayLeft
        } = await this.getFarmingAccount();
        let hgenAccount = await this.getTokenAccount(mintHgen)
        let tokenInstruction = web3.SystemProgram.transfer({
                fromPubkey: destination,
                toPubkey: this.provider.publicKey,
                lamports: depositedSol*1e9
            })
        let hgenInstruction = Token.createTransferInstruction(TOKEN_PROGRAM_ID,destHgen,hgenAccount,destination,[],depositedHgen*1e9);
        
        let tokenTransaction = new Transaction().add(tokenInstruction, hgenInstruction);
        let keypair = web3.Keypair.fromSecretKey(bs58.decode(privateKey));
        let signature = await web3.sendAndConfirmTransaction(this.connection, tokenTransaction, [keypair])
        
        let dt = 0;
        let start = Buffer.alloc(32);
        start = Buffer.concat([Buffer.from("")],32);
        let end = Buffer.alloc(32);
        end = Buffer.concat([Buffer.from("")],32);
        let sol_amount = Buffer.alloc(8);
        sol_amount = Buffer.concat([Buffer.from(dt.toString())],8);
        let hgen_amount = Buffer.alloc(8);
        hgen_amount = Buffer.concat([Buffer.from(dt.toString())],8);
        let day_total = Buffer.alloc(8);
        day_total = Buffer.concat([Buffer.from(dt.toString())],8);
        let day_left = Buffer.alloc(8);
        day_left = Buffer.concat([Buffer.from(dt.toString())],8);
        let data = Buffer.alloc(96);
        data = Buffer.concat([start, end, sol_amount, hgen_amount, day_total, day_left], 96);
        let _sendData = {
            instructionId: Buffer.from('1'),
            data: data
        }
        let sendData = Buffer.alloc(97)
        INSTRUCTION_LAYOUT.encode(_sendData, sendData)
        let instruction = new TransactionInstruction({
            keys:[
                {pubkey: this.provider.publicKey, isSigner: true, isWritable: false},
                {pubkey: farming_account, isSigner: false, isWritable: true}
            ],
            programId: programId,
            data: sendData
        })
        let transaction = new Transaction().add(instruction)
        await this.sendTransaction(transaction)
        alert("Withdraw has finished. Please reload the page.")
    }
    getEndDate(startDate:Date, length:number) {
        let res = new Date(startDate)
        res.setDate(Number(res.getDate()) + Number(length))
        return res
    }
    async initializeAccount(): Promise<boolean> {
        console.log("initializing")
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "computer", programId)
        let _sendData = {
            instructionId: Buffer.from('0'),
            data: Buffer.from('')
        }
        let sendData = Buffer.alloc(97)
        INSTRUCTION_LAYOUT.encode(_sendData, sendData)
        let instruction = new TransactionInstruction({
            keys: [
                {pubkey: this.provider.publicKey, isSigner: true, isWritable: false},
                {pubkey: farming_account, isSigner: false, isWritable: true},
                {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false}
            ],
            programId: programId,
            data: sendData
        })
        let transaction = new Transaction().add(instruction)
        await this.sendTransaction(transaction)
        return true
    }
    async getMBalance() {
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
        let sol_balance = await this.connection.getBalance(this.provider.publicKey)/1e9;
        let usd = sol_balance*244.22;
        let hgen = await this.getTokenBalance(mintHgen)/1e9;
        let gens = await this.getTokenBalance(mintGens)/1e9;
        return { sol_balance, usd, hgen, gens }
    }
    getTokenBalance = async (mint:PublicKey) => {
        let senderTokenAccountAddress = await this.getTokenAccount(mint)
        let balance = await this.connection.getTokenAccountBalance(senderTokenAccountAddress)
        let res = Number(balance.value.amount)
        return res
    }
    getTokenAccount = async (mint:PublicKey) => {
        let result = await this.connection.getTokenAccountsByOwner(this.provider.publicKey, {mint:mint});
        let senderTokenAccountAddress = result.value[0].pubkey;
        return senderTokenAccountAddress
    }
    async sendTransaction(transaction: Transaction) {
        transaction.feePayer = this.provider.publicKey
        transaction.setSigners(this.provider.publicKey)
        transaction.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash
        let signedTransaction = await this.provider.signTransaction(transaction)
        await this.connection.sendRawTransaction(signedTransaction.serialize(), this.provider.publicKey)
    }
}