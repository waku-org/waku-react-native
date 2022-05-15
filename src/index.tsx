import { NativeModules, Platform, NativeEventEmitter} from 'react-native';
import {decode, encode} from 'base-64'

const LINKING_ERROR =
  `The package '@waku/react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ReactNative = NativeModules.ReactNative
  ? NativeModules.ReactNative
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export class WakuMessage {
      payload: Uint8Array = new Uint8Array();
      contentTopic: String | null = "";
      version: Number | null = 0;
      timestamp: Number | null = null;
    
      toJSON(){
        const b64encoded = encode(String.fromCharCode(...this.payload));
        return {
          contentTopic: this.contentTopic,
          version: this.version,
          timestamp: this.timestamp,
          payload: b64encoded
        }
      }
    }

var eventEmitter = new NativeEventEmitter(NativeModules.ReactNative);

export function onMessage(cb: (arg0:any) => void) {
  eventEmitter.addListener("message", event => {
    let signal = JSON.parse(event.signal);
    let msg = signal.event.wakuMessage;
    signal.event.wakuMessage = new WakuMessage();
    signal.event.wakuMessage.timestamp = msg.timestamp;
    signal.event.wakuMessage.version = msg.version || 0;
    signal.event.wakuMessage.contentTopic = msg.contentTopic;
    signal.event.wakuMessage.payload = new Uint8Array(decode(msg.payload).split("").map((c:any) => c.charCodeAt(0)));
    cb(signal.event);
  })
}

export class Config {
  host: String | null = null
  port: Number | null = null
  advertiseAddr: String | null = null
  nodeKey: String | null = null
  keepAliveInterval: Number | null = null
  relay: Boolean | null = null
  minPeersToPublish: Number | null = null
}

export function newNode(config: Config | null): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {    
    let response = JSON.parse(await ReactNative.newNode(config ? JSON.stringify(config) : ""));
    if(response.error){
      reject(response.error);
    } else {
      resolve();
    }
  });
}

export function start(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.start());
    if(response.error){
      reject(response.error);
    } else {
      resolve();
    }
  });
}

export function stop(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.stop());
    if(response.error){
      reject(response.error);
    } else {
      resolve();
    }
  });
}

export function peerID(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.peerID());
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function relayPublish(msg: WakuMessage, topic: String = "", ms: Number = 0): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg)
    let response = JSON.parse(await ReactNative.relayPublish(messageJSON, topic, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function relayPublishEncodeAsymmetric(msg: WakuMessage, publicKey: String, optionalSigningKey: String = "", topic: String = "", ms: Number = 0): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg)
    let response = JSON.parse(await ReactNative.relayPublishEncodeAsymmetric(messageJSON, topic, publicKey, optionalSigningKey, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function relayPublishEncodeSymmetric(msg: WakuMessage, symmetricKey: String, optionalSigningKey: String = "", topic: String = "", ms: Number = 0): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg)
    let response = JSON.parse(await ReactNative.relayPublishEncodeAsymmetric(messageJSON, topic, symmetricKey, optionalSigningKey, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function relaySubscribe(topic: String = ""): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relaySubscribe(topic));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function defaultPubsubTopic(): Promise<String> {
  return ReactNative.defaultPubsubTopic();
}

export function listenAddresses(): Promise<Array<String>> {
  return new Promise<Array<string>>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.listenAddresses());
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function addPeer(multiAddress: String, protocol: String): Promise<String> {
  return new Promise<string>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.addPeer(multiAddress, protocol));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function connect(multiAddress: String, ms: Number = 0): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.connect(multiAddress, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve();
    }
  });
}

export function connectPeerID(peerID: String, ms: Number = 0): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.connectPeerID(peerID, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve();
    }
  });
}

export function disconnect(peerID: String): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.disconnect(peerID));
    if(response.error){
      reject(response.error);
    } else {
      resolve();
    }
  });
}

export function peerCnt(): Promise<Number> {
  return new Promise<Number>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.peerCnt());
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export class DecodedPayload {
  payload: Uint8Array = new Uint8Array();
  padding: Uint8Array = new Uint8Array();
  pubkey: String | null = "";
  signature: String | null = "";

  toJSON(){
    const b64payload = encode(String.fromCharCode(...this.payload));
    const b64padding = encode(String.fromCharCode(...this.padding));
    return {
      payload: b64payload,
      padding: b64padding,
      pubkey: this.pubkey,
      signature: this.signature,
    }
  }
}

export function decodeSymmetric(msg: WakuMessage, symmetricKey: String): Promise<DecodedPayload> {
  return new Promise<DecodedPayload>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(await ReactNative.decodeSymmetric(messageJSON, symmetricKey));
    if(response.error){
      reject(response.error);
    } else {
      let decodedPayload = new DecodedPayload();
      decodedPayload.payload = new Uint8Array(atob(response.result.payload).split("").map(c => c.charCodeAt(0)));
      decodedPayload.padding = new Uint8Array(atob(response.result.padding).split("").map(c => c.charCodeAt(0)));
      decodedPayload.pubkey = response.result.pubkey;
      decodedPayload.signature = response.result.signature;
      resolve(decodedPayload);
    }
  });
}

export function decodeAsymmetric(msg: WakuMessage, privateKey: String): Promise<DecodedPayload> {
  return new Promise<DecodedPayload>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(await ReactNative.decodeSymmetric(messageJSON, privateKey));
    if(response.error){
      reject(response.error);
    } else {
      let decodedPayload = new DecodedPayload();
      decodedPayload.payload = new Uint8Array(atob(response.result.payload).split("").map(c => c.charCodeAt(0)));
      decodedPayload.padding = new Uint8Array(atob(response.result.padding).split("").map(c => c.charCodeAt(0)));
      decodedPayload.pubkey = response.result.pubkey;
      decodedPayload.signature = response.result.signature;
      resolve(decodedPayload);
    }
  });
}

export function relayEnoughPeers(topic: String = ""): Promise<Boolean> {
  return new Promise<Boolean>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relayEnoughPeers(topic));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function relayUnsubscribe(topic: String = ""): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relayUnsubscribe(topic));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}






export function lightpushPublish(msg: WakuMessage, topic: String = "", peerID: String = "", ms: Number = 0): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg)
    let response = JSON.parse(await ReactNative.lightpushPublish(messageJSON, topic, peerID, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function lightpushPublishEncAsymmetric(msg: WakuMessage, publicKey: String, optionalSigningKey: String = "", topic: String = "", peerID: String = "", ms: Number = 0): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg)
    let response = JSON.parse(await ReactNative.lightpushPublishEncodeAsymmetric(messageJSON, topic, peerID, publicKey, optionalSigningKey, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function lightpushPublishEncSymmetric(msg: WakuMessage, symmetricKey: String, optionalSigningKey: String = "", topic: String = "", peerID: String = "", ms: Number = 0): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg)
    let response = JSON.parse(await ReactNative.lightpushPublishEncodeAsymmetric(messageJSON, topic,  peerID, symmetricKey, optionalSigningKey, ms));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export class Peer {
  addrs: Array<String> = Array()
  connected: Boolean = false
  peerID: String = ""
  protocols: Array<String> = Array()

  constructor(addrs: Array<String>, connected: Boolean, peerID: String, protocols: Array<String>){
    this.addrs = addrs;
    this.connected = connected;
    this.peerID = peerID;
    this.protocols = protocols;
  }
}

export function peers(): Promise<Array<Peer>> {
  return new Promise<Array<Peer>>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.peers());
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result.map((x:any) => new Peer(x.addrs, x.connected, x.peerID, x.protocols)));
    }
  })
}

// TODO: storeQuery
