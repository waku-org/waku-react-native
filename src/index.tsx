import { NativeModules, Platform, NativeEventEmitter } from 'react-native';

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


var eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
export class WakuMessage {
  payload: Uint8Array = new Uint8Array();
  contentTopic: String | null = "";
  version: Number | null = 0;
  timestamp: Number | null = null;

  toJSON(){
    var decoder = new TextDecoder('utf8');
    var b64encoded = btoa(decoder.decode(this.payload));
    return {
      contentTopic: this.contentTopic,
      version: this.version,
      timestamp: this.timestamp,
      payload: b64encoded
    }
  }
}

export function onMessage(cb) {
  // TODO:
  let eventListener = eventEmitter.addListener("message", event => {
    let signal = JSON.parse(event.signal);
    let msg = signal.event.wakuMessage;
    console.log(msg);
    signal.event.wakuMessage = new WakuMessage();
    signal.event.wakuMessage.timestamp = msg.timestamp;
    signal.event.wakuMessage.version = msg.version || 0;
    signal.event.wakuMessage.contentTopic = msg.contentTopic;
    signal.event.wakuMessage.payload = new Uint8Array(atob(msg.payload).split("").map(c => c.charCodeAt(0)));
    cb(signal);
  })
}

export function newNode(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    // TODO:
    let config = null
    let response = JSON.parse(await ReactNative.newNode(config));
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

export function relayPublish(msg: WakuMessage, topic: String | null = null, ms: Number = 0): Promise<string> {
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

export function relaySubscribe(topic: String | null = null): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relaySubscribe(topic));
    if(response.error){
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export function defaultPubsubTopic(): Promise<string> {
  return ReactNative.defaultPubsubTopic();
}

// TODO: listenAddresses
// TODO: addPeer
// TODO: connect
// TODO: connectPeerID
// TODO: disconnect
// TODO: peerCnt
// TODO: peers
// TODO: decodeSymmetric
// TODO: decodeAsymmetric
// TODO: lightpushPublish
// TODO: lightpushPublishEncAsymmetric
// TODO: lightpushPublishEncSymmetric
// TODO: relayEnoughPeers
// TODO: relayPublishEncAsymmetric
// TODO: relayPublishEncSymmetric
// TODO: relayUnsubscribe
// TODO: relayStoreQuery
