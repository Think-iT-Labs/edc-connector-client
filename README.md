<div align="center">
  <h1>EDC Connector Client 👩‍🚀</h1>
  <p>
    <b>
      A HTTP client to communicate with the <a href="https://github.com/eclipse-edc/Connector">EDC Connector</a> for Node.js and the browser.
    </b>
  </p>
  <sub>
    Built with ❤️ at <a href="https://think-it.io">Think-it</a>.
  </sub>
</div>

## Abstract

The [**EDC Connector**](https://github.com/eclipse-edc/Connector) is a framework for a sovereign, inter-organizational
data exchange. It provides _low-level_ primitives to allow network participants to expose and consume offers.
The _Connector_ does so by providing an extensive HTTP API documented via
[OpenAPI specification](https://github.com/eclipse-edc/Connector/blob/0366295879b133756f534b4138257722c341cde5/resources/openapi/openapi.yaml).

This project aims to increase the level of abstraction, bringing the _low-level_ HTTP API to _mid-level_
developers by providing an HTTP Client which is thoroughly tested and fully type-safe.

> Similarly to the **EDC Connector**, this library is at its early stage.
> It aims to maintain compatibility with the latest version of the _Connector_, currently `v0.0.1-milestone-7`.
> The compatibility is reflected in the library's versioning. The _EDC Connector Client_ follows semver where possible,
> keeping _major_ and _minor_ related to the **EDC Connector** while _patch_ reserved for library's related fixes.

## Usage

Install via `npm` or `yarn`

```sh
npm install @think-it-labs/edc-connector-client
```

```sh
yarn add @think-it-labs/edc-connector-client
```

Once installed, clients can be instanciated by construcing a `EdcConnectorClient`.

```ts
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client"

const edcConnectorClient = new EdcConnectorClient();

```

The `EdcConnectorClient` is connector-agnostic; hence it doesn't know nor store
connectors' token and addresses. Instead, these are passed to each method through a context
object, representing a unique connector.

```ts

const context = edcConnectorClient.createContext("123456", {
  default: "https://default.edc.think-it.io/",
  validation: "https://validation.edc.think-it.io/",
  data: "https://data.edc.think-it.io/",
  ids: "https://ids.edc.think-it.io/",
  dataplane: "https://dataplane.edc.think-it.io/",
  public: "https://public.edc.think-it.io/",
  control: "https://control.edc.think-it.io/",
});

const result = await edcConnectorClient.management.createAsset(context, {
  asset: {
    properties: {
      "asset:prop:id": "a-http-asset-id",
      "asset:prop:name": "A HTTP asset",
    }
  },
  dataAddress: {
    properties: {
      name: "An HTTP address",
      baseUrl: "https://example.com/",
      type: "HttpData",
      path: "/some-data",
      contentType: "application/json",
      method: "GET",
    },
  },
});

```

All API methods are _type, and error-safe_, which means arguments are fully typed
with [TypeScript](https://www.typescriptlang.org/), and thrown errors are always
`EdcConnectorClientError` instances. This error safety level is achieved using the
[`TypedError`](https://github.com/Think-iT-Labs/typed-error) library. 

```ts

import { EdcConnectorClientError, EdcConnectorClientErrorType } from "@think-it-labs/edc-connector-client"

try {
  
  // perform async EdcConnectorClient actions
  
} catch(error) {
  if (error instanceof EdcConnectorClientError) {
    switch (error.type) {
      case EdcConnectorClientErrorType.Duplicate: {
        // handle duplicate error
      }
      
      // ...
      
      case EdcConnectorClientErrorType.Unknown:
      default: {
        // red alert: unknown behaviour
      }
    }
  }
}

```

> **Note** if you encounter an `Unknown` error you should report this behaviour
> along steps to reproduce it. `Unknown` behaviours are unwanted and must be fixed asap.

## Development

// TODO: docker-compose

// How to write tests

// Controllers division of concerns

## License

_EdcConnectorClient_ is distributed under the terms of the MIT license.

See [LICENSE](LICENSE) for details.
