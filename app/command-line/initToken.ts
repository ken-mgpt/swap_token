import * as anchor from '@project-serum/anchor';
import {BN, Program, web3} from '@project-serum/anchor';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {Keypair, sendAndConfirmTransaction, Transaction} from "@solana/web3.js";

export async function initToken(
    program: Program,
    userWallet: Keypair,
    decimal: number
) {
    const mintKey = Keypair.generate();
    const mint = mintKey.publicKey;
    console.log('mint: ', mint.toString());
    const mint_authority = await web3.PublicKey.findProgramAddress(
        [Buffer.from('mint_to'), mint.toBuffer()],
        program.programId,
    );
    console.log('mint_to_authority: ', mint_authority[0].toString());

    const intructs = await program.instruction.initToken(new BN(decimal), {
        accounts: {
            payer: userWallet.publicKey,
            mint: mint,
            mintAuthorityPubkey: mint_authority[0],
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
    });
    let transaction = new Transaction();
    transaction.add(intructs);
    const tx = await sendAndConfirmTransaction(program.provider.connection, transaction, [userWallet, mintKey], {
        commitment: 'finalized',
    });
    console.log('tx: ' + tx);
    return {
        tx: tx,
        mint: mint
    };
}
