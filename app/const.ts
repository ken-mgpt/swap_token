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

// wallet: 2z5Hdf8f5Z9EcNbybvcNRtQj3WVychSD2SYNmSaAy1dZ
export const PROGRAM_ADMIN_PRIMARY_WALLET = [
    224, 34, 123, 251, 222, 121, 159, 205, 198, 219, 97, 146, 169, 24, 121, 140, 212, 142, 48, 10, 14,
    98, 238, 27, 166, 100, 78, 216, 75, 148, 248, 40, 29, 122, 163, 221, 110, 183, 140, 40, 33, 251,
    150, 160, 88, 6, 228, 137, 59, 211, 106, 141, 186, 236, 69, 56, 215, 190, 227, 33, 108, 44, 209,
    120,
];
