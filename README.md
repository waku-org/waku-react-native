# @waku/react-native
Waku React Native
## Installation

```sh
npm install @waku/react-native
```

Edit `settings.gradle` from your app and add:
```
include ':gowaku'
project(':gowaku').projectDir = new File(rootProject.projectDir, './../node_modules/@waku/react-native/android/gowaku')
```

## Usage

```js
import * as waku from "@waku/react-native";
```

See also [Fixing `route ip+net: netlinkrib: permission denied` in android](android-netlink.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
