# Talk with MY Mizuki

## Requirements
- TypeScript
- Serverless Framework
- Webpack
- yarn
- Create AWS account.
- Create AWS Cognito Identity Pools.
- Grant Polly Full Access Role to Unauthenticated users.


## Installation

### Setup Front-End sources.

Make configure JSON file.

```json
# www/src/config.json
{
  "api_gateway": {
    "base": "YOUR-API-GATEWAY-ENDPOINT",
    "key": "YOUR-API-KEY"
  },
  "cognito": {
    "identity_pool_id": "YOUR-COGNITO-IDENTITY-POOL-ID"
  }
}
```

Build

``` bash
$ cd www

# install dependencies
$ yarn

# build for production with minification
$ yarn run build
```

### Setup Back-End sources.

Build

```bash
$ cd api

# install dependencies
$ yarn

# deploy
$ yarn run deploy
```
