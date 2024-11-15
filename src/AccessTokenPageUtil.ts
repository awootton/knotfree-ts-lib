
import * as nacl from 'tweetnacl-ts'
import { Buffer } from 'buffer'

import * as utils from './utils'


function getSampleKnotFreeTokenPayload(): KnotFreeTokenPayload {
  var res: KnotFreeTokenPayload = {
    exp: 60*60*24*30, //`json:"exp,omitempty"` // ExpirationTimeunix seconds
    iss: "xxx", //`json:"iss"`           // Issuer first 4 bytes (or more) of base64 public key of issuer
    jti: "xxx", //`json:"jti,omitempty"` // JWTID a unique serial number for this Issuer

    //KnotFreeContactStats // limits on what we're allowed to do.
    in: 32, //`json:"in"`  // bytes per sec
    out: 32, //`json:"out"` // bytes per sec
    su: 10,          //`json:"su"`  // Subscriptions seconds per sec
    co: 2,       //`json:"co"`  // Connections seconds per sec

    URL: "unknown" //`json:"url"` // address of the service eg. "knotfree.net" or knotfree.com for localhost
  }
  return res
}

type KnotFreeTokenPayload = {
  //
  exp: number //`json:"exp,omitempty"` // ExpirationTimeunix seconds
  iss: string //`json:"iss"`           // Issuer first 4 bytes (or more) of base64 public key of issuer
  jti: string //`json:"jti,omitempty"` // JWTID a unique serial number for this Issuer

  in: number //`json:"in"`  // bytes per sec
  out: number //`json:"out"` // bytes per sec
  su: number          //`json:"su"`  // Subscriptions seconds per sec
  co: number        //`json:"co"`  // Connections seconds per sec

  URL: string //`json:"url"` // address of the service eg. "knotfree.net" or knotfree0.com for localhost
}


type TokenRequest = {
  //
  pubk: string                   //`json:"pubk"` // a curve25519 pub key of caller
  payload: KnotFreeTokenPayload  //`json:"payload"`
  Comment: string                //`json:"comment"`
}
type TokenReply = {
  pubk: string                //`json:"pubk"` // a curve25519 pub key of caller
  payload: string             //`json:"payload"` - a jwt token.
  nonce: string               // `json:"nonce"`
}


function getSampleKnotFreeTokenRequest(): TokenRequest {
  var res: TokenRequest = {
    pubk: "fixme",        //    `json:"pkey"` // a curve25519 pub key of caller url base64 
    payload: getSampleKnotFreeTokenPayload(),
    Comment: "For anon" // + util.getProfileName()             // `json:"comment"`
  }
  return res
}


export function getFreeToken(prefix: string, serverName: string, done: (ok: boolean, tok: string) => any,
usersPublicKey :string,usersPrivateKey:string ) {
   
  var hoststr = prefix + serverName + "api1/getToken"

  //console.log("it's fetch time again ... for a Token !!", hoststr)
  var data = getSampleKnotFreeTokenRequest()
  const myKeyPair: nacl.BoxKeyPair = nacl.box_keyPair()
  // let config = allMgr.GetGlobalConfig()
 // if (config.usersPublicKey !== undefined && config.usersPublicKey.length !== 0) {
    myKeyPair.publicKey = utils.fromBase64Url(usersPublicKey)
    myKeyPair.secretKey = utils.fromBase64Url(usersPrivateKey )
 // }

  // arg!! wants hex ! data.pkey =  base64url.encode(Buffer.from(keyPair.publicKey))
  data.pubk = utils.toBase64Url(Buffer.from(myKeyPair.publicKey))
  console.log("AppUtil getFreeToken ", hoststr, JSON.stringify(data))
  const response = fetch(hoststr, { method: 'POST', body: JSON.stringify(data) }); // , { mode: "no-cors" });
  response.then((resp: Response) => {
    console.log("have get free token response ", resp)
    if (resp.ok) {
      resp.json().then((anyrepl: any) => { // TokenReply
        // data is TokenReply 
        const repl = anyrepl as TokenReply
        console.log("have get free token  fetch result ", repl)
        // box_open(box, nonce, theirPublicKey, mySecretKey)
        // nonce is in b64 and is just a string 
        // pkey and payload ayarn re in hex
        const pkeyBytes = Buffer.from(repl.pubk, 'hex')
        const payloadBytes = Buffer.from(repl.payload, 'hex')
        const nonceBytes = Buffer.from(repl.nonce)
        const gotTok = nacl.box_open(payloadBytes, nonceBytes, pkeyBytes, myKeyPair.secretKey)
        if (gotTok === undefined) {
          console.log("FAILURE decoded free token fetch result ", gotTok)
          //setState({ ...state, complaints: "Failed to get free token" })
          done(false, "")
        } else {
          const asciiTok = Buffer.from(gotTok).toString("utf8")
          console.log("have decoded free token  fetch result ", asciiTok)
          const theToken = asciiTok
          done(true, theToken)
        }
      })
    }
    else {
      // resp not OK 
      console.log("have get free token fetch problem ", resp)
      setTimeout(() => { done(false, "") }, 2000)
    }
  }
  )
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
