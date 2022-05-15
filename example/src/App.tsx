import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { defaultPubsubTopic, newNode, start, stop, peerID, relayEnoughPeers, listenAddresses, connect, peerCnt, peers, relayPublish, relayUnsubscribe, relaySubscribe, WakuMessage, onMessage } from '@waku/react-native';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();


  React.useEffect(() => {
    (async () => {
      await newNode(null);  // TODO: This must be called only once
      await start(); // // TODO: This must be called only once

      console.log("The node ID:", await peerID())

      await relaySubscribe()

      onMessage(event => {
        console.log("Message Received: ", event)
      })

      console.log("enoughPeers?", await relayEnoughPeers())
      console.log("addresses", await listenAddresses())
      console.log("connecting...")
      
      await connect("/dns4/node-01.ac-cn-hongkong-c.wakuv2.test.statusim.net/tcp/30303/p2p/16Uiu2HAkvWiyFsgRhuJEb9JfjYxEkoHLgnUQmr1N5mKWnYjxYRVm", 5000)
      
      console.log("connected!")

      console.log("PeerCNT", await peerCnt())
      console.log("Peers", await peers())

      let msg: WakuMessage = new WakuMessage()
      msg.contentTopic = "ABC"
      msg.payload = new Uint8Array([1, 2, 3, 4, 5])
      msg.timestamp = Date.now();
      msg.version = 0;

      let messageID = await relayPublish(msg);

      console.log("The messageID", messageID)

      await relayUnsubscribe();
    
      await stop(); // TODO: This must be called only once
    })();

    defaultPubsubTopic().then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
