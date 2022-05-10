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

    override fun getName(): String {
        return "ReactNative"
    }

    @ReactMethod
    fun newNode(configJSON: String?, promise: Promise) {
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
    fun relaySubscribe(topic: String?, promise: Promise) {
        promise.resolve(Gowaku.relaySubscribe(topic))
    }

    @ReactMethod
    fun relayPublish(messageJSON: String, topic: String?, ms: Double, promise: Promise) {
        promise.resolve(Gowaku.relayPublish(messageJSON, topic, ms.toLong()))
    } 

/*
TODO: Create functions for these
extern char* waku_peers();
extern char* waku_decode_symmetric(char* messageJSON, char* symmetricKey);
extern char* waku_decode_asymmetric(char* messageJSON, char* privateKey);
extern char* waku_lightpush_publish(char* messageJSON, char* topic, char* peerID, int ms);
extern char* waku_lightpush_publish_enc_asymmetric(char* messageJSON, char* topic, char* peerID, char* publicKey, char* optionalSigningKey, int ms);
extern char* waku_lightpush_publish_enc_symmetric(char* messageJSON, char* topic, char* peerID, char* symmetricKey, char* optionalSigningKey, int ms);
extern char* waku_relay_enough_peers(char* topic);
extern char* waku_relay_publish_enc_asymmetric(char* messageJSON, char* topic, char* publicKey, char* optionalSigningKey, int ms);
extern char* waku_relay_publish_enc_symmetric(char* messageJSON, char* topic, char* symmetricKey, char* optionalSigningKey, int ms);
extern char* waku_relay_unsubscribe(char* topic);
extern char* waku_store_query(char* queryJSON, char* peerID, int ms);
*/

}
