import { Connection, clusterApiUrl, Cluster } from "@solana/web3.js";
import { Plugin } from "@nuxt/types";
import dotenv from 'dotenv';

function chooseCluster(): Cluster | undefined {
    dotenv.config();
    if (!process.env.LIVE) return;
    switch (process.env.CLUSTER) {
        case 'devnet':
        case 'testnet':
        case 'mainnet-beta': {
            return process.env.CLUSTER;
        }
    }
    throw 'Unknown cluster "' + process.env.CLUSTER + '", check the .env file';
}

export const cluster = chooseCluster();

export const url =
    process.env.RPC_URL ||
    (process.env.LIVE ? clusterApiUrl(cluster, false) : 'https://api.devnet.solana.com');


const web3Plugin: Plugin = async (ctx, inject) => {
    const web3 = new Connection(url, "confirmed");
    ctx.$web3 = web3
    inject("web3", web3);
    console.log(web3, "| web3 connection status");
};

export default web3Plugin;
