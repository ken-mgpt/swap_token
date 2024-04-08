import { Command } from 'commander';
import {loadProgram, loadWalletKey} from './utils';
import {ADMINWALLET, programId} from '../const';
import {initToken} from "./initToken";
import {swapToken} from "./swap-token";
import {PublicKey} from "@solana/web3.js";
import {Program, web3} from "@project-serum/anchor";
import * as anchor from "@coral-xyz/anchor";
const program = new Command();

const debug = require('debug')('swap-token:main');

function programCommand(
  name: string,
  options: { requireWallet: boolean } = { requireWallet: true },
) {
  let cmProgram = program
    .command(name)
    .option(
      '-e, --env <string>',
      'Solana cluster env name',
      'devnet', //mainnet-beta, testnet, devnet
    )
    .option('-r, --rpc <string>', 'rpc endpoint', 'https://api.devnet.solana.com');

  if (options.requireWallet) {
    cmProgram = cmProgram.requiredOption('-k, --keypair <path>', `Solana wallet location`);
  }

  return cmProgram;
}
// Derive the address (public key) of a greeting account from the program so that it's easy to find later.
programCommand('initToken')
    .requiredOption('-d, --decimals <number>', 'decimals of token')
  .action(async (options) => {
    debug('options: ', options);
    const keypairPath = options.keypair;
    const env = options.env;
    const rpc = options.rpc;
    const decimal = options.decimals
    debug('keypairPath: ', keypairPath);
    const adminWallet = await loadWalletKey(keypairPath);
    //devnet rpc: https://winter-flashy-dawn.solana-devnet.discover.quiknode.pro/c7023a9cfda5932a4e18ec7f381e98cc2226c22e/
    const program = await loadProgram(adminWallet, env, programId.toString(), rpc);
    await initToken(program, adminWallet, decimal);
  });

programCommand('swapToken')
    .requiredOption('-a, --amount <number>', 'amount of sol swap')
    .requiredOption('-m, --mint <string>', 'token address')
    .action(async (options) => {
        debug('options: ', options);
        const keypairPath = options.keypair;
        const env = options.env;
        const rpc = options.rpc;
        const amount = options.amount
        const tokenAddress = options.mint
        debug('keypairPath: ', keypairPath);
        const userWallet = await loadWalletKey(keypairPath);
        const mint = new PublicKey(tokenAddress);
        //devnet rpc: https://winter-flashy-dawn.solana-devnet.discover.quiknode.pro/c7023a9cfda5932a4e18ec7f381e98cc2226c22e/
        const program = await loadProgram(userWallet, env, programId.toString(), rpc);

        const mint_authority = await web3.PublicKey.findProgramAddress(
            [Buffer.from('mint_to'), mint.toBuffer()],
            program.programId,
        );
        console.log('mint_to_authority: ', mint_authority[0].toString());

        await swapToken(program, userWallet, mint, ADMINWALLET, mint_authority[0], amount);
    });
program.parse(process.argv);
