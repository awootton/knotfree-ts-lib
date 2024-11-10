// import * as saved from './SavedStuff'
export const EmptyServerConfigItem = {
    name: "",
    // hashedName: Buffer.from(""),
    // nameReservationToken: "",
    port: 0, // for forwarding http
    // directory: "", // where the data lives
    // passphrase: [],
    host: "localhost"
};
export var EmptyServerConfigList = {
    token: "default-config-token-needs-replacing",
    items: []
};
export var serverConfigList = EmptyServerConfigList;
export function GetName2Config(name) {
    for (let item of serverConfigList.items) {
        if (item.name === name) {
            return item;
        }
    }
    return EmptyServerConfigItem;
}
// export type RequestCallbackType = (arg0: PublishReply) => void
// export const EmptyRequestCallbackType: RequestCallbackType = (arg0: PublishReply) => { }
// Example of a WatchedTopic from Go
// { 
//     "name":"0SNeBUs7Ab0Y-ndIST3TdYem36hT02PO",
//     "namestr":"a-person-channel_iot",
//     "opt":{
//        "A":"216.128.128.195",
//        "WEB":"get-unix-time.knotfree.net"
//     },
//     "jwtid":"anzxis8oivx8z7o7dciekhni",
//     "own":"blRyuFY51TT7jL6GBLHPYjE5-nAV_Cc2wUEuXmkqNCU"
//  },
export function StringToMap(str) {
    const map = new Map();
    let tmp = str.trim();
    const entries = tmp.split(' ');
    if (entries.length === 0)
        return map;
    if (entries.length === 1) {
        map.set('@', entries[0].trim());
        return map;
    }
    for (let i = 0; i < entries.length; i++) {
        let key = entries[i];
        let val = entries[i + 1];
        i += 1;
        map.set(key.trim(), val.trim());
    }
    return map;
}
export function MapToString(map) {
    let str = '';
    for (let [key, value] of map) {
        str += key + ' ' + value + ' ';
    }
    return str.trim();
}
export const nameTypes = ['.iot', '.vr', '.pod', 'plain'];
export function getInternalName(aName, nameType) {
    if (nameType === 'plain') {
        return aName;
    }
    return aName + '_' + nameType.substring(1);
}
export function getExternalName(aName, nameType) {
    if (nameType === 'plain') {
        return aName;
    }
    return aName + '.' + nameType.substring(1);
}
export let knotfreeApiPublicKey = "";
export function SetKnotfreeApiPublicKey(k) {
    knotfreeApiPublicKey = k;
}
export const EmptyKnotFreeTokenPayload = {
    //
    exp: 0,
    iss: "",
    jti: "",
    in: 0,
    out: 0,
    su: 0,
    co: 0,
    url: "",
    pubk: ""
};
export const EmptyKnotFreeTokenStats = {
    in: 0,
    out: 0,
    su: 0,
    co: 0,
};
export const EmptyKnotFreeTokenStatsLimits = {
    in: 1,
    out: 1,
    su: 1,
    co: 1,
};
export const EmptyClusterStats = {
    When: 0,
    Stats: [
    //     {
    //     contactStats: EmptyKnotFreeTokenStats,
    //     buf: 0,
    //     name: 'dummy',
    //     http: '1.1.1.1',
    //     tcp: '1.1.1.1',
    //     guru: false,
    //     mem: 12345678,
    //     limits: {
    //         contactStats: EmptyKnotFreeTokenStatsLimits
    //     }
    // }
    ]
};
//# sourceMappingURL=Types.js.map