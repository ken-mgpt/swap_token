import {
  ADMINWALLET, FAKE_ADMIN_WALLET,
  FAKE_TOKEN_ADDRESS,
  PROGRAM_ADMIN_PRIMARY_WALLET, PROGRAM_USER_PRIMARY_WALLET,
  programId, TOKEN_ADDRESS,
} from './const';
import { before } from 'mocha';
import { web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import * as assert from 'assert';
import {ParsedInstruction} from '@solana/web3.js';
import {loadProgram} from "./command-line/utils";
import {initToken} from "./command-line/initToken";
import {swapToken} from "./command-line/swap-token";

const debug = require('debug')('swap-token:main');

describe('sb-renting', () => {
  // admint wallet
  // J2SDVLXSs8VTD46HsvphoJL3zF7HKU4KkjWMXUMDehix
  const adminWallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(PROGRAM_ADMIN_PRIMARY_WALLET));
  debug('Admin wallet is %s', adminWallet.publicKey.toBase58());

  // 2z5Hdf8f5Z9EcNbybvcNRtQj3WVychSD2SYNmSaAy1dZ
  const userWallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(PROGRAM_USER_PRIMARY_WALLET));
  debug('User wallet is %s', userWallet.publicKey.toBase58());

  describe('create token', () => {
    let program: any;
    before(async () => {
      program = await loadProgram(
          adminWallet,
          'devnet',
          programId.toString(),
          'https://api.devnet.solana.com'
      );
    })
    // check specify decimals, mint_authority

    it('should return true when check decimal, mint authority of new token', async function () {
      try {
        const decimals = Math.floor(Math.random()*9);
        const { tx, mint } = await initToken(program, adminWallet, decimals);
        debug('create tx: ', tx);
        debug('mint: ', mint.toString());
        const tokenInfo = await program.provider.connection.getParsedAccountInfo(mint, {commitment: "processed"});
        debug('tokenInfo: ', JSON.stringify(tokenInfo));
        assert.equal(tokenInfo.value.data.parsed.info.decimals, decimals, 'specify decimals');
        const mintAuthorityPub = await web3.PublicKey.findProgramAddress(
            [Buffer.from('mint_to'), mint.toBuffer()],
            program.programId,
        );
        assert.equal(tokenInfo.value.data.parsed.info.mintAuthority, mintAuthorityPub[0].toString(), 'specify mint authority');
      } catch (e) {
        assert.fail(e.message);
      }
    });

    // check swap token

    it('should return true when swap token', async function () {
      try {
        const amount = Math.floor(Math.random()*9 + 1)*10**7;
        const mint_authority = await web3.PublicKey.findProgramAddress(
            [Buffer.from('mint_to'), TOKEN_ADDRESS.toBuffer()],
            program.programId,
        );
        debug('mint_to_authority: ', mint_authority[0].toString());
        const tx = await swapToken(program, userWallet, TOKEN_ADDRESS, ADMINWALLET, mint_authority[0], amount);
        debug('swap tx: ', tx);
        let transactionInfo = null
        while (transactionInfo == null) {
          transactionInfo = await program.provider.connection.getParsedTransaction(tx);
        }
        const solTransfer = (transactionInfo.meta.innerInstructions[0].instructions[0] as ParsedInstruction).parsed.info.lamports
        debug('solTransfer: ', solTransfer);
        assert.equal(solTransfer, amount, 'sol transfer equal amount');
        const tokenTransfer = (transactionInfo.meta.innerInstructions[0].instructions[1] as ParsedInstruction).parsed.info.amount
        debug('tokenTransfer: ', tokenTransfer);
        assert.equal(tokenTransfer, amount * 10, 'token transfer should true');
      } catch (e) {
        assert.fail(e.message);
      }
    });

    it('should return false with fake token', async function () {
      try {
        const amount = Math.floor(Math.random()*9 + 1)*10**4;
        const mint_authority = await web3.PublicKey.findProgramAddress(
            [Buffer.from('mint_to'), TOKEN_ADDRESS.toBuffer()],
            program.programId,
        );
        debug('mint_to_authority333: ', mint_authority[0].toString());
        await swapToken(program, userWallet, FAKE_TOKEN_ADDRESS, ADMINWALLET, mint_authority[0], amount);
        assert.fail('it should not pass to here')
      } catch (e) {
        console.log("go here:", e.message)
        assert.equal(e.message.includes("0x7d6"), true);
      }
    });

    it('should return false with wrong adminWallet', async function () {
      try {
        const amount = Math.floor(Math.random()*9 + 1)*10**9;
        const mint_authority = await web3.PublicKey.findProgramAddress(
            [Buffer.from('mint_to'), TOKEN_ADDRESS.toBuffer()],
            program.programId,
        );
        debug('mint_to_authority: ', mint_authority[0].toString());
        await swapToken(program, userWallet, TOKEN_ADDRESS, FAKE_ADMIN_WALLET, mint_authority[0], amount);
        assert.fail('it should not pass to here')
      } catch (e) {
        assert.equal(e.message.includes("0x7d3"), true);
      }
    });

    it('should return false with wrong mint_authority', async function () {
      try {
        const amount = Math.floor(Math.random()*9 + 1)*10**9;
        const mint_authority = await web3.PublicKey.findProgramAddress(
            [Buffer.from('mint_to'), FAKE_TOKEN_ADDRESS.toBuffer()],
            program.programId,
        );
        debug('mint_to_authority: ', mint_authority[0].toString());
        await swapToken(program, userWallet, TOKEN_ADDRESS, ADMINWALLET, mint_authority[0], amount);
        assert.fail('it should not pass to here')
      } catch (e) {
        assert.equal(e.message.includes("0x7d6"), true);
      }
    });

  });

});
