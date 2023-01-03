import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import { decode, encode } from 'base-64';

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

export function multiply(a: number, b: number): Promise<number> {
  return ReactNative.multiply(a, b);
}

const OneMillion = BigInt(1_000_000);

export class WakuMessage {
  payload: Uint8Array = new Uint8Array();
  contentTopic: String | null = '';
  version: Number | null = 0;
  timestamp?: Date = undefined;

  toJSON() {
    const b64encoded = encode(String.fromCharCode(...this.payload));
    return {
      contentTopic: this.contentTopic,
      version: this.version,
      timestamp: this.timestamp
        ? (BigInt(this.timestamp.valueOf()) * OneMillion).toString(10)
        : 0,
      payload: b64encoded,
    };
  }
}

var eventEmitter = new NativeEventEmitter(NativeModules.ReactNative);

/**
 * Execute function each time a message is received
 * @param cb callback to be eecuted
 */
export function onMessage(cb: (arg0: any) => void) {
  eventEmitter.addListener('message', (event) => {
    let signal = JSON.parse(event.signal);
    let msg = signal.event.wakuMessage;
    signal.event.wakuMessage = new WakuMessage();
    signal.event.wakuMessage.timestamp = msg.timestamp;
    signal.event.wakuMessage.version = msg.version || 0;
    signal.event.wakuMessage.contentTopic = msg.contentTopic;
    signal.event.wakuMessage.payload = new Uint8Array(
      decode(msg.payload ?? [])
        .split('')
        .map((c: any) => c.charCodeAt(0))
    );
    cb(signal.event);
  });
}

export class Config {
  host: String | null = null;
  port: Number | null = null;
  advertiseAddr: String | null = null;
  nodeKey: String | null = null;
  keepAliveInterval: Number | null = null;
  relay: Boolean | null = null;
  filter: Boolean | null = null;
  minPeersToPublish: Number | null = null;
}

/**
 * Instantiates a Waku node.
 * @param config options used to initialize a go-waku node
 */
export function newNode(config: Config | null): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(
      await ReactNative.newNode(config ? JSON.stringify(config) : '')
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 * Start a Waku node mounting all the protocols that were enabled during the Waku node instantiation.
 */
export function start(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.start());
    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 * Stops a Waku node.
 */
export function stop(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.stop());
    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 * Is the node started?
 * @returns `true` if the node is started, `false` otherwise
 */
export function isStarted(): Promise<Boolean> {
  return new Promise<Boolean>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.isStarted());
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Get the peer ID of the waku node.
 * @returns Base58 encoded peer ID
 */
export function peerID(): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.peerID());
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Publish a message using Waku Relay.
 * @param msg WakuMessage to publish. The message version is overwritten to `0`
 * @param pubsubTopic pubsub topic on which to publish the message. If not specified, it will use the default pubsub topic
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns string containing the message id
 */
export function relayPublish(
  msg: WakuMessage,
  pubsubTopic: String = '',
  timeoutMs: Number = 0
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.relayPublish(messageJSON, pubsubTopic, timeoutMs)
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Optionally sign, encrypt using asymmetric encryption and publish a message using Waku Relay.
 * @param msg WakuMessage to publish. The message version is overwritten to `1`
 * @param publicKey hex encoded public key to be used for encryption.
 * @param optionalSigningKey hex encoded private key to be used to sign the message.
 * @param pubsubTopic pubsub topic on which to publish the message. If not specified, it will use the default pubsub topic.
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns string containing the message id
 */
export function relayPublishEncodeAsymmetric(
  msg: WakuMessage,
  publicKey: String,
  optionalSigningKey: String = '',
  pubsubTopic: String = '',
  timeoutMs: Number = 0
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.relayPublishEncodeAsymmetric(
        messageJSON,
        pubsubTopic,
        publicKey,
        optionalSigningKey,
        timeoutMs
      )
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Optionally sign, encrypt using symmetric encryption and publish a message using Waku Relay.
 * @param msg WakuMessage to publish. The message version is overwritten to `1`
 * @param symmetricKey  32 byte hex encoded secret key to be used for encryption
 * @param optionalSigningKey hex encoded private key to be used to sign the message
 * @param pubsubTopic pubsub topic on which to publish the message. If not specified, it will use the default pubsub topic
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns string containing the message id
 */
export function relayPublishEncodeSymmetric(
  msg: WakuMessage,
  symmetricKey: String,
  optionalSigningKey: String = '',
  pubsubTopic: String = '',
  timeoutMs: Number = 0
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.relayPublishEncodeAsymmetric(
        messageJSON,
        pubsubTopic,
        symmetricKey,
        optionalSigningKey,
        timeoutMs
      )
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Subscribe to a Waku Relay pubsub topic to receive messages.
 * @param topic Pubsub topic to subscribe to.
 */
export function relaySubscribe(topic: String = ''): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relaySubscribe(topic));
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Returns the default pubsub topic used for exchanging waku messages defined in [RFC 10](https://rfc.vac.dev/spec/10/).
 * @returns the default pubsub topic `/waku/2/default-waku/proto`
 */
export function defaultPubsubTopic(): Promise<String> {
  return ReactNative.defaultPubsubTopic();
}

/**
 * Get the multiaddresses the Waku node is listening to.
 * @returns an array of multiaddresses
 */
export function listenAddresses(): Promise<Array<String>> {
  return new Promise<Array<string>>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.listenAddresses());
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Add a node multiaddress and protocol to the waku node's peerstore.
 * @param multiAddress multiaddress (with peer id) to reach the peer being added
 * @param protocol protocol we expect the peer to support
 * @returns  peer ID as a base58 `string` of the peer that was added
 */
export function addPeer(
  multiAddress: String,
  protocol: String
): Promise<String> {
  return new Promise<string>(async (resolve, reject) => {
    let response = JSON.parse(
      await ReactNative.addPeer(multiAddress, protocol)
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Dial peer using a multiaddress.
 * @param multiAddress multiaddress to reach the peer being dialed
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 */
export function connect(
  multiAddress: String,
  timeoutMs: Number = 0
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(
      await ReactNative.connect(multiAddress, timeoutMs)
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 * Dial peer using its peer ID.
 * @param peerID  Peer ID to dial. The peer must be already known.  It must have been added before with `addPeer` or previously dialed with `connect`
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 */
export function connectPeerID(
  peerID: String,
  timeoutMs: Number = 0
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(
      await ReactNative.connectPeerID(peerID, timeoutMs)
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 * Disconnect a peer using its peerID
 * @param peerID Peer ID to disconnect.
 */
export function disconnect(peerID: String): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.disconnect(peerID));
    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 * Get number of connected peers.
 * @returns number of connected peers
 */
export function peerCnt(): Promise<Number> {
  return new Promise<Number>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.peerCnt());
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export class DecodedPayload {
  payload: Uint8Array = new Uint8Array();
  padding: Uint8Array = new Uint8Array();
  pubkey: String | null = '';
  signature: String | null = '';

  toJSON() {
    const b64payload = encode(String.fromCharCode(...this.payload));
    const b64padding = encode(String.fromCharCode(...this.padding));
    return {
      payload: b64payload,
      padding: b64padding,
      pubkey: this.pubkey,
      signature: this.signature,
    };
  }
}

/**
 * Decrypt a message using a symmetric key
 * @param msg WakuMessage to decode. The message version is expected to be 1
 * @param symmetricKey 32 byte symmetric key hex encoded
 * @returns DecodedPayload
 */
export function decodeSymmetric(
  msg: WakuMessage,
  symmetricKey: String
): Promise<DecodedPayload> {
  return new Promise<DecodedPayload>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.decodeSymmetric(messageJSON, symmetricKey)
    );
    if (response.error) {
      reject(response.error);
    } else {
      let decodedPayload = new DecodedPayload();
      decodedPayload.payload = new Uint8Array(
        atob(response.result.payload)
          .split('')
          .map((c) => c.charCodeAt(0))
      );
      decodedPayload.padding = new Uint8Array(
        atob(response.result.padding)
          .split('')
          .map((c) => c.charCodeAt(0))
      );
      decodedPayload.pubkey = response.result.pubkey;
      decodedPayload.signature = response.result.signature;
      resolve(decodedPayload);
    }
  });
}

/**
 * Decrypt a message using a secp256k1 private key
 * @param msg WakuMessage to decode. The message version is expected to be 1
 * @param privateKey secp256k1 private key hex encoded
 * @returns DecodedPayload
 */
export function decodeAsymmetric(
  msg: WakuMessage,
  privateKey: String
): Promise<DecodedPayload> {
  return new Promise<DecodedPayload>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.decodeSymmetric(messageJSON, privateKey)
    );
    if (response.error) {
      reject(response.error);
    } else {
      let decodedPayload = new DecodedPayload();
      decodedPayload.payload = new Uint8Array(
        atob(response.result.payload)
          .split('')
          .map((c) => c.charCodeAt(0))
      );
      decodedPayload.padding = new Uint8Array(
        atob(response.result.padding)
          .split('')
          .map((c) => c.charCodeAt(0))
      );
      decodedPayload.pubkey = response.result.pubkey;
      decodedPayload.signature = response.result.signature;
      resolve(decodedPayload);
    }
  });
}

/**
 * Determine if there are enough peers to publish a message on a given pubsub topic.
 * @param pubsubTopic Pubsub topic to verify. If not specified, it will verify the default pubsub topic
 * @returns boolean indicates whether there are enough peers
 */
export function relayEnoughPeers(pubsubTopic: String = ''): Promise<Boolean> {
  return new Promise<Boolean>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relayEnoughPeers(pubsubTopic));
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Closes the pubsub subscription to a pubsub topic. No more messages will be received from this pubsub topic.
 * @param pubsubTopic
 */
export function relayUnsubscribe(pubsubTopic: String = ''): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.relayUnsubscribe(pubsubTopic));
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Publish a message using Waku Lightpush.
 * @param msg WakuMessage to publish. The message version is overwritten to `0`
 * @param pubsubTopic pubsub topic on which to publish the message. If not specified, it uses the default pubsub topic.
 * @param peerID Peer ID supporting the lightpush protocol.  The peer must be already known.  It must have been added before with `addPeer` or previously dialed with `connect`
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns the message ID
 */
export function lightpushPublish(
  msg: WakuMessage,
  pubsubTopic: String = '',
  peerID: String = '',
  timeoutMs: Number = 0
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.lightpushPublish(
        messageJSON,
        pubsubTopic,
        peerID,
        timeoutMs
      )
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Optionally sign, encrypt using asymmetric encryption and publish a message using Waku Lightpush.
 * @param msg WakuMessage to publish. The message version is overwritten to `1`
 * @param publicKey hex encoded public key to be used for encryption
 * @param optionalSigningKey hex encoded private key to be used to sign the message
 * @param pubsubTopic pubsub topic on which to publish the message. If not specified, it uses the default pubsub topic.
 * @param peerID Peer ID supporting the lightpush protocol.  The peer must be already known.  It must have been added before with `addPeer` or previously dialed with `connect`
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns the message ID
 */
export function lightpushPublishEncAsymmetric(
  msg: WakuMessage,
  publicKey: String,
  optionalSigningKey: String = '',
  pubsubTopic: String = '',
  peerID: String = '',
  timeoutMs: Number = 0
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.lightpushPublishEncodeAsymmetric(
        messageJSON,
        pubsubTopic,
        peerID,
        publicKey,
        optionalSigningKey,
        timeoutMs
      )
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

/**
 * Optionally sign, encrypt using symmetric encryption and publish a message using Waku Lightpush.
 * @param msg WakuMessage to publish. The message version is overwritten to `1`
 * @param symmetricKey hex encoded secret key to be used for encryption.
 * @param optionalSigningKey hex encoded private key to be used to sign the message.
 * @param pubsubTopic pubsub topic on which to publish the message. If not specified, it uses the default pubsub topic.
 * @param peerID Peer ID supporting the lightpush protocol.  The peer must be already known.  It must have been added before with `addPeer` or previously dialed with `connect`
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns the message ID
 */
export function lightpushPublishEncSymmetric(
  msg: WakuMessage,
  symmetricKey: String,
  optionalSigningKey: String = '',
  pubsubTopic: String = '',
  peerID: String = '',
  timeoutMs: Number = 0
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    let messageJSON = JSON.stringify(msg);
    let response = JSON.parse(
      await ReactNative.lightpushPublishEncodeAsymmetric(
        messageJSON,
        pubsubTopic,
        peerID,
        symmetricKey,
        optionalSigningKey,
        timeoutMs
      )
    );
    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export class Peer {
  addrs: Array<String> = Array();
  connected: Boolean = false;
  peerID: String = '';
  protocols: Array<String> = Array();

  constructor(
    addrs: Array<String>,
    connected: Boolean,
    peerID: String,
    protocols: Array<String>
  ) {
    this.addrs = addrs;
    this.connected = connected;
    this.peerID = peerID;
    this.protocols = protocols;
  }
}

/**
 * Retrieve the list of peers known by the Waku node.
 * @returns list of peers
 */
export function peers(): Promise<Array<Peer>> {
  return new Promise<Array<Peer>>(async (resolve, reject) => {
    let response = JSON.parse(await ReactNative.peers());
    if (response.error) {
      reject(response.error);
    } else {
      resolve(
        response.result.map(
          (x: any) => new Peer(x.addrs, x.connected, x.peerID, x.protocols)
        )
      );
    }
  });
}

export class Index {
  digest: Uint8Array = new Uint8Array();
  receiverTime: Number = 0;
  senderTime: Number = 0;
  pubsubTopic: String = '';
}
export class PagingOptions {
  pageSize: Number = 0;
  cursor: Index | null = null;
  forward: Boolean = false;

  constructor(
    pageSize: Number = 0,
    forward: Boolean = false,
    cursor: Index | null = null
  ) {
    this.pageSize = pageSize;
    this.forward = forward;
    this.cursor = cursor;
  }
}

export class ContentFilter {
  contentTopic: String = '';

  constructor(contentTopic: String = '') {
    this.contentTopic = contentTopic;
  }
}

export class StoreQuery {
  pubsubTopic: String | null = null;
  contentFilters: Array<ContentFilter> = Array();
  startTime?: Date = undefined;
  endTime?: Date = undefined;
  pagingOptions: PagingOptions | null = null;

  constructor(
    pubsubTopic: String | null = null,
    contentFilters: Array<ContentFilter> = Array(),
    startTime: Date | undefined = undefined,
    endTime: Date | undefined = undefined,
    pagingOptions: PagingOptions | null = null
  ) {
    this.pubsubTopic = pubsubTopic;
    this.contentFilters = contentFilters;
    this.startTime = startTime;
    this.endTime = endTime;
    this.pagingOptions = pagingOptions;
  }
}

/**
 *
 * @param query
 * @param peerID
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 * @returns
 */
export function storeQuery(
  query: StoreQuery,
  peerID: String = '',
  timeoutMs: Number = 0
): Promise<any> {
  return new Promise<string>(async (resolve, reject) => {
    let queryJSON = JSON.stringify({
      pubsubTopic: query.pubsubTopic,
      contentFilters: query.contentFilters,
      startTime: query.startTime
        ? (BigInt(query.startTime.valueOf()) * OneMillion).toString(10)
        : 0,
      endTime: query.endTime
        ? (BigInt(query.endTime.valueOf()) * OneMillion).toString(10)
        : 0,
      pagingOptions: query.pagingOptions,
    });
    let response = JSON.parse(
      await ReactNative.storeQuery(queryJSON, peerID, timeoutMs)
    );

    if (response.error) {
      reject(response.error);
    } else {
      resolve(response.result);
    }
  });
}

export class FilterSubscription {
  pubsubTopic: String | null = null;
  contentFilters: Array<ContentFilter> = Array();

  constructor(
    pubsubTopic: String | null = null,
    contentFilters: Array<ContentFilter> = Array()
  ) {
    this.pubsubTopic = pubsubTopic;
    this.contentFilters = contentFilters;
  }
}

/**
 *
 * @param filter
 * @param peerID
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 */
export function filterSubscribe(
  filter: FilterSubscription,
  peerID: String = '',
  timeoutMs: Number = 0
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let filterJSON = JSON.stringify(filter);
    let response = JSON.parse(
      await ReactNative.filterSubscribe(filterJSON, peerID, timeoutMs)
    );

    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}

/**
 *
 * @param filter
 * @param timeoutMs Timeout value in milliseconds to execute the call. If the function takes longer than this value, the execution will be canceled and an error returned
 */
export function filterUnsubscribe(
  filter: FilterSubscription,
  timeoutMs: Number = 0
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    let filterJSON = JSON.stringify(filter);
    let response = JSON.parse(
      await ReactNative.filterUnsubscribe(filterJSON, timeoutMs)
    );

    if (response.error) {
      reject(response.error);
    } else {
      resolve();
    }
  });
}
