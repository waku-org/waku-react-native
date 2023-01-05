# Fixing `route ip+net: netlinkrib: permission denied` in android


The details for this error can be seen in https://github.com/ipfs-shipyard/gomobile-ipfs/issues/68, and happens when targeting android API version +30. (`targetSdkVersion 30` in your `gradle.properties` / `build.gradle`) In this issue a possible solution was described which involved all the steps shown below. I have modified these to take in account that we are using +Go 1.18 as well as using a newer version of the Android NDK. These instructions should be used until https://github.com/golang/go/issues/40569 is fixed and a new gomobile version is released that includes this fix 


### Installing the requirements to build go-waku for android

These instructions assume that you are running Ubuntu, have NodeJS installed, and don't have any of the go and android required software installed. `root` access is required. Paths containing `/home/YOUR_USER` are referenced in different places. Replace `YOUR_USER` with your username (obtained with `whoami`). Don't blindly copy/paste the commands (It's not a good practice anyway)

**Installing required dependencies**
```
sudo apt update
sudo apt install build-essential unzip openjdk-11-jdk
```

**Installing Go 1.18**
```
wget https://go.dev/dl/go1.18.6.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.18.6.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

**Installing the Android NDK 25**
```
mkdir -p /home/YOUR_USER/Android/Sdk/
wget https://dl.google.com/android/repository/android-ndk-r25b-linux.zip
unzip android-ndk-r25b-linux.zip
mv -r android-ndk-r25b /home/YOUR_USER/Android/Sdk/ndk
export ANDROID_NDK_HOME=/home/YOUR_USER/Android/Sdk/ndk
```

**Installing the Android SDK command line tools and android-30**
```
mkdir /home/YOUR_USER/Android/Sdk/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip
unzip commandlinetools-linux-8512546_latest.zip
mv cmdline-tools /home/YOUR_USER/Android/Sdk/cmdline-tools/latest
export PATH=$PATH:/home/YOUR_USER/Android/Sdk/cmdline-tools/latest/bin
sdkmanager "platform-tools" "platforms;android-30"
```

### Building go-waku for android
```
mkdir -p /home/YOUR_USER/go/src/github.com/waku-org
cd /home/YOUR_USER/go/src/github.com/status-im
git clone https://github.com/waku-org/go-waku
cd go-waku
echo "replace github.com/multiformats/go-multiaddr v0.7.0 => github.com/waku-org/go-multiaddr v0.0.0-20230105211400-b3bd508cf855" >> go.mod
export GO111MODULE=off
go get golang.org/x/mobile/cmd/gobind
go get golang.org/x/mobile/cmd/gomobile
export GO111MODULE=on
gomobile init
export GO111MODULE=off
gomobile bind -v -target=android -androidapi=23 -ldflags="-s -w" -v -o ./build/lib/gowaku.aar ./mobile
```

### Edit waku-react-native
```
mkdir -p /home/YOUR_USER/waku
cd /home/YOUR_USER/waku
git clone https://github.com/waku-org/waku-react-native
cd waku-react-native
npm install
./download-gowaku.sh
cp /home/YOUR_USER/go/src/github.com/waku-org/build/lib/gowaku.aar ./android/libs/.
```

### Edit your react-native project
**Edit packages.json**
Set `@waku/react-native` to the absolute path of your local copy of `waku-react-native` downloaded in the previous step
```json
...
    "dependencies": {
        "@waku/react-native": "file:/home/YOUR_USER/waku/waku-react-native/",
    }
...
```
And execute `npm install` (or `yarn`) to link your local dependency

**Edit metro.config.js**
```js
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const root = '/home/YOUR_USER/waku/waku-react-native/';
const pak = require(root + 'package.json');

module.exports = {
  // ...
  watchFolders: [root],
  resolver: {
    blacklistRE: exclusionList(
      Object
        .keys({...pak.peerDependencies})
        .map(m => new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`))
    ),
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          if (target.hasOwnProperty(name)) {
            return target[name]
          }
          return path.join(process.cwd(), `node_modules/${name}`)
        },
      },
    ),
  },
}
```
If you're using `expo`, in `waku-react-native`'s example app, you can see an example configuration achieving the same result

**Edit your application `android/build.gradle`**
Add `gowaku.aar` to the list of dependencies
```js
...
dependencies {
    
    implementation files("$rootDir/../node_modules/@waku/react-native/android/libs/gowaku.aar")

}
...
```

**Edit `MainApplication.java`**

```java
// Add the following imports
import go.Seq;
import java.lang.StringBuilder;
import java.net.InetAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

...

  @Override
  public void onCreate() {
    // ...

    // Add this line so that if RunOnJVM() with golang.org/x/mobile/app to call JAVA from GO,
    // will not cause error "no current JVM"
    Seq.setContext(getApplicationContext());
  }

...
  // Add this function
  // To fix [x/mobile: Calling net.InterfaceAddrs() fails on Android SDK 30](https://github.com/golang/go/issues/40569)
  // Ref to getInterfaces() in https://github.com/tailscale/tailscale-android/pull/21/files
  //
  // Returns details of the interfaces in the system, encoded as a single string for ease
  // of JNI transfer over to the Go environment.
  //
  // Example:
  // rmnet_data0 10 2000 true false false false false | fe80::4059:dc16:7ed3:9c6e%rmnet_data0/64
  // dummy0 3 1500 true false false false false | fe80::1450:5cff:fe13:f891%dummy0/64
  // wlan0 30 1500 true true false false true | fe80::2f60:2c82:4163:8389%wlan0/64 10.1.10.131/24
  // r_rmnet_data0 21 1500 true false false false false | fe80::9318:6093:d1ad:ba7f%r_rmnet_data0/64
  // rmnet_data2 12 1500 true false false false false | fe80::3c8c:44dc:46a9:9907%rmnet_data2/64
  // r_rmnet_data1 22 1500 true false false false false | fe80::b6cd:5cb0:8ae6:fe92%r_rmnet_data1/64
  // rmnet_data1 11 1500 true false false false false | fe80::51f2:ee00:edce:d68b%rmnet_data1/64
  // lo 1 65536 true false true false false | ::1/128 127.0.0.1/8
  // v4-rmnet_data2 68 1472 true true false true true | 192.0.0.4/32
  //
  // Where the fields are:
  // name ifindex mtu isUp hasBroadcast isLoopback isPointToPoint hasMulticast | ip1/N ip2/N ip3/N;
  String getInterfacesAsString() {
    List<NetworkInterface> interfaces;
    try {
      interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
    } catch (Exception e) {
      return "";
    }

    StringBuilder sb = new StringBuilder("");
    for (NetworkInterface nif : interfaces) {
      try {
        // Android doesn't have a supportsBroadcast() but the Go net.Interface wants
        // one, so we say the interface has broadcast if it has multicast.
        sb.append(String.format(java.util.Locale.ROOT, "%s %d %d %b %b %b %b %b |", nif.getName(),
                       nif.getIndex(), nif.getMTU(), nif.isUp(), nif.supportsMulticast(),
                       nif.isLoopback(), nif.isPointToPoint(), nif.supportsMulticast()));

        for (InterfaceAddress ia : nif.getInterfaceAddresses()) {
          // InterfaceAddress == hostname + "/" + IP
          String[] parts = ia.toString().split("/", 0);
          if (parts.length > 1) {
            sb.append(String.format(java.util.Locale.ROOT, "%s/%d ", parts[1], ia.getNetworkPrefixLength()));
          }
        }
      } catch (Exception e) {
        // TODO(dgentry) should log the exception not silently suppress it.
        continue;
      }
      sb.append("\n");
    }

    return sb.toString();
  }

...

```

After this step, build your app. The error should have dissapeared. 
In `adb logcat` you will see this message instead `avc: denied { bind } for scontext=u:r:untrusted_app` which seems to be due to Android restrictions which prevents Waku from obtaining the IP address of the device, but it will still be able to connect to other devices succesfully.
