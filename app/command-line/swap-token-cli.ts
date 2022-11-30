import { Command } from 'commander';
import {loadProgram, loadWalletKey} from './utils';
import { programId } from '../const';
import {initToken} from "./initToken";
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
    .option('-r, --rpc <string>', 'rpc endpoint', '');

  if (options.requireWallet) {
    cmProgram = cmProgram.requiredOption('-k, --keypair <path>', `Solana wallet location`);
  }

  return cmProgram;
}

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
program.parse(process.argv);
