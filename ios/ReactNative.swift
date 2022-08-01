import Gowaku
import React

@objc(ReactNative)
class ReactNative: RCTEventEmitter {

    var hasListener: Bool = false

      override func startObserving() {
        hasListener = true
      }

      override func stopObserving() {
        hasListener = false
      }

    func sendEvent(signalJson: String) {
        if hasListener {
          self.sendEvent(withName:"message", body:["signal": signalJson]);
        }
     }

     @objc
     override func supportedEvents() -> [String]! {
       return ["message"];
     }

    var signalHandler: GowakuSignalHandlerProtocol?

    class DefaultEventHandler : NSObject, GowakuSignalHandlerProtocol {
        var parent: ReactNative
        init(p: ReactNative) {
            parent = p
            super.init()
        }
        
        public func handleSignal(_ p0: String?) {
            parent.sendEvent(signalJson: p0!)
        }
    }

    
    @objc(defaultPubsubTopic:withRejecter:)
    func defaultPubsubTopic(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuDefaultPubsubTopic())
    }

    @objc(newNode:withResolver:withRejecter:)
    func newNode(config: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        signalHandler = DefaultEventHandler(p:self)
        GowakuSetMobileSignalHandler(signalHandler)
        resolve(GowakuNewNode(config))
    }

    @objc(start:withRejecter:)
    func start(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuStart())
    }

    @objc(stop:withRejecter:)
    func stop(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuStop())
    }

    @objc(isStarted:withRejecter:)
    func isStarted(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuIsStarted())
    }

    @objc(peerID:withRejecter:)
    func peerID(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuPeerID())
    }
    
    @objc(relayEnoughPeers:withResolver:withRejecter:)
    func relayEnoughPeers(topic: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuRelayEnoughPeers(topic))
    }
    
    @objc(listenAddresses:withRejecter:)
    func listenAddresses(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuListenAddresses())
    }

    @objc(connect:withMs:withResolver:withRejecter:)
    func connect(address: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuConnect(address, ms))
    }

    @objc(addPeer:withProtocol:withResolver:withRejecter:)
    func addPeer(addr: String, proto: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuAddPeer(addr, proto))
    }

    @objc(connectPeerID:withMs:withResolver:withRejecter:)
    func connectPeerID(peerID: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuConnect(peerID, ms))
    }

    @objc(disconnect:withResolver:withRejecter:)
    func disconnect(peerID: String,resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuDisconnect(peerID))
    }

    @objc(peerCnt:withRejecter:)
    func peerCnt(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuPeerCnt())
    }

    @objc(peers:withRejecter:)
    func peers(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuPeers())
    }

    @objc(relaySubscribe:withResolver:withRejecter:)
    func relaySubscribe(topic: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuRelaySubscribe(topic))
    }

    @objc(relayUnsubscribe:withResolver:withRejecter:)
    func relayUnsubscribe(topic: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuRelayUnsubscribe(topic))
    }

    @objc(relayPublish:withTopic:withMs:withResolver:withRejecter:)
    func relayPublish(msg: String, topic: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuRelayPublish(msg, topic, ms))
    }

    @objc(relayPublishEncodeAsymmetric:withTopic:withPublicKey:withOptionalSigningKey:withMs:withResolver:withRejecter:)
    func relayPublishEncodeAsymmetric(msg: String, topic: String, publicKey: String, optionalSigningKey: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuRelayPublishEncodeAsymmetric(msg, topic, publicKey, optionalSigningKey, ms))
    }

    @objc(relayPublishEncodeSymmetric:withTopic:withSymmetricKey:withOptionalSigningKey:withMs:withResolver:withRejecter:)
    func relayPublishEncodeSymmetric(msg: String, topic: String, symmetricKey: String, optionalSigningKey: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuRelayPublishEncodeSymmetric(msg, topic, symmetricKey, optionalSigningKey, ms))
    }

    @objc(lightpushPublish:withTopic:withPeerID:withMs:withResolver:withRejecter:)
    func lightpushPublish(msg: String, topic: String, peerID: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuLightpushPublish(msg, topic, peerID, ms))
    }

    @objc(lightpushPublishEncodeAsymmetric:withTopic:withPeerID:withPublicKey:withOptionalSigningKey:withMs:withResolver:withRejecter:)
    func lightpushPublishEncodeAsymmetric(msg: String, topic: String, peerID: String, publicKey: String, optionalSigningKey: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuLightpushPublishEncodeAsymmetric(msg, topic, peerID, publicKey, optionalSigningKey, ms))
    }

    @objc(lightpushPublishEncodeSymmetric:withTopic:withPeerID:withSymmetricKey:withOptionalSigningKey:withMs:withResolver:withRejecter:)
    func lightpushPublishEncodeSymmetric(msg: String, topic: String, peerID: String, symmetricKey: String, optionalSigningKey: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuLightpushPublishEncodeSymmetric(msg, topic, peerID, symmetricKey, optionalSigningKey, ms))
    }

    @objc(decodeSymmetric:withSymmetricKey:withResolver:withRejecter:)
    func decodeSymmetric(msg: String, symmetricKey: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuDecodeSymmetric(msg, symmetricKey))
    }

    @objc(decodeAsymmetric:withPrivateKey:withResolver:withRejecter:)
    func decodeAsymmetric(msg: String, privateKey: String, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuDecodeAsymmetric(msg, privateKey))
    }

    @objc(storeQuery:withPeerID:withMs:withResolver:withRejecter:)
    func storeQuery(queryJSON: String, peerID: String, ms: Int, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuStoreQuery(queryJSON, peerID, ms))
    }

}
