import {Command} from 'commander';
import {loadProgram, loadWalletKey} from './utils';
import {clusterApiUrl, PublicKey, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {sendTx, transferToken} from "./transfer-token";
import cron from 'node-cron';
import fs from "fs";
import csv from "csv-parser";

const program = new Command();

const debug = require('debug')('transfer-token:main');

function programCommand(
    name: string,
    options: { requireWallet: boolean } = {requireWallet: true},
) {
    let cmProgram = program
        .command(name)
        .option(
            '-e, --env <string>',
            'Solana cluster env name',
            'mainnet-beta', //mainnet-beta, testnet, devnet
        )
        // .option('-r, --rpc <string>', 'rpc endpoint', 'https://aged-necessary-liquid.solana-mainnet.quiknode.pro/0a49cebc10e0452f1ba9dfb1fad72371eac794ca');
        .option('-r, --rpc <string>', 'rpc endpoint', 'https://api.mainnet-beta.solana.com');
        // .option('-r, --rpc <string>', 'rpc endpoint', 'http://rpc.solscan.com');


    if (options.requireWallet) {
        cmProgram = cmProgram.requiredOption('-k, --keypair <path>', `Solana wallet location`);
    }

    return cmProgram;
}

// Derive the address (public key) of a greeting account from the program so that it's easy to find later.
programCommand('transferToken')
    .requiredOption('-r, --recipient <string>', 'recipient address')
    .requiredOption('-ta, --tokens <string>', 'token address')
    .requiredOption('-a, --amount <number>', 'token amount')
    .action(async (options) => {
        debug('options: ', options);
        const keypairPath = options.keypair;
        const env = options.env;
        const token = options.tokens;
        const amount = options.amount;
        const recipient = options.recipient;
        debug('keypairPath: ', keypairPath);
        const adminWallet = loadWalletKey(keypairPath);
        const solConnection = new anchor.web3.Connection(clusterApiUrl(env));
        // await transferToken(solConnection, adminWallet, new anchor.web3.PublicKey(token), new anchor.web3.PublicKey(recipient), amount);
    });

interface CSVRow {
    address: string;
    amount: number;
}

programCommand('transferTokenFromFile')
    .requiredOption('-r, --recipient <string>', 'recipient address')
    .requiredOption('-ta, --tokens <string>', 'token address')
    .requiredOption('-f, --file <path>', 'file wallet path')
    .action(async (options) => {
        debug('options: ', options);
        const keypairPath = options.keypair;
        const env = options.env;
        const token = options.tokens;
        const filePath = options.file;
        const results = [];
        console.log('Reading CSV file:', filePath)
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row: CSVRow) => {
                results.push(row);
            })
            .on('end', async () => {
                console.log('CSV file successfully processed');
                debug('keypairPath: ', keypairPath);
                const adminWallet = loadWalletKey("xuqYQDwSDmLTSwCPZtmaUo4dRE8xMG5hKGQKEToZCZastDaRH2u5LWZmqCr3pvbnZmgNpyLf7rP1RNc3D4fE6gr");
                console.log("admin wallet: ", adminWallet.publicKey.toString());
                console.log('env: ', env);
                const solConnection = new anchor.web3.Connection(clusterApiUrl(env));
                let maxTxLength = 15;
                let txLength = Math.floor(results.length / maxTxLength) + 1;
                console.log('txLength: ', txLength);

                for (let i = 0; i < txLength; i++) {
                    let transaction = new Transaction();
                    let length = (i === txLength - 1) ? results.length % maxTxLength : maxTxLength;
                    console.log('length: ', length);
                    for (let j = 0; j < length; j++) {
                        let index = i * maxTxLength + j;
                        console.log('address: ', results[index].address);
                        console.log('amount: ', results[index].amount);
                        await transferToken(
                            solConnection,
                            adminWallet,
                            new anchor.web3.PublicKey(token),
                            new anchor.web3.PublicKey(results[index].address),
                            results[index].amount,
                            transaction
                        );
                    }
                    const tx = await sendTx(solConnection, transaction, adminWallet);
                    console.log('tx: ' + tx);
                }
            });

    });

program.parse(process.argv);