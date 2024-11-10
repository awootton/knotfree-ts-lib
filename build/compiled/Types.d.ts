export type ServerConfigItem = {
    name: string;
    port: number;
    host?: string;
};
export declare const EmptyServerConfigItem: ServerConfigItem;
export type ServerConfigList = {
    token: string;
    items: ServerConfigItem[];
};
export declare var EmptyServerConfigList: ServerConfigList;
export declare var serverConfigList: ServerConfigList;
export declare function GetName2Config(name: string): ServerConfigItem;
export declare function StringToMap(str: string): Map<string, string>;
export declare function MapToString(map: Map<string, string>): string;
export type NameStatusType = {
    Exists: boolean;
    Online: boolean;
};
export type WatchedTopic = {
    name: string;
    namestr: string;
    exp: number;
    opt: Map<string, string>;
    jwtid: string;
    own: string;
};
export declare const nameTypes: string[];
export declare function getInternalName(aName: string, nameType: string): string;
export declare function getExternalName(aName: string, nameType: string): string;
export declare let knotfreeApiPublicKey: string;
export declare function SetKnotfreeApiPublicKey(k: string): void;
export interface LooseObject {
    [key: string]: any;
}
export type KnotFreeTokenPayload = {
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
export declare const EmptyKnotFreeTokenPayload: KnotFreeTokenPayload;
export type KnotFreeTokenStats = {
    in: number;
    out: number;
    su: number;
    co: number;
};
export declare const EmptyKnotFreeTokenStats: KnotFreeTokenStats;
export declare const EmptyKnotFreeTokenStatsLimits: KnotFreeTokenStats;
export type ClusterStat = {
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
export type ClusterStats = {
    When: number;
    Stats: ClusterStat[];
};
export declare const EmptyClusterStats: ClusterStats;
