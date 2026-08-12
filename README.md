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
  .authorization("X-Api-Key", "123456")
  .managementUrl("https://edc.think-it.io/management")
  .build();
```

The `authorization(key, value)` method sets the HTTP header used to authenticate requests (e.g. `"X-Api-Key"`, `"Authorization"`).

> **Note** `apiToken(token)` is deprecated. It is equivalent to calling `.authorization("X-Api-Key", token)`.

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
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";

const context = EdcConnectorClient.createContext({
  authorization: { "X-Api-Key": "123456" },
  addresses: {
    default: "https://edc.think-it.io/api",
    management: "https://edc.think-it.io/management",
    protocol: "https://edc.think-it.io/protocol"
  },
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

### Customizing the JSON-LD Context

Management request bodies include an `@context` field whose value is derived automatically from the configured `managementApiVersion` (a `{ "@vocab": ... }` object for v3, a URL array for any other version). When a connector requires a different context value, it can be overridden with `managementJsonLdContext`.

The option accepts a plain URL string, an array of URLs, or a full JSON-LD context object:

**Via the builder:**
```ts
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";

// string URL
const client = new EdcConnectorClient.Builder()
  .managementUrl("https://edc.think-it.io/management")
  .managementJsonLdContext("https://custom.example.com/context/v1")
  .build();

// JSON-LD context object
const client = new EdcConnectorClient.Builder()
  .managementUrl("https://edc.think-it.io/management")
  .managementJsonLdContext({ "@vocab": "https://custom.example.com/ns/" })
  .build();

// array of context URLs
const client = new EdcConnectorClient.Builder()
  .managementUrl("https://edc.think-it.io/management")
  .managementJsonLdContext(["https://ctx1.example.com", "https://ctx2.example.com"])
  .build();
```

**Via `createContext`:**
```ts
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";

const context = EdcConnectorClient.createContext({
  addresses: { management: "https://edc.think-it.io/management" },
  managementJsonLdContext: "https://custom.example.com/context/v1",
});
```

When `managementJsonLdContext` is set it takes precedence over the version-based default for every management request made with that client or context.

### Caching JSON-LD Context Documents

When the client expands or compacts JSON-LD responses, it resolves any `@context` URLs using a document loader. By default, well-known EDC and DSP context URLs are resolved locally without any network request. For connectors that reference additional context URLs, you can pre-cache those documents so they are also resolved locally instead of fetched at runtime.

Use `.cachedJsonLdContext(url, document)` on the builder to register a context URL together with its JSON-LD context document:

```ts
import { EdcConnectorClient } from "@think-it-labs/edc-connector-client";

const myCustomContext = {
  "@context": {
    "ex": "https://example.com/ns/",
    "customProperty": "ex:customProperty"
  }
};

const client = new EdcConnectorClient.Builder()
  .authorization("X-Api-Key", "123456")
  .managementUrl("https://edc.think-it.io/management")
  .cachedJsonLdContext("https://example.com/contexts/custom.jsonld", myCustomContext)
  .build();
```

Multiple contexts can be cached by chaining the method:

```ts
const client = new EdcConnectorClient.Builder()
  .managementUrl("https://edc.think-it.io/management")
  .cachedJsonLdContext("https://example.com/contexts/v1.jsonld", contextV1)
  .cachedJsonLdContext("https://example.com/contexts/v2.jsonld", contextV2)
  .build();
```

Cached documents take precedence over any network fetch. Context URLs not found in the cache fall back to the default network loader.

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
