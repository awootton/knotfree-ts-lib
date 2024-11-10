import * as nacl from 'tweetnacl-ts';
export {};
export declare function getBoxKeyPairFromPassphrase(phrase: string): nacl.BoxKeyPair;
export declare function BoxItItUp(message: Buffer, nonce: Buffer, theirPublicKey: Buffer, ourSecretKey: Buffer): Buffer;
export declare function UnBoxIt(message: Buffer, nonce: Buffer, theirPublicKey: Buffer, ourSecretKey: Buffer): Buffer;
