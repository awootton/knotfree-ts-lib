import { Buffer } from 'buffer';
export declare class Universal {
    commandType: string;
    data: Uint8Array[];
    constructor(commandType: string, data: Uint8Array[]);
    toString(): string;
}
export declare function MakeUniversal(value: any): Universal;
export declare function MakeNullUniversal(): Universal;
export declare function FromBuffer(buffer: Buffer): [u: Universal | undefined, b: Buffer];
export declare function ToBytes(u: Universal): Buffer;
export type PacketCommon = {
    backingUniversal: Universal;
    optionalKeyValues: Map<string, Uint8Array>;
    toBackingUniversal: () => any;
};
export declare function PacketToBytes(packet: PacketCommon): Buffer;
type AddressUnion = {
    Type: string;
    Bytes: Uint8Array;
};
export interface Connect extends PacketCommon {
}
export declare function MakeConnect(): Connect;
export declare function FillConnect(u: Universal): Connect | undefined;
export interface Disconnect extends PacketCommon {
}
export interface Ping extends PacketCommon {
}
export interface MessageCommon extends PacketCommon {
    Address: AddressUnion;
}
export interface Subscribe extends MessageCommon {
}
export declare function MakeSubscribe(): Subscribe;
export declare function FillSubscribe(u: Universal): Subscribe | undefined;
export interface Unsubscribe extends MessageCommon {
}
export interface Send extends MessageCommon {
    Source: AddressUnion;
    Payload: Uint8Array;
}
export declare function MakeSend(): Send;
export declare function FillSend(u: Universal): Send | undefined;
export interface Lookup extends MessageCommon {
    Source: AddressUnion;
}
export declare function MakeLookup(): Lookup;
export declare function FillLookup(u: Universal): Lookup | undefined;
export declare function isAscii(bytes: Uint8Array): boolean;
export declare function Asciiizer(bytes: Uint8Array, max: number): string;
export {};
