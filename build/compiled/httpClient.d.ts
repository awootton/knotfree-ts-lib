import { Buffer } from 'buffer';
import * as client from './client';
import * as packets from './packets';
import * as types from './Types';
export type httpClientGadget = {
    httpMonger: HttpMonger;
    haveNewConfig: (newConfig: types.ServerConfigList) => any;
};
export declare const startHttpProxy: (config: types.ServerConfigList, host: string, port: number) => httpClientGadget;
export type HttpMonger = {
    packer: client.Packetizer;
    onConnect: (http: HttpMonger) => any;
    onMessage: (http: HttpMonger, got: Buffer, send: packets.Send) => any;
    write: (b: Buffer, from: packets.Send) => any;
};
export declare function NewDefaultHttpMonger(): HttpMonger;
export declare function parseHttp(buffer: Buffer): number;
export type ReplyMonger = {
    connectInfo: client.ConnectInfo;
    onMessage: (monger: ReplyMonger, msg: Buffer) => any;
    httpMonger: HttpMonger;
    send: packets.Send;
};
export declare function NewDefaultReplyMonger(httpMonger: HttpMonger, send: packets.Send): ReplyMonger;
