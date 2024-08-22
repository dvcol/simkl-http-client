<h1 align="center">@dvcol/simkl-http-client</h1>
<p>
  <img src="https://img.shields.io/badge/pnpm-%3E%3D9.0.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg" />
  <a href="https://paypal.me/dvcol/5" target="_blank">
    <img alt="donate" src="https://img.shields.io/badge/Donate%20€-PayPal-brightgreen.svg" />
  </a>
</p>

> Simple fetch based http client for Simkl API with full typescript support (request and response).

## Prerequisites

- pnpm >=9.0.0
- node >=20.0.0

## Install

```sh
pnpm install
```

## Usage

```sh
pnpm add @dvcol/simkl-http-client
```

### Modular endpoint bundling

Simkl-http-client is designed to be modular and flexible. Although it uses static classes, endpoints are instantiated at runtime and can be easily omitted, extended or overridden.
If your bundler does not support tree-shaking, you can omit unused endpoints by only importing the ones you need.

By default we provide a [full api](https://github.com/dvcol/simkl-http-client/blob/main/lib/api/simkl-api.endpoints.ts#L25) object with all supported endpoints, as well as a [minisimkl api](https://github.com/dvcol/simkl-http-client/blob/main/lib/api/simkl-api-minisimkl.endpoints.ts) object with only the essential authentication endpoints.
You can also import any [endpoint by common scope](https://github.com/dvcol/simkl-http-client/tree/main/lib/api/endpoints).

```ts

import { SimklClient } from '@dvcol/simkl-http-client';
import { anime } from '@dvcol/simkl-http-client/api/anime';
import { minimalSimklApi } from '@dvcol/simkl-http-client/api/minimal';
import { search } from '@dvcol/simkl-http-client/api/search';
 
import { Config } from '@dvcol/simkl-http-client/config';

import type { SimklClientSettings } from '@dvcol/simkl-http-client/models';


const simklUsedApi = {
  ...minimalSimklApi,
  anime,
  search
};

const simklClientSettings: SimklClientSettings = {
  client_id: '<Your simkl ID>',
  client_secret: '<Your simkl secret>',
  redirect_uri: '<Your simkl redirect uri>',
  
  endpoint: Config.endpoint,

  useragent: '<Your user Agent>',
  corsProxy: '<Optional cors Proxy>',
  corsPrefix: '<Optional cors Proxy prefix>',
};

const initAuthentication = {}


const simklClient = new SimklClient(simklClientSettings, initAuthentication, simklUsedApi);
```

### Features

[//]: # (TODO update this section)

* [Built-in cache support](https://github.com/dvcol/simkl-http-client/blob/2bedf54a661560b350845f2640cc9090e98c7c7f/lib/clients/simkl-client.test.ts#L89-L165) (per client, endpoint, or query)
* [Extensible cache store](https://github.com/dvcol/simkl-http-client/blob/2bedf54a661560b350845f2640cc9090e98c7c7f/lib/clients/simkl-client.test.ts#L145-L164) (in-memory, local storage, etc.)
* [Event observer](https://github.com/dvcol/base-http-client/blob/ed17c369f3cdf93656568373fc2dba841050e427/lib/client/base-client.test.ts#L486-L575) (request, query, auth)
* [Built-in cancellation support](https://github.com/dvcol/base-http-client/blob/ed17c369f3cdf93656568373fc2dba841050e427/lib/client/base-client.test.ts#L691-L758)
* [Code redirect authentication](https://github.com/dvcol/simkl-http-client/blob/2bedf54a661560b350845f2640cc9090e98c7c7f/lib/clients/simkl-client.ts#L62-L118)
* [Device code polling](https://github.com/dvcol/simkl-http-client/blob/2bedf54a661560b350845f2640cc9090e98c7c7f/lib/clients/simkl-client.ts#L203-L243)

### Documentation

See [Simkl API documentation](https://simkl.docs.apiary.io/) for more information.

## Author

* Github: [@dvcol](https://github.com/dvcol)

## 📝 License

This project is [MIT](https://github.com/dvcol/simkl-http-client/blob/master/LICENSE) licensed.
