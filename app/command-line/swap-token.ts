import * as anchor from '@project-serum/anchor';
import {BN, Program, web3} from '@project-serum/anchor';
import {ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {Keypair, PublicKey, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";
import {ADMINWALLET} from "../const";

export async function swapToken(
    program: Program,
    userWallet: Keypair,
    mint: PublicKey,
    adminWallet: PublicKey,
    mint_authority: PublicKey,
    amount: number
) {
    const userTokenAta = await getAssociatedTokenAddress(mint, userWallet.publicKey);

    const intructs = await program.instruction.swapToken(new BN(amount), {
        accounts: {
            payer: userWallet.publicKey,
            mint: mint,
            userTokenAta: userTokenAta,
            mintAuthorityPubkey: mint_authority,
            adminWallet: adminWallet,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
    });
    let transaction = new Transaction();
    transaction.add(intructs);
    const tx = await sendAndConfirmTransaction(program.provider.connection, transaction, [userWallet], {
        commitment: 'finalized',
    });
    console.log('tx: ' + tx);
    return tx;
}
