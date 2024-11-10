import * as net from 'net';
import * as packets from './packets';
export type ConnectInfo = {
    private_client_not_for_use: net.Socket | any;
    host: string;
    port: number;
    onConnect: () => any;
    onDisconnect: (err: Error) => any;
    onMessage: (msg: Uint8Array) => any;
    verbose?: boolean;
    verboseRaw?: boolean;
    write: (msg: Uint8Array, logMessage: string) => any;
};
export declare const defaultConnectInfo: ConnectInfo;
export type Restarter = {
    connectInfo: ConnectInfo;
    onConnect: (r: Restarter) => any;
    onDisconnect: (r: Restarter, err: Error) => any;
    onMessage: (r: Restarter, msg: Uint8Array) => any;
    dontReconnect: boolean;
};
export declare function NewDefaultRestarter(): Restarter;
export declare function StartRestarter(restarter: Restarter): void;
export type Packetizer = {
    restarter: Restarter;
    onConnect: (packer: Packetizer) => any;
    onPacket: (packer: Packetizer, u: packets.Universal) => any;
    write: (p: packets.PacketCommon) => any;
    token: string;
    subs: string[];
    doSubscriptions: (packer: Packetizer) => any;
};
export declare function NewDefaultPacketizer(): Packetizer;
export declare function Startup(params: ConnectInfo): void;
