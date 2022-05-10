import Gowaku

@objc(ReactNative)
class ReactNative: NSObject {

    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }

    @objc(defaultPubsubTopic:withRejecter:)
    func defaultPubsubTopic(_ resolve:RCTPromiseResolveBlock, withRejecter reject:RCTPromiseRejectBlock) -> Void {
        resolve(GowakuDefaultPubsubTopic())
    }
}
