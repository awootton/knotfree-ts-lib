'use strict';

var nacl = require('tweetnacl-ts');
var buffer = require('buffer');
var sha256 = require('fast-sha256');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var nacl__namespace = /*#__PURE__*/_interopNamespaceDefault(nacl);

// The Base64Url encoding
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
var b64reverse = buffer.Buffer.alloc(128);
for (var i = 0; i < b64reverse.length; i++) {
    b64reverse[i] = 0;
}
for (var i = 0; i < b64ch.length; i++) {
    var tmp = b64ch.charCodeAt(i);
    b64reverse[tmp] = i;
}
// see https://en.wikipedia.org/wiki/Base64
// so we can also decode regular base64 
b64reverse["+".charCodeAt(0)] = 62;
b64reverse["/".charCodeAt(0)] = 63;
function encode(bytes) {
    var dest = buffer.Buffer.alloc(Math.floor(bytes.length * 4 / 3 + .999));
    var s = 0;
    for (var i = 0; i < bytes.length;) {
        const zero = bytes[i];
        i += 1;
        const one = i < bytes.length ? bytes[i] : 0;
        i += 1;
        const two = i < bytes.length ? bytes[i] : 0;
        i += 1;
        var sum = 0;
        var tmp = zero >> 2;
        sum = b64ch.charCodeAt(tmp);
        dest[s++] = sum;
        tmp = ((zero & 3) << 4) + (one >> 4);
        sum = b64ch.charCodeAt(tmp);
        dest[s++] = sum;
        tmp = ((one & 0x0F) << 2) + (two >> 6);
        sum = b64ch.charCodeAt(tmp);
        dest[s++] = sum;
        tmp = (two & 0x03F);
        sum = b64ch.charCodeAt(tmp);
        dest[s++] = sum;
    }
    return dest.toString('utf8');
}
function decode(str) {
    var dest = buffer.Buffer.alloc(Math.floor(str.length * 3 / 4));
    var destI = 0;
    for (var i = 0; i < str.length;) {
        // 4 chars are 3 bytes
        var char1 = b64reverse[str.charCodeAt(i)];
        i += 1;
        var char2 = i < str.length ? b64reverse[str.charCodeAt(i)] : 0;
        i += 1;
        var char3 = i < str.length ? b64reverse[str.charCodeAt(i)] : 0;
        i += 1;
        var char4 = i < str.length ? b64reverse[str.charCodeAt(i)] : 0;
        i += 1;
        // there's 6 bits in each 'char'
        var n = (((((char1 << 6) + char2) << 6) + char3) << 6) + char4;
        // now we have 3 bytes
        dest[destI++] = n >> 16;
        if (destI < dest.length) {
            dest[destI++] = n >> 8;
        }
        if (destI < dest.length) {
            dest[destI++] = n;
        }
    }
    return dest;
}
// Copyright 2021-2024 Alan Tracey Wootton
// See LICENSE
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// import * as saved from './SavedStuff'
const EmptyServerConfigItem = {
    name: "",
    // hashedName: Buffer.from(""),
    // nameReservationToken: "",
    port: 0, // for forwarding http
    // directory: "", // where the data lives
    // passphrase: [],
    host: "localhost"
};
var EmptyServerConfigList = {
    token: "default-config-token-needs-replacing",
    items: []
};
var serverConfigList = EmptyServerConfigList;
function GetName2Config(name) {
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
function StringToMap(str) {
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
function MapToString(map) {
    let str = '';
    for (let [key, value] of map) {
        str += key + ' ' + value + ' ';
    }
    return str.trim();
}
const nameTypes = ['.iot', '.vr', '.pod', 'plain'];
function getInternalName(aName, nameType) {
    if (nameType === 'plain') {
        return aName;
    }
    return aName + '_' + nameType.substring(1);
}
function getExternalName(aName, nameType) {
    if (nameType === 'plain') {
        return aName;
    }
    return aName + '.' + nameType.substring(1);
}
let knotfreeApiPublicKey = "";
function SetKnotfreeApiPublicKey(k) {
    knotfreeApiPublicKey = k;
}
const EmptyKnotFreeTokenPayload = {
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
const EmptyKnotFreeTokenStats = {
    in: 0,
    out: 0,
    su: 0,
    co: 0,
};
const EmptyKnotFreeTokenStatsLimits = {
    in: 1,
    out: 1,
    su: 1,
    co: 1,
};
const EmptyClusterStats = {
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

var Types = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EmptyClusterStats: EmptyClusterStats,
    EmptyKnotFreeTokenPayload: EmptyKnotFreeTokenPayload,
    EmptyKnotFreeTokenStats: EmptyKnotFreeTokenStats,
    EmptyKnotFreeTokenStatsLimits: EmptyKnotFreeTokenStatsLimits,
    EmptyServerConfigItem: EmptyServerConfigItem,
    EmptyServerConfigList: EmptyServerConfigList,
    GetName2Config: GetName2Config,
    MapToString: MapToString,
    SetKnotfreeApiPublicKey: SetKnotfreeApiPublicKey,
    StringToMap: StringToMap,
    getExternalName: getExternalName,
    getInternalName: getInternalName,
    get knotfreeApiPublicKey () { return knotfreeApiPublicKey; },
    nameTypes: nameTypes,
    serverConfigList: serverConfigList
});

// KnotNameHash must match exactly what KnotFree does to topics.
function KnotNameHash2Buffer(name) {
    const hbuff = buffer.Buffer.from(Sha256Hash(name));
    return hbuff.subarray(0, 24); // 24 high bits of the sha256
}
// KnotNameHash must match exactly what KnotFree does to topics.
function KnotNameHash64(name) {
    const hbuff = buffer.Buffer.from(Sha256Hash(name));
    var tmp = toBase64Url(hbuff);
    tmp = tmp.slice(0, 32);
    return tmp;
}
// See Helpers.tsx for utilities that return JSX
function BoxItItUp(message, nonce, theirPublicKey, ourSecretKey) {
    const mySecretKey = ourSecretKey;
    const rtmp = nacl__namespace.box(message, nonce, theirPublicKey, mySecretKey);
    const result = buffer.Buffer.from(rtmp);
    return result;
}
function UnBoxIt(message, nonce, theirPublicKey, ourSecretKey) {
    var publicKey = theirPublicKey;
    const mySecretKey = ourSecretKey;
    const rtmp = nacl__namespace.box_open(message, nonce, publicKey, mySecretKey);
    const result = buffer.Buffer.from(rtmp || buffer.Buffer.from(""));
    return result;
}
// is this going to leak?
const heartbeatCallbacks = new Map();
function AddHeartbeatCallback(key, cb) {
    const got = heartbeatCallbacks.get(key);
    heartbeatCallbacks.set(key, cb);
    if (got === undefined) {
        // if it's our first time
        // take a breath
        setTimeout(() => { cb(); }, 1000);
    }
}
function StartHeartbeatTimer() {
    console.log("starting heartbeatTimer");
    setInterval(() => {
        // console.log("running heartbeatTimer")
        heartbeatCallbacks.forEach((value, key) => {
            // console.log(key);  
            value();
        });
    }, 30 * 1000);
}
function Sha256Hash(str) {
    const data = buffer.Buffer.from(str);
    return sha256(data);
}
/* eg
    testString123 makes sender public key   bht-Ka3j7GKuMFOablMlQnABnBvBeugvSf4CdFV3LXs
    testString123 makes sender secret key   VY5e4pCAwDlr-HdfioX6TCiv41Xx_SsTtUcupKndFpQ
    myFamousOldeSaying makes public key   oXbblDIxBsJSt2tYSt20bNLsqs9vIcvZ-WPfZ2uHGgg
    myFamousOldeSaying makes secret key   qhZfxAgr5TypCJ-eQ94pf_LoSskBvVAnYfAKx10ppOA
*/
function getBoxKeyPairFromPassphrase(phrase) {
    const hashBytes = Sha256Hash(phrase);
    const seedKeyPair3 = nacl__namespace.box_keyPair_fromSecretKey(hashBytes);
    return seedKeyPair3;
}
function KeypairToBase64(keypair) {
    const pubstr = toBase64Url(buffer.Buffer.from(keypair.publicKey));
    const privstr = toBase64Url(buffer.Buffer.from(keypair.secretKey));
    return [pubstr, privstr];
}
function getBase64FromPassphrase(phrase) {
    const kp = getBoxKeyPairFromPassphrase(phrase);
    return KeypairToBase64(kp);
}
function GetPayloadFromToken(token) {
    const parts = token.split(".");
    if (parts.length !== 3) {
        return [EmptyKnotFreeTokenPayload, "not a JWT token "];
    }
    const payloadStr = fromBase64Url(parts[1]).toString();
    // console.log("payloadStr", payloadStr)
    const payload = JSON.parse(payloadStr);
    return [payload, ""];
}
// base64 convert base64 encode base64
function toBase64Url(buf) {
    const result = encode(buf);
    // const lll = result.length 32 to 43
    return result;
}
function fromBase64Url(str) {
    const buf = decode(str);
    //const lll = buf.length // 43 to 32
    return buf;
}
function toHexString(bytes) {
    return bytes.toString('hex'); // .toUpperCase();
}
function fromHexString(hexString) {
    return buffer.Buffer.from(hexString, 'hex');
}
// FIXME: atw use crypto.randomBytes(size[, callback]) and convert to b64 ?
// randomString returns a random string of length len in base 62
function randomString(len) {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}
function TokenPayloadToText(payload) {
    let expires = new Date(payload.exp * 1000);
    let expiresStr = expires.getFullYear() + '-' + (expires.getMonth() + 1) + '-' + expires.getDate();
    if (payload.exp <= 1) {
        expiresStr = 'unknown';
    }
    let str = '';
    str += 'Maximum subscriptions       = ' + payload.su + "\n";
    str += 'Maximum connections         = ' + payload.co + "\n";
    str += 'Maximum bytes per sec input = ' + payload.in + "\n";
    str += 'Maximum bytes per sec output = ' + payload.out + "\n";
    str += 'Token expires               = ' + expiresStr + "\n";
    str += 'Token server                = ' + payload.url + "\n";
    str += 'Token billing key           = ' + payload.jti + "\n";
    str += 'User public key             = ' + payload.pubk + "\n";
    return str;
}
function TokenToLimitsText(token) {
    let str = '';
    let [payload, error] = GetPayloadFromToken(token);
    if (error.length > 0) {
        return error;
    }
    str = TokenPayloadToText(payload);
    return str;
}
function KnotFreeTokenStatsToText(payload) {
    let str = '';
    str += 'Current subscriptions       = ' + payload.su + "\n";
    str += 'Current connections         = ' + payload.co + "\n";
    str += 'Current bytes per sec input = ' + payload.in + "\n";
    str += 'Current bytes per sec output = ' + payload.out + "\n";
    return str;
}
// Copyright 2021-2022-2024 Alan Tracey Wootton
// See LICENSE
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AddHeartbeatCallback: AddHeartbeatCallback,
    BoxItItUp: BoxItItUp,
    GetPayloadFromToken: GetPayloadFromToken,
    KeypairToBase64: KeypairToBase64,
    KnotFreeTokenStatsToText: KnotFreeTokenStatsToText,
    KnotNameHash2Buffer: KnotNameHash2Buffer,
    KnotNameHash64: KnotNameHash64,
    Sha256Hash: Sha256Hash,
    StartHeartbeatTimer: StartHeartbeatTimer,
    TokenPayloadToText: TokenPayloadToText,
    TokenToLimitsText: TokenToLimitsText,
    UnBoxIt: UnBoxIt,
    fromBase64Url: fromBase64Url,
    fromHexString: fromHexString,
    getBase64FromPassphrase: getBase64FromPassphrase,
    getBoxKeyPairFromPassphrase: getBoxKeyPairFromPassphrase,
    randomString: randomString,
    toBase64Url: toBase64Url,
    toHexString: toHexString
});

function getSampleKnotFreeTokenPayload() {
    var res = {
        exp: 60 * 60 * 24 * 30, //`json:"exp,omitempty"` // ExpirationTimeunix seconds
        iss: "xxx", //`json:"iss"`           // Issuer first 4 bytes (or more) of base64 public key of issuer
        jti: "xxx", //`json:"jti,omitempty"` // JWTID a unique serial number for this Issuer
        //KnotFreeContactStats // limits on what we're allowed to do.
        in: 32, //`json:"in"`  // bytes per sec
        out: 32, //`json:"out"` // bytes per sec
        su: 10, //`json:"su"`  // Subscriptions seconds per sec
        co: 2, //`json:"co"`  // Connections seconds per sec
        URL: "unknown" //`json:"url"` // address of the service eg. "knotfree.net" or knotfree.com for localhost
    };
    return res;
}
function getSampleKnotFreeTokenRequest() {
    var res = {
        pubk: "fixme", //    `json:"pkey"` // a curve25519 pub key of caller url base64 
        payload: getSampleKnotFreeTokenPayload(),
        Comment: "For anon" // + util.getProfileName()             // `json:"comment"`
    };
    return res;
}
function getFreeToken(prefix, serverName, done, usersPublicKey, usersPrivateKey) {
    var hoststr = prefix + serverName + "api1/getToken";
    //console.log("it's fetch time again ... for a Token !!", hoststr)
    var data = getSampleKnotFreeTokenRequest();
    const myKeyPair = nacl__namespace.box_keyPair();
    // let config = allMgr.GetGlobalConfig()
    // if (config.usersPublicKey !== undefined && config.usersPublicKey.length !== 0) {
    myKeyPair.publicKey = fromBase64Url(usersPublicKey);
    myKeyPair.secretKey = fromBase64Url(usersPrivateKey);
    // }
    // arg!! wants hex ! data.pkey =  base64url.encode(Buffer.from(keyPair.publicKey))
    data.pubk = toBase64Url(buffer.Buffer.from(myKeyPair.publicKey));
    console.log("AppUtil getFreeToken ", hoststr, JSON.stringify(data));
    const response = fetch(hoststr, { method: 'POST', body: JSON.stringify(data) }); // , { mode: "no-cors" });
    response.then((resp) => {
        console.log("have get free token response ", resp);
        if (resp.ok) {
            resp.json().then((anyrepl) => {
                // data is TokenReply 
                const repl = anyrepl;
                console.log("have get free token  fetch result ", repl);
                // box_open(box, nonce, theirPublicKey, mySecretKey)
                // nonce is in b64 and is just a string 
                // pkey and payload ayarn re in hex
                const pkeyBytes = buffer.Buffer.from(repl.pubk, 'hex');
                const payloadBytes = buffer.Buffer.from(repl.payload, 'hex');
                const nonceBytes = buffer.Buffer.from(repl.nonce);
                const gotTok = nacl__namespace.box_open(payloadBytes, nonceBytes, pkeyBytes, myKeyPair.secretKey);
                if (gotTok === undefined) {
                    console.log("FAILURE decoded free token fetch result ", gotTok);
                    //setState({ ...state, complaints: "Failed to get free token" })
                    done(false, "");
                }
                else {
                    const asciiTok = buffer.Buffer.from(gotTok).toString("utf8");
                    console.log("have decoded free token  fetch result ", asciiTok);
                    const theToken = asciiTok;
                    done(true, theToken);
                }
            });
        }
        else {
            // resp not OK 
            console.log("have get free token fetch problem ", resp);
            setTimeout(() => { done(false, ""); }, 2000);
        }
    });
}
// Copyright 2021-2022-2024 Alan Tracey Wootton
// See LICENSE
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var AccessTokenPageUtil = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFreeToken: getFreeToken
});

// I don't get how this works yet.
function ignoreThisFunction(x, y) {
    return x + y;
}

exports.getFreeToken = getFreeToken;
exports.ignoreThisFunction = ignoreThisFunction;
exports.tokenutil = AccessTokenPageUtil;
exports.types = Types;
exports.utils = utils;
//# sourceMappingURL=knotfree-ts-lib.js.map
