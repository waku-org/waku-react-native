package com.wakureactnative
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import gowaku.Gowaku

class ReactNativeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ReactNative"
    }

    var reactContext = reactContext
    lateinit var signalHandler: gowaku.SignalHandler

    class DefaultEventHandler(reactContext: ReactApplicationContext) : gowaku.SignalHandler {
        var reactContext = reactContext

        private fun sendEvent(reactContext: ReactApplicationContext, eventName: String, params: WritableMap?) {
            reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
        }

        override fun handleSignal(signalJson: String) {

            val params = Arguments.createMap().apply {
                putString("signal", signalJson)
            }

            sendEvent(reactContext, "message", params)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @ReactMethod
    fun newNode(configJSON: String = "", promise: Promise) {
      signalHandler = DefaultEventHandler(reactContext)
      Gowaku.setMobileSignalHandler(signalHandler)
      promise.resolve(Gowaku.newNode(configJSON))
    }

    @ReactMethod
    fun start(promise: Promise) {
        promise.resolve(Gowaku.start());
    }
    
    @ReactMethod
    fun stop(promise: Promise) {
      promise.resolve(Gowaku.stop())
    }

    @ReactMethod
    fun isStarted(promise: Promise) {
        promise.resolve(Gowaku.isStarted())
    }

    @ReactMethod
    fun peerID(promise: Promise) {
        promise.resolve(Gowaku.peerID())
    }

    @ReactMethod
    fun listenAddresses(promise: Promise) {
        promise.resolve(Gowaku.listenAddresses())
    }

    @ReactMethod
    fun addPeer(address: String, protocolID: String, promise: Promise) {
        promise.resolve(Gowaku.addPeer(address, protocolID))
    }

    @ReactMethod
    fun connect(address: String, ms: Double, promise: Promise) {
        promise.resolve(Gowaku.connect(address, ms.toLong()))
    }

    @ReactMethod
    fun connectPeerID(peerID: String, ms: Double, promise: Promise) {
        promise.resolve(Gowaku.connectPeerID(peerID, ms.toLong()))
    }

    @ReactMethod
    fun disconnect(peerID: String, promise: Promise) {
        promise.resolve(Gowaku.disconnect(peerID))
    }

    @ReactMethod
    fun peerCnt(promise: Promise) {
        promise.resolve(Gowaku.peerCnt())
    }

    @ReactMethod
    fun defaultPubsubTopic(promise: Promise) {    
       promise.resolve(Gowaku.defaultPubsubTopic())
    }

    @ReactMethod
    fun relaySubscribe(topic: String, promise: Promise) {
        promise.resolve(Gowaku.relaySubscribe(topic))
    }

    @ReactMethod
    fun relayPublish(messageJSON: String, topic: String, ms: Double, promise: Promise) {
        promise.resolve(Gowaku.relayPublish(messageJSON, topic, ms.toLong()))
    } 

    @ReactMethod
    fun relayEnoughPeers(topic: String, promise: Promise) {
        promise.resolve(Gowaku.relayEnoughPeers(topic))
    }

    @ReactMethod
    fun relayUnsubscribe(topic: String, promise: Promise) {
        promise.resolve(Gowaku.relayUnsubscribe(topic))
    }

    @ReactMethod
    fun relayPublishEncodeAsymmetric(messageJSON: String, topic: String, publicKey: String, optionalSigningKey: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.relayPublishEncodeAsymmetric(messageJSON, topic, publicKey, optionalSigningKey, ms.toLong()))
    }

    @ReactMethod
    fun relayPublishEncodeSymmetric(messageJSON: String, topic: String, symmetricKey: String, optionalSigningKey: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.relayPublishEncodeSymmetric(messageJSON, topic, symmetricKey, optionalSigningKey, ms.toLong()))
    }

    @ReactMethod
    fun peers(promise: Promise) {
        promise.resolve(Gowaku.peers())
    }

    @ReactMethod
    fun lightpushPublish(messageJSON: String, topic: String, peerID: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.lightpushPublish(messageJSON, topic, peerID, ms.toLong()))
    }

    @ReactMethod
    fun lightpushPublishEncodeAsymmetric(messageJSON: String, topic: String, peerID: String = "", publicKey: String = "", optionalSigningKey: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.lightpushPublishEncodeAsymmetric(messageJSON, topic, peerID, publicKey, optionalSigningKey, ms.toLong()))
    }

    @ReactMethod
    fun lightpushPublishEncodeSymmetric(messageJSON: String, topic: String, peerID: String = "", symmetricKey: String = "", optionalSigningKey: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.lightpushPublishEncodeSymmetric(messageJSON, topic, peerID, symmetricKey, optionalSigningKey, ms.toLong()))
    }

    @ReactMethod
    fun decodeSymmetric(messageJSON: String, symmetricKey: String, promise: Promise) {
        promise.resolve(Gowaku.decodeSymmetric(messageJSON, symmetricKey))
    }

    @ReactMethod
    fun decodeAsymmetric(messageJSON: String, privateKey: String, promise: Promise) {
        promise.resolve(Gowaku.decodeAsymmetric(messageJSON, privateKey))
    }

    @ReactMethod
    fun storeQuery(queryJSON: String, peerID: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.storeQuery(queryJSON, peerID, ms.toLong()))
    }

    @ReactMethod
    fun filterSubscribe(filterJSON: String, peerID: String = "", ms: Double, promise: Promise) {
        promise.resolve(Gowaku.filterSubscribe(filterJSON, peerID, ms.toLong()))
    }

    @ReactMethod
    fun filterUnsubscribe(filterJSON: String, ms: Double, promise: Promise) {
        promise.resolve(Gowaku.filterUnsubscribe(filterJSON, ms.toLong()))
    }

}
