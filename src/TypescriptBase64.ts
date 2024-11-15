
import { Buffer } from 'buffer'

export { }

// The Base64Url encoding
const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

var b64reverse: Buffer = Buffer.alloc(128)
for (var i = 0; i < b64reverse.length; i++) {
    b64reverse[i] = 0
}
for (var i = 0; i < b64ch.length; i++) {
    var tmp = b64ch.charCodeAt(i)
    b64reverse[tmp] = i
}
// see https://en.wikipedia.org/wiki/Base64
// so we can also decode regular base64 
b64reverse["+".charCodeAt(0)] = 62
b64reverse["/".charCodeAt(0)] = 63

export function encode(bytes: Uint8Array): string {
    var dest = Buffer.alloc(Math.floor(bytes.length * 4 / 3 + .999))

    var s = 0
    for (var i = 0; i < bytes.length;) {

        const zero = bytes[i]
        i += 1
        const one = i < bytes.length ? bytes[i] : 0
        i += 1
        const two = i < bytes.length ? bytes[i] : 0
        i += 1

        var sum = 0

        var tmp = zero >> 2
        sum = b64ch.charCodeAt(tmp)
        dest[s++] = sum

        tmp = ((zero & 3) << 4) + (one >> 4)
        sum = b64ch.charCodeAt(tmp)
        dest[s++] = sum

        tmp = ((one & 0x0F) << 2) + (two >> 6)
        sum = b64ch.charCodeAt(tmp)
        dest[s++] = sum

        tmp = (two & 0x03F)
        sum = b64ch.charCodeAt(tmp)
        dest[s++] = sum
    }
    return dest.toString('utf8')
}

export function decode(str: string): Buffer {
    var dest = Buffer.alloc(Math.floor(str.length * 3 / 4))
    var destI = 0
    for (var i = 0; i < str.length;) {
        // 4 chars are 3 bytes
        var char1 = b64reverse[str.charCodeAt(i)]
        i += 1
        var char2 = i < str.length ? b64reverse[str.charCodeAt(i)] : 0
        i += 1
        var char3 = i < str.length ? b64reverse[str.charCodeAt(i)] : 0
        i += 1
        var char4 = i < str.length ? b64reverse[str.charCodeAt(i)] : 0
        i += 1
        // there's 6 bits in each 'char'
        var n = (((((char1 << 6) + char2) << 6) + char3) << 6) + char4
        // now we have 3 bytes
        dest[destI++] = n >> 16
        if ( destI < dest.length ){
            dest[destI++] = n >> 8
        }
        if ( destI < dest.length ){
            dest[destI++] = n
        }
    }
    return dest
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

