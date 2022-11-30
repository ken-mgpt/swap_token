import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

// devnet
export const programId = new anchor.web3.PublicKey('62ztfPnBnder4D8cgmztnQjWFFwbB18EkhRRgeYpoMoG');
// testnet
// export const programId = new anchor.web3.PublicKey('2ju1JMCGuDAWPhMrkFRH5oXNcfXESEzeSjngrADDouK9');

export const SOL_ADDRESS = new anchor.web3.PublicKey('So11111111111111111111111111111111111111112');
