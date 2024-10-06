import {
    createTransferInstruction,
    getAssociatedTokenAddress, getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import {Connection, Keypair, PublicKey, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";
import {BN} from "@project-serum/anchor";

export async function transferToken(
    connection: Connection,
    adminWallet: Keypair,
    mint: PublicKey,
    recipientWallet: PublicKey,
    amount: number,
    transaction: Transaction,
) {
    await sleep(2000);
    const adminTokenAta = await getAssociatedTokenAddress(mint, adminWallet.publicKey);
    const recipientTokenAta = await getOrCreateAssociatedTokenAccount(connection, adminWallet, mint, recipientWallet, false,"finalized");
    transaction.add(
        createTransferInstruction(
            adminTokenAta,
            recipientTokenAta.address,
            adminWallet.publicKey,
            BigInt(amount),
        ),
    );
    // const tx = await sendAndConfirmTransaction(connection, transaction, [adminWallet]);
    // console.log('tx: ' + tx);
    return transaction;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function sendTx(connection: Connection, transaction: Transaction, wallet: Keypair) {
    try {
        const tx = await sendAndConfirmTransaction(connection, transaction, [wallet]);
        console.log('tx: ' + tx);
    } catch (error) {
        console.log('send tx fail: ', error);
        await
        await sendTx(connection, transaction, wallet);
    }
}
