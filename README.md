<div align="center">
  <h1>EDC Client 👩‍🚀</h1>
  <p>
    <b>
      A HTTP client to communicate with the <a href="https://github.com/eclipse-dataspaceconnector/DataSpaceConnector">Eclipse Dataspace Connector</a> for Node.js and the browser.
    </b>
  </p>
  <sub>
    Built with ❤️ at <a href="https://think-it.io">Think-it</a>.
  </sub>
</div>

## Abstract

// TODO

> Similarly as for the ECC, this library is at its early stage.
> It aims to maintain compatibility with the lastest version of the _Connector_, and the versioning reflects
> which version 

## Usage

Install via `npm` or `yarn`

```sh
npm install @think-it-labs/edc-client
```

```sh
yarn add @think-it-labs/edc-client
```

Then it's possible to create a custom `Error` class extending the `TypedError`

```ts
import { EdcClient } from "@think-it-labs/edc-client"

const edcClient = new EdcClient();

```

```ts

const context = edcClient.createContext("123456", {
  default: "https://default.edc.example.com/",
  validation: "https://validation.edc.example.com/",
  data: "https://data.edc.example.com/",
  ids: "https://ids.edc.example.com/",
  public: "https://public.edc.example.com/",
  control: "https://control.edc.example.com/",
});

const asset = await edcClient.asset.createAsset(context, {
  asset: {
    properties: {
      "asset:prop:id": "urn:asset:a-http-asset",
      "asset:prop:name": "A HTTP asset",
    }
  },
  dataAddress: {
    properties: {
      uid: "2",
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

Now, during error handling code can inspect the `type` error and define behaviour accordingly

```ts

import { EdcClientError, EdcClientErrorType } from "@think-it-labs/edc-client"

try {
  
  // perform async EdcClient actions
  
} catch(error) {
  if (error instanceof EdcClientError) {
    switch (error.type) {
      case EdcClientErrorType.Duplicate: {
        // handle duplicate error
      }
      
      // ...
      
      case EdcClientErrorType.Unknown:
      default: {
        // red alert: unknown behaviour
      }
    }
  }
}

```

## Development

// TODO: docker-compose

// How to write tests

// Controllers division of concerns

## License

_EdcClient_ is distributed under the terms of the MIT license.

See [LICENSE](LICENSE) for details.
