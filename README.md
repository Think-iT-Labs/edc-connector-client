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

This project aims to increase the level of abstraction, bringing the _low-level_ HTTP API to _mid-level_
developers by providing an HTTP Client which is thoroughly tested and fully type-safe.

> Similarly to the **EDC Connector**, this library is at its early stage.
> It aims to maintain compatibility with the latest version of the _Connector_.
> API specification can be found on [Management Api Openapi UI](https://eclipse-edc.github.io/Connector/openapi/management-api/)

## Compatibility matrix
| Client         | API                                                                    |
|----------------|------------------------------------------------------------------------|
| 0.9.x          | **Management** v3<br>**Catalog** v1-alpha<br>**Identity Hub** v1-alpha |
| 0.8.x<br>0.7.x | **Management** v3<br>**Catalog** v1-alpha                              |

| Client         | EDC   |
|----------------|-------|
| 0.6.x          | 0.7.x |
| 0.5.x<br>0.4.x | 0.6.x |
| 0.3.0          | 0.5.0 |
| 0.2.1          | 0.4.1 |
| 0.2.0          | 0.2.0 |

## Usage

Install via `npm` or `yarn`

```sh
npm install @think-it-labs/edc-connector-client
```

```sh
yarn add @think-it-labs/edc-connector-client
```

Once installed, clients can be instanciated by construcing a `EdcConnectorClient`.

### With internal context

The standard way of using the client would be associating it with a connector,
for doing that it can be instantiated through the `EdcConnectorClient.Builder`

```ts
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client"

const client = new EdcConnectorClient.Builder()
  .apiToken("123456")
  .managementUrl("https://edc.think-it.io/management")
  .build();
```

At this point the calls can be made against the specified connector:
```ts
const result = await client.management.assets.create({
  properties: {
      "name": "asset name",
      "key": "any value"
  },
  dataAddress: {
    name: "An HTTP address",
    baseUrl: "https://example.com/",
    type: "HttpData",
    path: "/some-data",
    contentType: "application/json",
    method: "GET",
  },
});
```

### Without internal context

A single connector instance can be used to call multiple connectors, just creating
different contexts and passing them to the specific call.

The connector can be instantiated directly without the builder:
```ts
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client"

const client = new EdcConnectorClient();
```

Context objects can be created with a `createContext` call:
```ts
const context = client.createContext("123456", {
  default: "https://edc.think-it.io/api",
  management: "https://edc.think-it.io/management",
  protocol: "https://edc.think-it.io/protocol",
  control: "https://edc.think-it.io/control",
});
```

And the context can be passed to every call as latest argument:
```ts
const result = await client.management.assets.create(context, {
  asset: {
    properties: {
      "name": "asset name",
      "key": "any value"
    },
    dataAddress: {
      name: "An HTTP address",
      baseUrl: "https://example.com/",
      type: "HttpData",
      path: "/some-data",
      contentType: "application/json",
      method: "GET",
    },
  }
});
```

### Extending the Client with Custom Controllers

The client can be extended with custom controllers using the `use` method. This feature allows you to add your own functionality while maintaining type safety through the `EdcController` base class. The extension system is designed to be middleware-like, where each controller is lazily instantiated when accessed.

Here's how to use it:

```ts
import { EdcConnectorClient, EdcController } from "@think-it-labs/edc-connector-client"

// Define your custom controller by extending EdcController
class CustomController extends EdcController {
  constructor(inner: any, context: any) {
    super(inner, context);
  }

  async customMethod() {
    // Your custom implementation
    // You have access to this.inner and this.context
  }
}

// Extend the client with your custom controller
const client = new EdcConnectorClient.Builder()
  .apiToken("123456")
  .managementUrl("https://edc.think-it.io/management")
  .use("custom", CustomController)  // Add your custom controller
  .build();

// Use your custom controller
await client.custom.customMethod();
```

The `use` method takes two parameters:
1. A string property name that will be used to access your controller
2. A class that extends `EdcController`

The `EdcController` base class provides:
- A standardized way to construct controllers
- Access to the client's `inner` functionality
- Access to the client's `context` for making API calls

TypeScript will properly type your custom controller and its methods, ensuring type safety throughout your application. You can also explicitly type your extended client:

```ts
type MyExtendedClient = EdcConnectorClientType<{
  custom: CustomController;
}>;

const client: MyExtendedClient = new EdcConnectorClient.Builder()
  .use("custom", CustomController)
  .build();
```

## Error handling

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

> **Note** if you encounter an `Unknown` error you should report this behavior
> along steps to reproduce it. `Unknown` behaviors are unwanted and must be fixed asap.

## Development

`docker compose` is used to run the development environment. It runs two
connectors with capabilities described in the
[gradle configuration](connector/build.gradle.kts) file.

Please, adhere to the [CONTRIBUTING](CONTRIBUTING.md) guidelines when suggesting
changes in this repository.

### Release
The [`release`](./.github/workflows/release.yml) GitHub action workflow takes care of release.

## License

Copyright 2022-2025 Think.iT GmbH.

Licensed under the [Apache License, Version 2.0](LICENSE). Files in the project
may not be copied, modified, or distributed except according to those terms.
