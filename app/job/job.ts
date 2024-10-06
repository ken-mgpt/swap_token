import cron from 'node-cron';
import fs from "fs";
import csv from "csv-parser";
import {loadWalletKey} from "../command-line/utils";
import * as anchor from "@coral-xyz/anchor";
import {clusterApiUrl, Transaction} from "@solana/web3.js";
import {sendTx, transferToken} from "../command-line/transfer-token";
import moment from 'moment-timezone';

interface CSVRow {
    address: string;
    amount: number;
}

// Function to be executed every day at 10 AM UTC
function myJob(): void {
    console.log('This job runs every day at 4 AM UTC.');
    const filePath = "/home/truongnx/Desktop/solana/swap_token/test2.csv";
    const token = "4QQV4LQUUXAn1eN1XQGrfY65TfLe5STJcfsCQozqyb8T"
    const results = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: CSVRow) => {
            results.push(row);
        })
        .on('end', async () => {

            console.log('CSV file successfully processed');
            const adminWallet = loadWalletKey("xuqYQDwSDmLTSwCPZtmaUo4dRE8xMG5hKGQKEToZCZastDaRH2u5LWZmqCr3pvbnZmgNpyLf7rP1RNc3D4fE6gr");
            console.log("admin wallet: ", adminWallet.publicKey.toString());
            const solConnection = new anchor.web3.Connection(clusterApiUrl('mainnet-beta'));
            let maxTxLength = 20;
            let txLength = Math.floor(results.length / maxTxLength) + 1;
            console.log('txLength: ', txLength);
            cron.schedule('0 10 * * *', function (){

            });

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

}

// Schedule the job to run every day at 04 AM UTC
cron.schedule('0 17 * * *', myJob);

console.log('Job scheduler started. Press Ctrl+C to exit.');