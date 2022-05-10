import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { defaultPubsubTopic, newNode, onMessage, peerID, relayPublish, relaySubscribe, start, stop, WakuMessage } from '@waku/react-native';




export default function App() {
  const [result, setResult] = React.useState<string | undefined>();


  React.useEffect(() => {
    (async () => {
      await newNode();  // TODO: This must be called only once
      await start(); // // TODO: This must be called only once

      console.log("The node ID:", await peerID())

      await relaySubscribe()

      onMessage(event => {
        console.log("EVENT RECEIVED: ", event)

      })

      let msg: WakuMessage = new WakuMessage()
      msg.contentTopic = "ABC"
      msg.payload = new Uint8Array([1, 2, 3, 4, 5])
      msg.timestamp = Date.now();
      msg.version = 0;

      let messageID = await relayPublish(msg);

      console.log("The messageID", messageID)


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
