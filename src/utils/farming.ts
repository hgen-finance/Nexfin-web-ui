import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
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

const programId = new PublicKey("EXgCpsUR6DayempLFhq4mMdaKuZroRmjtRTRo6t9iGMB")
var farming_account : PublicKey
export default class farmingUtil {
    connection: Connection
    provider: any
    constructor() {
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
    }
    async buildFarmingAccount() {
        let lamports = await this.connection.getMinimumBalanceForRentExemption(65);
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "sunday", programId)
        let transaction = new Transaction().add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: this.provider.publicKey,
                basePubkey: this.provider.publicKey,
                seed: "sunday",
                newAccountPubkey: farming_account,
                lamports: lamports,
                space: 65,
                programId: programId
            })
        )
        await this.sendTransaction(transaction)
    }
    async getTotalAmount() {
        let total = 0
        let accounts = await this.connection.getProgramAccounts(programId);
        for (let i =0; i<accounts.length; i++) {
            let accountInfo = accounts[i].account;
            total += parseInt(Buffer.from((FARMING_ACCOUNT_DATA_LAYOUT.decode(accountInfo.data) as FarmingLayout).depositedSol).toString('utf8'));
        }
        return total
    }
    async getFarmingAccount() : Promise<any> {
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "sunday", programId)
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
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "sunday", programId)
        let accountInfo = await this.connection.getAccountInfo(farming_account)
        if (accountInfo == null) return false
        let today = new Date()
        let startDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'-'+today.getHours()+':'+today.getMinutes()+":"+today.getSeconds();
        let endDateD = this.getEndDate(today, dayLength)
        let endDate = endDateD.getFullYear()+'-'+(endDateD.getMonth()+1)+'-'+endDateD.getDate()+'-'+endDateD.getHours()+':'+endDateD.getMinutes()+":"+endDateD.getSeconds();
        let start = Buffer.alloc(16);
        start = Buffer.concat([Buffer.from(startDate)],16);
        let end = Buffer.alloc(16);
        end = Buffer.concat([Buffer.from(endDate)],16);
        let sol_amount = Buffer.alloc(8);
        sol_amount = Buffer.concat([Buffer.from(depositedSol.toString())],8);
        let hgen_amount = Buffer.alloc(8);
        hgen_amount = Buffer.concat([Buffer.from(depositedHgen.toString())],8);
        let day_total = Buffer.alloc(8);
        day_total = Buffer.concat([Buffer.from(dayLength.toString())],8);
        let day_left = Buffer.alloc(8);
        day_left = Buffer.concat([Buffer.from(dayLength.toString())],8);
        let data = Buffer.alloc(64);

        data = Buffer.concat([start, end, sol_amount, hgen_amount, day_total, day_left], 64);
        let _sendData = {
            instructionId: Buffer.from('1'),
            data: data
        }
        let sendData = Buffer.alloc(65)
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
        return true
    }
    getEndDate(startDate:Date, length:number) {
        let res = new Date(startDate)
        res.setDate(res.getDate() + length)
        return res
    }
    async initializeAccount(): Promise<boolean> {
        // await this.buildFarmingAccount()
        this.connection = new Connection("https://api.devnet.solana.com", 'confirmed');
        this.provider = (window as any).solana
        farming_account = await PublicKey.createWithSeed(this.provider.publicKey, "sunday", programId)
        let accountInfo = await this.connection.getAccountInfo(farming_account)
        if (accountInfo == null) return false
        let _sendData = {
            instructionId: Buffer.from('0'),
            data: Buffer.from('')
        }
        let sendData = Buffer.alloc(65)
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
    async sendTransaction(transaction: Transaction) {
        transaction.feePayer = this.provider.publicKey
        transaction.setSigners(this.provider.publicKey)
        transaction.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash
        let signedTransaction = await this.provider.signTransaction(transaction)
        await this.connection.sendRawTransaction(signedTransaction.serialize(), this.provider.publicKey)
    }
}