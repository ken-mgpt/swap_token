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
        preflightCommitment: 'confirmed',
    });
    const programInfo = await solConnection.getAccountInfo(new anchor.web3.PublicKey(programId));
    const idl = JSON.parse(
        fs.readFileSync("target/idl/swap_token.json", "utf8")
    );
    return new anchor.Program(idl, new anchor.web3.PublicKey(programId), provider);
}

export function loadWalletKey(keypair): Keypair {
    if (!keypair || keypair == '') {
        throw new Error('Keypair is required!');
    }

    const decodedKey = new Uint8Array(
        keypair.endsWith('.json') && !Array.isArray(keypair)
            ? JSON.parse(fs.readFileSync(keypair).toString())
            : bs58.decode(keypair),
    );

    const loaded = Keypair.fromSecretKey(decodedKey);
    return loaded;
}
