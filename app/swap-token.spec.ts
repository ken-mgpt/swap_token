import {
  PROGRAM_ADMIN_PRIMARY_WALLET,
  programId,
} from './const';
import { before } from 'mocha';
import { BN, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import * as assert from 'assert';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Keypair } from '@solana/web3.js';
import {loadProgram} from "./command-line/utils";
import {initToken} from "./command-line/initToken";

const debug = require('debug')('swap-token:main');

describe('sb-renting', () => {
  // admint wallet
  // 2z5Hdf8f5Z9EcNbybvcNRtQj3WVychSD2SYNmSaAy1dZ
  const adminWallet = anchor.web3.Keypair.fromSecretKey(new Uint8Array(PROGRAM_ADMIN_PRIMARY_WALLET));
  debug('Admin wallet is %s', adminWallet.publicKey.toBase58());

  describe('create token', () => {
    let program: any;
    before(async () => {
      program = await loadProgram(
          adminWallet,
          'devnet',
          programId,
          'https://winter-flashy-dawn.solana-devnet.discover.quiknode.pro/c7023a9cfda5932a4e18ec7f381e98cc2226c22e/'
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

  });

});
