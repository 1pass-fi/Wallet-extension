# Finnie Chrome Extension

You can find the latest version of Finnie wallet on [Chrome Store](https://chrome.google.com/webstore/detail/finnie/cjmkndjhnagcfbpiemnkdpomccnjblmj)

Finnie supports Google Chrome, we will support Firefox and Chromium-based browsers in the near future

## How to build locally
- Install [Nodejs](https://nodejs.org/en/) version 16
- Install [Yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable)
- Start locally
    - Run `yarn start:chrome` to start the dev-server and have Finnie installed in new Chrome instance
- Build locally
    - Run `yarn build`
    - Find package at `./extension`

## Integrate Finnie to your DApps
Please see our Finnie documentation for Dapp [here](https://docs.koii.network/finnie-for-devs/welcome-to-finnie)

## Contributing
### Running Unit Tests and Linting
- Run unit tests with `yarn test:unit`.
- Run linter with `yarn lint`, fix lint problems with `yarn lint --fix`
### Running E2E Tests
1. You have to start the included test dapp manually. This test dapp is designed specifically for e2e testing
2. We recommend to have a fresh build before running e2e tests

**Prerequisites**
- Run `yarn build`
- At project root run `cd ./testdapp` and `yarn start` to start the test dapp

Run e2e tests with `yarn test:e2e`
