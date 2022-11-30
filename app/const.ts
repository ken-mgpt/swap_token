import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

// devnet
export const programId = new anchor.web3.PublicKey('62ztfPnBnder4D8cgmztnQjWFFwbB18EkhRRgeYpoMoG');

export const ADMINWALLET = new anchor.web3.PublicKey('J2SDVLXSs8VTD46HsvphoJL3zF7HKU4KkjWMXUMDehix');
export const FAKE_ADMIN_WALLET = new anchor.web3.PublicKey('2z5Hdf8f5Z9EcNbybvcNRtQj3WVychSD2SYNmSaAy1dZ');
// testnet
// export const programId = new anchor.web3.PublicKey('2ju1JMCGuDAWPhMrkFRH5oXNcfXESEzeSjngrADDouK9');

export const SOL_ADDRESS = new anchor.web3.PublicKey('So11111111111111111111111111111111111111112');

export const TOKEN_ADDRESS = new anchor.web3.PublicKey('8YWeEZwxajvuEoe4oYsDVBMGhYLQXCjfRERH1Qdhe4oo');

export const FAKE_TOKEN_ADDRESS = new anchor.web3.PublicKey('58xGcTaN6BCCB5NwLwoTrPyEH7BCjqqESqV7r1UzZt9U');

// wallet: 2z5Hdf8f5Z9EcNbybvcNRtQj3WVychSD2SYNmSaAy1dZ
export const PROGRAM_USER_PRIMARY_WALLET = [
    224, 34, 123, 251, 222, 121, 159, 205, 198, 219, 97, 146, 169, 24, 121, 140, 212, 142, 48, 10, 14,
    98, 238, 27, 166, 100, 78, 216, 75, 148, 248, 40, 29, 122, 163, 221, 110, 183, 140, 40, 33, 251,
    150, 160, 88, 6, 228, 137, 59, 211, 106, 141, 186, 236, 69, 56, 215, 190, 227, 33, 108, 44, 209,
    120,
];

// wallet: J2SDVLXSs8VTD46HsvphoJL3zF7HKU4KkjWMXUMDehix
export const PROGRAM_ADMIN_PRIMARY_WALLET = [
    78, 236, 146,   3,  47,  72, 101, 254, 190, 243,  86,
    215,  51, 109, 145,  46,  78, 235, 238, 143, 219, 223,
    79, 174,  64, 112, 126, 129, 248, 213, 208, 160, 252,
    244, 197,   5,  46, 219,  94,  71,  33,  26, 181, 136,
    40,  22,  49,  42, 179,   7, 160,  52,  43,  41, 151,
    6,  23, 154,  95, 177,   8, 231,  85, 233
];
