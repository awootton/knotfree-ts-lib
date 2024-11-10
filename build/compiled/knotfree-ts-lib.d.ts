import * as nacl from 'tweetnacl-ts';
import { Buffer } from 'buffer';

type ServerConfigItem = {
    name: string;
    port: number;
    host?: string;
};
declare const EmptyServerConfigItem: ServerConfigItem;
type ServerConfigList = {
    token: string;
    items: ServerConfigItem[];
};
declare var EmptyServerConfigList: ServerConfigList;
declare var serverConfigList: ServerConfigList;
declare function GetName2Config(name: string): ServerConfigItem;
declare function StringToMap(str: string): Map<string, string>;
declare function MapToString(map: Map<string, string>): string;
type NameStatusType = {
    Exists: boolean;
    Online: boolean;
};
type WatchedTopic = {
    name: string;
    namestr: string;
    exp: number;
    opt: Map<string, string>;
    jwtid: string;
    own: string;
};
declare const nameTypes: string[];
declare function getInternalName(aName: string, nameType: string): string;
declare function getExternalName(aName: string, nameType: string): string;
declare let knotfreeApiPublicKey: string;
declare function SetKnotfreeApiPublicKey(k: string): void;
interface LooseObject {
    [key: string]: any;
}
type KnotFreeTokenPayload = {
    exp: number;
    iss: string;
    jti: string;
    in: number;
    out: number;
    su: number;
    co: number;
    url: string;
    pubk: string;
};
declare const EmptyKnotFreeTokenPayload: KnotFreeTokenPayload;
type KnotFreeTokenStats = {
    in: number;
    out: number;
    su: number;
    co: number;
};
declare const EmptyKnotFreeTokenStats: KnotFreeTokenStats;
declare const EmptyKnotFreeTokenStatsLimits: KnotFreeTokenStats;
type ClusterStat = {
    contactStats: KnotFreeTokenStats;
    buf: number;
    name: string;
    http: string;
    tcp: string;
    guru: boolean;
    mem: number;
    con: number;
    limits: {
        contactStats: KnotFreeTokenStats;
    };
};
type ClusterStats = {
    When: number;
    Stats: ClusterStat[];
};
declare const EmptyClusterStats: ClusterStats;

type Types_d_ClusterStat = ClusterStat;
type Types_d_ClusterStats = ClusterStats;
declare const Types_d_EmptyClusterStats: typeof EmptyClusterStats;
declare const Types_d_EmptyKnotFreeTokenPayload: typeof EmptyKnotFreeTokenPayload;
declare const Types_d_EmptyKnotFreeTokenStats: typeof EmptyKnotFreeTokenStats;
declare const Types_d_EmptyKnotFreeTokenStatsLimits: typeof EmptyKnotFreeTokenStatsLimits;
declare const Types_d_EmptyServerConfigItem: typeof EmptyServerConfigItem;
declare const Types_d_EmptyServerConfigList: typeof EmptyServerConfigList;
declare const Types_d_GetName2Config: typeof GetName2Config;
type Types_d_KnotFreeTokenPayload = KnotFreeTokenPayload;
type Types_d_KnotFreeTokenStats = KnotFreeTokenStats;
type Types_d_LooseObject = LooseObject;
declare const Types_d_MapToString: typeof MapToString;
type Types_d_NameStatusType = NameStatusType;
type Types_d_ServerConfigItem = ServerConfigItem;
type Types_d_ServerConfigList = ServerConfigList;
declare const Types_d_SetKnotfreeApiPublicKey: typeof SetKnotfreeApiPublicKey;
declare const Types_d_StringToMap: typeof StringToMap;
type Types_d_WatchedTopic = WatchedTopic;
declare const Types_d_getExternalName: typeof getExternalName;
declare const Types_d_getInternalName: typeof getInternalName;
declare const Types_d_knotfreeApiPublicKey: typeof knotfreeApiPublicKey;
declare const Types_d_nameTypes: typeof nameTypes;
declare const Types_d_serverConfigList: typeof serverConfigList;
declare namespace Types_d {
  export { type Types_d_ClusterStat as ClusterStat, type Types_d_ClusterStats as ClusterStats, Types_d_EmptyClusterStats as EmptyClusterStats, Types_d_EmptyKnotFreeTokenPayload as EmptyKnotFreeTokenPayload, Types_d_EmptyKnotFreeTokenStats as EmptyKnotFreeTokenStats, Types_d_EmptyKnotFreeTokenStatsLimits as EmptyKnotFreeTokenStatsLimits, Types_d_EmptyServerConfigItem as EmptyServerConfigItem, Types_d_EmptyServerConfigList as EmptyServerConfigList, Types_d_GetName2Config as GetName2Config, type Types_d_KnotFreeTokenPayload as KnotFreeTokenPayload, type Types_d_KnotFreeTokenStats as KnotFreeTokenStats, type Types_d_LooseObject as LooseObject, Types_d_MapToString as MapToString, type Types_d_NameStatusType as NameStatusType, type Types_d_ServerConfigItem as ServerConfigItem, type Types_d_ServerConfigList as ServerConfigList, Types_d_SetKnotfreeApiPublicKey as SetKnotfreeApiPublicKey, Types_d_StringToMap as StringToMap, type Types_d_WatchedTopic as WatchedTopic, Types_d_getExternalName as getExternalName, Types_d_getInternalName as getInternalName, Types_d_knotfreeApiPublicKey as knotfreeApiPublicKey, Types_d_nameTypes as nameTypes, Types_d_serverConfigList as serverConfigList };
}

declare function KnotNameHash2Buffer(name: string): Buffer;
declare function KnotNameHash64(name: string): string;
declare function BoxItItUp(message: Buffer, nonce: Buffer, theirPublicKey: Buffer, ourSecretKey: Buffer): Buffer;
declare function UnBoxIt(message: Buffer, nonce: Buffer, theirPublicKey: Buffer, ourSecretKey: Buffer): Buffer;
declare function AddHeartbeatCallback(key: string, cb: () => void): void;
declare function StartHeartbeatTimer(): void;
declare function Sha256Hash(str: string): Uint8Array;
declare function getBoxKeyPairFromPassphrase(phrase: string): nacl.BoxKeyPair;
declare function KeypairToBase64(keypair: nacl.BoxKeyPair): [string, string];
declare function getBase64FromPassphrase(phrase: string): [string, string];
declare function GetPayloadFromToken(token: string): [KnotFreeTokenPayload, string];
declare function toBase64Url(buf: Buffer): string;
declare function fromBase64Url(str: string): Buffer;
declare function toHexString(bytes: Buffer): string;
declare function fromHexString(hexString: string): Buffer;
declare function randomString(len: number): string;
declare function TokenPayloadToText(payload: KnotFreeTokenPayload): string;
declare function TokenToLimitsText(token: string): string;
declare function KnotFreeTokenStatsToText(payload: KnotFreeTokenStats): string;

declare const utils_d_AddHeartbeatCallback: typeof AddHeartbeatCallback;
declare const utils_d_BoxItItUp: typeof BoxItItUp;
declare const utils_d_GetPayloadFromToken: typeof GetPayloadFromToken;
declare const utils_d_KeypairToBase64: typeof KeypairToBase64;
declare const utils_d_KnotFreeTokenStatsToText: typeof KnotFreeTokenStatsToText;
declare const utils_d_KnotNameHash2Buffer: typeof KnotNameHash2Buffer;
declare const utils_d_KnotNameHash64: typeof KnotNameHash64;
declare const utils_d_Sha256Hash: typeof Sha256Hash;
declare const utils_d_StartHeartbeatTimer: typeof StartHeartbeatTimer;
declare const utils_d_TokenPayloadToText: typeof TokenPayloadToText;
declare const utils_d_TokenToLimitsText: typeof TokenToLimitsText;
declare const utils_d_UnBoxIt: typeof UnBoxIt;
declare const utils_d_fromBase64Url: typeof fromBase64Url;
declare const utils_d_fromHexString: typeof fromHexString;
declare const utils_d_getBase64FromPassphrase: typeof getBase64FromPassphrase;
declare const utils_d_getBoxKeyPairFromPassphrase: typeof getBoxKeyPairFromPassphrase;
declare const utils_d_randomString: typeof randomString;
declare const utils_d_toBase64Url: typeof toBase64Url;
declare const utils_d_toHexString: typeof toHexString;
declare namespace utils_d {
  export { utils_d_AddHeartbeatCallback as AddHeartbeatCallback, utils_d_BoxItItUp as BoxItItUp, utils_d_GetPayloadFromToken as GetPayloadFromToken, utils_d_KeypairToBase64 as KeypairToBase64, utils_d_KnotFreeTokenStatsToText as KnotFreeTokenStatsToText, utils_d_KnotNameHash2Buffer as KnotNameHash2Buffer, utils_d_KnotNameHash64 as KnotNameHash64, utils_d_Sha256Hash as Sha256Hash, utils_d_StartHeartbeatTimer as StartHeartbeatTimer, utils_d_TokenPayloadToText as TokenPayloadToText, utils_d_TokenToLimitsText as TokenToLimitsText, utils_d_UnBoxIt as UnBoxIt, utils_d_fromBase64Url as fromBase64Url, utils_d_fromHexString as fromHexString, utils_d_getBase64FromPassphrase as getBase64FromPassphrase, utils_d_getBoxKeyPairFromPassphrase as getBoxKeyPairFromPassphrase, utils_d_randomString as randomString, utils_d_toBase64Url as toBase64Url, utils_d_toHexString as toHexString };
}

declare function getFreeToken(prefix: string, serverName: string, done: (ok: boolean, tok: string) => any, usersPublicKey: string, usersPrivateKey: string): void;

declare const AccessTokenPageUtil_d_getFreeToken: typeof getFreeToken;
declare namespace AccessTokenPageUtil_d {
  export { AccessTokenPageUtil_d_getFreeToken as getFreeToken };
}

declare function ignoreThisFunction(x: number, y: number): number;

export { getFreeToken, ignoreThisFunction, AccessTokenPageUtil_d as tokenutil, Types_d as types, utils_d as utils };
