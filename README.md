# Identify Me! Library
React-based browser JavaScript API for rendering user identification-related components inline of existing HTML.

## Installation
Clone the repository and install the dependencies. Requires the use of [Yarn](https://yarnpkg.com), which can be installed using Homebrew on MacOS.
```
yarn install
```

## Development
Once the dependencies are installed, you can run the server (with live-reload and HMR) by executing:
```
npm run start:dev
```
This will build the code (using Webpack) into the `/dist` folder. You can now access the component test page at `http://localhost:3080`.
You'll also need to have the `identify-me-server` library installed and running in order to fullfill backend requests, as this library proxies to `http://localhost:8000`.
