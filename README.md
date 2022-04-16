# Crumbl: A Transparency Enhancing Tool for Cookie Collection

## Get started
### Prerequisites
1. Node.js v16.11 or above.
2. yarn (can be installed via npm)

At the project directory, run:
```
yarn install
yarn build
```

Drag the `build/` folder to Chrome to run the extension.

While developing the extension, run the following to automatically update build files.
```
yarn watch
```
Note that changes under `chorme/background.tsx` won't be automatically built, you'd need to run the following to refresh:
```
yarn build
```
