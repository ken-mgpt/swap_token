import {clusterApiUrl, Keypair} from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import fs from "fs";
import * as bs58 from 'bs58';

export async function loadProgram(
    walletKeyPair: Keypair,
    env: string,
    programId: string,
    customRpcUrl?: string,
) {
    if (customRpcUrl) console.log('USING CUSTOM URL', customRpcUrl);

    // @ts-ignore
    const solConnection = new anchor.web3.Connection(
        //@ts-ignore
        customRpcUrl || clusterApiUrl(env),
    );

    const walletWrapper = new anchor.Wallet(walletKeyPair);
    const provider = new anchor.Provider(solConnection, walletWrapper, {
        preflightCommitment: 'recent',
    });
    const idl = await anchor.Program.fetchIdl(new anchor.web3.PublicKey(programId), provider);
    console.log('idl: ', JSON.stringify(idl));
    const program = new anchor.Program(idl, new anchor.web3.PublicKey(programId), provider);
    return program;
}

export function loadWalletKey(keypair): Keypair {
    if (!keypair || keypair == '') {
        throw new Error('Keypair is required!');
    }

    console.log('keyPair: ', keypair)
    const decodedKey = new Uint8Array(
        keypair.endsWith('.json') && !Array.isArray(keypair)
            ? JSON.parse(fs.readFileSync(keypair).toString())
            : bs58.decode(keypair),
    );

    const loaded = Keypair.fromSecretKey(decodedKey);
    console.log(`wallet public key: ${loaded.publicKey}`);
    return loaded;
}
