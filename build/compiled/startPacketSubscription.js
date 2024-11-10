import { Buffer } from 'buffer'; // for stinky react native 
import * as client from './client';
import * as packets from './packets';
const token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjExMDU1NDMsImlzcyI6Il85c2giLCJqdGkiOiJkdmF3M3oyOG84Ynhxc3E2ZndvengzaHgiLCJpbiI6MTIxNiwib3V0IjoxMjE2LCJzdSI6NjQsImNvIjozMiwidXJsIjoia25vdGZyZWUuaW8vbXF0dCIsInB1YmsiOiJORVVkWlhzUFRELWx4R2VlSFdYRy1vXzl3bGZuX3NCU3FQcVVxekEwSFMwIn0.KLo0z6Rqw9kTGheINSAToGWIa2EdcblyVDmFetlVZ4rrlCtYYg3d9K_sHmaAtbBWiJv-UfUbpQ0mr88XNqZyDQ";
// only call this once ever
export function startTestTopicWatcher(myUpdateTestTopic, host, subs) {
    let packer = client.NewDefaultPacketizer();
    packer.token = token;
    packer.subs = subs; //["testtopic"]// this was a test: ,"testtopic2","testtopic3","testtopic4","testtopic5"]
    packer.restarter.connectInfo.host = host;
    packer.restarter.connectInfo.verbose = true;
    // packer.restarter.connectInfo.verboseRaw = true
    const oldOnConnect = packer.restarter.onConnect;
    packer.restarter.onConnect = (r) => {
        oldOnConnect(r);
        console.log("onConnect");
        const fakesend = packets.MakeSend();
        fakesend.Payload = Buffer.from("have onConnect");
        fakesend.toBackingUniversal();
        myUpdateTestTopic(fakesend.backingUniversal);
    };
    const oldonDisconnect = packer.restarter.onDisconnect;
    packer.restarter.onDisconnect = (r) => {
        oldonDisconnect(r, Error("onDisconnect"));
        console.log("onDisconnect");
        const fakesend = packets.MakeSend();
        fakesend.Payload = Buffer.from("have onDisconnect");
        fakesend.toBackingUniversal();
        myUpdateTestTopic(fakesend.backingUniversal);
    };
    packer.onPacket = (packer, u) => {
        const u2 = new packets.Universal(u.commandType, u.data);
        // console.log("node has packet", u2.toString())
        myUpdateTestTopic(u);
    };
    client.StartRestarter(packer.restarter);
    setInterval(() => {
        packer.doSubscriptions(packer);
    }, 18 * 60 * 1000);
    return packer;
}
//# sourceMappingURL=startPacketSubscription.js.map