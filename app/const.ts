import {PublicKey} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

// devnet
export const programId = new anchor.web3.PublicKey('FYLshD5yWikqKSxRc6wCn1Y3Dtm3auoXa29zLPuXbos8');

export const ADMINWALLET = new anchor.web3.PublicKey('3kwmA3oULd3mtkk5ksp3ZUqB3b4Bh94MPq1MdaEnMBpu');
export const FAKE_ADMIN_WALLET = new anchor.web3.PublicKey('DJ7Ra5u3NY63Y51qdGDh7vB9j8jBowhVbszxhqzvCfmw');
// testnet
// export const programId = new anchor.web3.PublicKey('2ju1JMCGuDAWPhMrkFRH5oXNcfXESEzeSjngrADDouK9');

export const SOL_ADDRESS = new anchor.web3.PublicKey('So11111111111111111111111111111111111111112');

export const TOKEN_ADDRESS = new anchor.web3.PublicKey('65dCgphWTcHh2MrxcHpBRTwcFveH6zTWFXUKbHfYUxMP');

export const FAKE_TOKEN_ADDRESS = new anchor.web3.PublicKey('8sSnbvgjABijQaHEvbDm79ky5aCgiF6N7dzBZMVd9PBt');

// wallet: 2z5Hdf8f5Z9EcNbybvcNRtQj3WVychSD2SYNmSaAy1dZ
export const PROGRAM_USER_PRIMARY_WALLET = [
    112, 174, 234, 4, 78, 153, 125, 188, 176, 19, 171, 86, 106, 171, 216, 211, 195, 150, 180, 86, 35, 180, 233, 131, 175,
    127, 136, 212, 65, 23, 183, 181, 182, 174, 97, 77, 144, 115, 122, 103, 206, 195, 150, 97, 250, 74, 163, 164, 66, 58,
    151, 96, 194, 219, 229, 205, 142, 55, 187, 201, 192, 237, 171, 46
    ]

// wallet: J2SDVLXSs8VTD46HsvphoJL3zF7HKU4KkjWMXUMDehix
export const PROGRAM_ADMIN_PRIMARY_WALLET = [
    38, 6, 61, 99, 15, 178, 228, 57, 106, 140, 53, 169, 21, 178, 133,
    201, 83, 174, 53, 238, 105, 123, 2, 250, 80, 38, 198, 187, 245, 99, 3, 246, 40, 249, 68, 119, 222, 45, 59, 226, 20,
    148, 72, 64, 70, 19, 111, 84, 155, 132, 10, 92, 172, 156, 70, 51, 171, 55, 223, 16, 239, 100, 10, 146
];
