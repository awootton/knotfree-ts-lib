import * as client from './client';
import * as packets from './packets';
export declare function startTestTopicWatcher(myUpdateTestTopic: (arg: packets.Universal) => void, host: string, subs: string[]): client.Packetizer;
