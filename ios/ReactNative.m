#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReactNative, RCTEventEmitter)

RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(defaultPubsubTopic:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(newNode:(NSString *)config
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(start:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stop:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isStarted:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(peerID:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(relayEnoughPeers:(NSString *)topic
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(listenAddresses:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(connect:(NSString *)address
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(peerCnt:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(peers:
                (RCTPromiseResolveBlock)resolve
                withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(relaySubscribe:(NSString *)topic
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(relayUnsubscribe:(NSString *)topic
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(relayPublish:(NSString *)msg
                 withTopic:(NSString *)topic
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(relayPublishEncodeAsymmetric:(NSString *)msg
                 withTopic:(NSString *)topic
                 withPublicKey:(NSString *)publicKey
                 withOptionalSigningKey:(NSString *)optionalSigningKey
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(relayPublishEncodeSymmetric:(NSString *)msg
                 withTopic:(NSString *)topic
                 withSymmetricKey:(NSString *)symmetricKey
                 withOptionalSigningKey:(NSString *)optionalSigningKey
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addPeer:(NSString *)addr
                 withProtocol:(NSString *)proto
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(connectPeerID:(NSString *)peerID
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(disconnect:(NSString *)peerID
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(lightpushPublish:(NSString *)msg
                 withTopic:(NSString *)topic
                 withPeerID:(NSString *)peerID
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(lightpushPublishEncodeAsymmetric:(NSString *)msg
                 withTopic:(NSString *)topic
                 withPeerID:(NSString *)peerID
                 withPublicKey:(NSString *)publicKey
                 withOptionalSigningKey:(NSString *)optionalSigningKey
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(lightpushPublishEncodeSymmetric:(NSString *)msg
                 withTopic:(NSString *)topic
                 withPeerID:(NSString *)peerID
                 withSymmetricKey:(NSString *)symmetricKey
                 withOptionalSigningKey:(NSString *)optionalSigningKey
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(decodeSymmetric:(NSString *)msg
                 withSymmetricKey:(NSString *)symmetricKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(decodeAsymmetric:(NSString *)msg
                 withPrivateKey:(NSString *)privateKey
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(storeQuery:(NSString *)query
                 withPeerID:(NSString *)peerID
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(filterSubscribe:(NSString *)filterJSON
                 withPeerID:(NSString *)peerID
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(filterUnsubscribe:(NSString *)filterJSON
                 withMs:(nonnull NSNumber *)ms
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)


@end
