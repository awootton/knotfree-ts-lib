// Copyright 2024 Alan Tracey Wootton
//
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
// This is the protocol for knotfree native pubsub messages. On port 8384.
// See testKnotConnect.ts for a simple example of usage.
// The protocol is designed to be simple and efficient.
// The protocol is designed to be reliable and robust.
// The protocol is designed to be fast and scalable.
// The protocol is designed to be easy to implement and use.
// The protocol is designed to be easy to debug and test.
// The protocol is designed to be easy to document and understand.
// Or at least better than MQTT
// Universal is the wire format for all messages (with varlen lengths).
// it's byte then a varint of the count of strings, then a varint of the length of each string, then the strings.
// See FromBuffer and ToBytes for the details.
import { Buffer } from 'buffer'; // for stinky react native 
export class Universal {
    constructor(commandType, data) {
        this.commandType = commandType;
        this.data = data;
    }
    toString() {
        var s = "commandType:" + this.commandType;
        let i = 0;
        for (let d of this.data) {
            if (isAscii(d)) {
                s += " " + Buffer.from(d).toString('utf8');
            }
            else {
                if (i < 2 && d.length == 25 && d[0] === 0) { // a binary address
                    let tmp = Buffer.from(d.subarray(1)).toString('base64');
                    tmp = tmp.replace(/=/g, '');
                    s += " =" + tmp;
                }
                else {
                    s += " $" + Buffer.from(d).toString('hex');
                }
            }
            i++;
        }
        return s;
    }
}
// MakeUniversal is a convenience function to make a Universal Class from an Object
export function MakeUniversal(value) {
    var p = value;
    return new Universal(p.commandType, p.data);
}
export function MakeNullUniversal() {
    return new Universal("X", []);
}
export function FromBuffer(buffer) {
    if (buffer.length < 2) {
        return [undefined, buffer];
    }
    try {
        let pos = 0;
        // first byte is the command type
        const commandType = buffer.readUInt8(pos++);
        // then a varlenint of the count of the strings
        let strCount;
        [strCount, pos] = ReadVarLenInt(buffer, pos);
        // then a varlenint of the length of each string
        let lengths = Array(strCount);
        for (let i = 0; i < strCount; i++) {
            [lengths[i], pos] = ReadVarLenInt(buffer, pos);
        }
        // then each string
        const blen = buffer.length;
        let data = Array(strCount);
        for (let i = 0; i < strCount; i++) {
            if (pos + lengths[i] > blen) {
                return [undefined, buffer];
            }
            data[i] = buffer.subarray(pos, pos + lengths[i]);
            pos += lengths[i];
        }
        let u = new Universal(String.fromCharCode(commandType), data);
        const b = buffer.subarray(pos);
        return [u, b];
    }
    catch (error) {
        // this is normal console.log("FromBuffer data shortage:" + Asciiizer(buffer, 256) + " length=" + buffer.length)
    }
    return [undefined, buffer];
}
// ToBytes serializes a Universal to a Buffer
// write one byte
// then write varlenint of the count of the strings
// then write varlenint of the length of each string
// then write each string
export function ToBytes(u) {
    let bytes = Buffer.from(u.commandType.substring(0, 1));
    const size = u.data.length;
    bytes = writeVarLenInt(size, bytes);
    for (let a of u.data) {
        bytes = writeVarLenInt(a.length, bytes);
    }
    for (let a of u.data) {
        bytes = Buffer.concat([bytes, Buffer.from(a)]);
    }
    return bytes;
}
export function PacketToBytes(packet) {
    packet.toBackingUniversal();
    const u = packet.backingUniversal;
    return ToBytes(u);
}
export function MakeConnect() {
    let p = {
        backingUniversal: new Universal("C", []),
        optionalKeyValues: new Map(),
        toBackingUniversal: () => {
            p.backingUniversal.data = [];
            appendOptions(p.optionalKeyValues, p.backingUniversal.data);
        }
    };
    return p;
}
export function FillConnect(u) {
    if (u.commandType != "C") {
        return undefined;
    }
    let p = MakeConnect();
    p.backingUniversal = u;
    fillOptions(p.optionalKeyValues, u.data, 0);
    return p;
}
export function MakeSubscribe() {
    let p = {
        backingUniversal: new Universal("S", []),
        Address: { Type: ' ', Bytes: new Uint8Array() },
        optionalKeyValues: new Map(),
        toBackingUniversal: () => {
            p.backingUniversal.data = [];
            appendAddress(p.Address, p.backingUniversal.data);
            appendOptions(p.optionalKeyValues, p.backingUniversal.data);
        }
    };
    return p;
}
export function FillSubscribe(u) {
    if (u.commandType != "S") {
        return undefined;
    }
    let p = MakeSubscribe();
    p.backingUniversal = u;
    p.Address = AddressFromBytes(u.data[0]);
    fillOptions(p.optionalKeyValues, u.data, 1);
    return p;
}
export function MakeSend() {
    let p = {
        backingUniversal: new Universal("P", []), // P is for publish or push, or send
        optionalKeyValues: new Map(),
        Address: { Type: ' ', Bytes: new Uint8Array() },
        Source: { Type: ' ', Bytes: new Uint8Array() },
        Payload: new Uint8Array(),
        toBackingUniversal: () => {
            p.backingUniversal.data = [];
            appendAddress(p.Address, p.backingUniversal.data);
            appendAddress(p.Source, p.backingUniversal.data);
            p.backingUniversal.data.push(p.Payload);
            appendOptions(p.optionalKeyValues, p.backingUniversal.data);
        }
    };
    return p;
}
export function FillSend(u) {
    if (u.commandType != "P") {
        return undefined;
    }
    let p = MakeSend();
    p.backingUniversal = u;
    p.Address = AddressFromBytes(u.data[0]);
    p.Source = AddressFromBytes(u.data[1]);
    p.Payload = u.data[2];
    fillOptions(p.optionalKeyValues, u.data, 3);
    return p;
}
export function MakeLookup() {
    let p = {
        backingUniversal: new Universal("L", []),
        optionalKeyValues: new Map(),
        Address: { Type: ' ', Bytes: new Uint8Array() },
        Source: { Type: ' ', Bytes: new Uint8Array() },
        toBackingUniversal: () => {
            p.backingUniversal.data = [];
            appendAddress(p.Address, p.backingUniversal.data);
            appendAddress(p.Source, p.backingUniversal.data);
            appendOptions(p.optionalKeyValues, p.backingUniversal.data);
        }
    };
    return p;
}
export function FillLookup(u) {
    if (u.commandType != "L") {
        return undefined;
    }
    let p = MakeLookup();
    p.backingUniversal = u;
    p.Address = AddressFromBytes(u.data[0]);
    p.Source = AddressFromBytes(u.data[1]);
    fillOptions(p.optionalKeyValues, u.data, 2);
    return p;
}
// msb first 
function writeVarLenInt(n, data) {
    let dest = Buffer.alloc(8);
    let pos = 0;
    // first just write them all
    while (n > 0) {
        let b = n & 0x7F;
        n = n >> 7;
        dest.writeUInt8(b, pos++);
    }
    // now reverse them and add 0x80 to all but the last
    let dest2 = Buffer.alloc(pos);
    for (let i = 0; i < pos; i++) {
        let tmp = dest.readUInt8(pos - 1 - i);
        if (i < pos - 1) {
            tmp = tmp | 0x80;
        }
        dest2.writeUInt8(tmp, i);
    }
    return Buffer.concat([data, dest2]);
}
// appendOptions appends the options TO the array
function appendOptions(options, array) {
    for (let [key, value] of options) {
        array.push(Buffer.from(key));
        array.push(value);
    }
}
// fillOptions fills the options FROM the array
function fillOptions(options, data, offset) {
    for (let i = offset; i < data.length; i += 2) {
        options.set(Buffer.from(data[i]).toString(), data[i + 1]);
    }
}
// ToBytes simply concates the Type and the Bytes
// The utf-8 types will NOT end up with a space at the start
// is it better to just alloc the bytes?
function AddressToBytes(address) {
    if (address.Type == ' ') { // Utf8Address {
        return Buffer.from(address.Bytes);
    }
    return Buffer.concat([Buffer.from(address.Type), Buffer.from(address.Bytes)]);
}
// BinaryAddress is when an AddressUnion is 24 bytes of bits
const BinaryAddress = "\0";
// HexAddress is when an AddressUnion is 48 bytes of hex bytes
const HexAddress = "$";
// Base64Address is when an AddressUnion is 32 bytes of base64 bytes
const Base64Address = "=";
// Utf8Address is when an AddressUnion is a utf-8 bytes. The default
const Utf8Address = " ";
function AddressFromBytes(bytes) {
    if (!bytes) {
        return { Type: Utf8Address, Bytes: new Uint8Array() };
    }
    let a = { Type: ' ', Bytes: new Uint8Array() };
    if (bytes.length === 0) {
        a.Type = Utf8Address;
        a.Bytes = bytes;
        return a;
    }
    let first = bytes.subarray(0, 1).toString(); // AddressType(bytes[0])
    let more = bytes.subarray(1);
    if (first == BinaryAddress && more.length == 24) {
        a.Type = BinaryAddress;
        a.Bytes = more;
        return a;
    }
    if (first == HexAddress && more.length == 48) {
        a.Type = HexAddress;
        a.Bytes = more;
        return a;
    }
    if (first == Base64Address && more.length == 32) {
        a.Type = Base64Address;
        a.Bytes = more;
        return a;
    }
    if (first == Utf8Address) {
        a.Type = Utf8Address;
        a.Bytes = more;
        return a;
    }
    a.Type = Utf8Address;
    a.Bytes = bytes; // and not more
    return a;
}
function appendAddress(address, array) {
    const bytes = AddressToBytes(address);
    array.push(bytes);
}
export function isAscii(bytes) {
    for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] > 127) {
            return false;
        }
        if (bytes[i] < 32 && bytes[i] != 9 && bytes[i] != 10 && bytes[i] != 13) {
            return false;
        }
    }
    return true;
}
// Asciiizer is a utility to convert bytes to a string. for logging
export function Asciiizer(bytes, max) {
    let val = '';
    let bytes2 = bytes;
    if (bytes2.length > max) {
        bytes2 = bytes2.subarray(0, max);
    }
    if (isAscii(bytes2)) {
        val = Buffer.from(bytes2).toString('utf8');
        //escape 9,10 and 13 now
        val = val.replace(/\t/g, '\\t');
        val = val.replace(/\r/g, '\\r');
        val = val.replace(/\n/g, '\\n');
    }
    else {
        val = Buffer.from(bytes2).toString('hex');
    }
    return val;
}
function ReadVarLenInt(buffer, pos) {
    let val = 0;
    let byte = buffer.readUInt8(pos++); // throws when out of data
    val = byte & 0x7F;
    while (byte & 0x80) {
        val = val << 7;
        byte = buffer.readUInt8(pos++); // throws when out of data
        val = val | (byte & 0x7F);
    }
    return [val, pos];
}
//# sourceMappingURL=packets.js.map