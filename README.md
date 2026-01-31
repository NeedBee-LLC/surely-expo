# Surely-Expo

Official client for the Surely todo app. An Expo React Native app that builds to both iOS and web.

Backend is <https://api.surelytodo.com>. If you'd like to build the client yourself, you can still use the same backend, or you can set up your own installation of [surely-api](https://github.com/CodingItWrong/surely-api) to point to.

## Code Features

- Deployed to both [iOS](https://apps.apple.com/us/app/surely/id1586633713) and [web](https://surelytodo.com). Only blocker on Android is a dependency requiring [intl support](https://github.com/web-ridge/react-native-paper-dates#android-caveats).
- Material Design with dark mode support on all platforms via React Native Paper.
- Navigation via React Navigation, including predictable web URLs and a drawer that smoothly transitions between persistent on large viewports and collapsible on small.
- Uses a custom styling library, [`react-native-style-queries`](https://github.com/bignerdranch/BNR-react-native-style-queries), to apply responsive styles declaratively in a way inspired by media queries.
- Thoroughly tested via React Native Testing Library.
- Dependencies kept up-to-date with minimal effort: when tests pass and app boots, can be confident nothing's broken.
- Good accessibility labels, which I used via iOS Voice Control while I was experiencing some wrist pain.
- Since it is a "CRUD" app, uses JSON:API for the data layer to minimize client and server code needed to be written. Uses a custom client library, [`@codingitwrong/jsonapi-client`](https://github.com/CodingItWrong/jsonapi-client/).

## Support

You have two options for getting support with Surely:

- [Open a GitHub Issue on this repo](https://github.com/CodingItWrong/surely-expo/issues)
- Send a support email to support at surelytodo dot com

## Requirements

- Node 22.x
- [Yarn 1.x](https://yarnpkg.com/en/docs/install)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/#1-install-the-latest-eas-cli)
- [Cocoapods](https://guides.cocoapods.org/using/getting-started.html#installation)
- [Fastlane](https://docs.fastlane.tools/getting-started/ios/setup/)
- [Detox CLI](https://wix.github.io/Detox/docs/introduction/getting-started/#1-command-line-tools-detox-cli)

Requirements and npm dependencies can be installed by running `bin/setup`

## Installation

```bash
$ yarn install
```

## Running

### iOS

Build and install native dev client on a simulator:

```bash
$ yarn ios
```

If the native dev client is already installed:

```bash
$ yarn start
```

Then press `i`

### Web

```bash
$ yarn start
```

Then press `w` to run in a web browser

### Physical iOS Device

- Open `src/baseUrl.js` and set a `LOCAL_IP` for the dev server
- Plug in physical device
- Run `yarn ios --device`

## Testing

### Linting

```bash
$ yarn lint
```

### Unit Tests

```bash
$ yarn test
```

### End-to-End Tests (web)

- `yarn start`
- Click "Run in web browser"
- In another terminal, `yarn cypress`

## Release

### iOS

- Increment the `ios.buildNumber` in `app.json`
- Run `yarn build:ios`
- Once the build completes, upload the `.ipa` file it created to TestFlight using the Apple [Transporter](https://apps.apple.com/us/app/transporter/id1450874784?mt=12) app.

If this doesn't work, do a prebuild (see instructions above) then archive the app in Xcode.

### Web

```bash
$ yarn build:web
```

- Copy the `web-build` folder to somewhere accessible on the public internet
- Configure the web server to route all paths that aren't found on disk to `index.html`; that way links to pages handled by React Navigation will all load up the app

## License

MIT
