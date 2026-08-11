import { EdcConnectorClientContext } from "../../context";
import { Dataplane, JsonLdService } from "../../entities";
import { Inner } from "../../inner";

export class DataplaneController {
  #inner: Inner;
  #context?: EdcConnectorClientContext;
  #jsonLdService: JsonLdService;
  #basePath = "/v3/dataplanes";

  constructor(
    inner: Inner,
    jsonLdService: JsonLdService,
    context?: EdcConnectorClientContext,
  ) {
    this.#inner = inner;
    this.#context = context;
    this.#jsonLdService = jsonLdService;
  }

  async list(context?: EdcConnectorClientContext): Promise<Dataplane[]> {
    const actualContext = context || this.#context!;

    return this.#inner
      .request(actualContext.management, {
        path: this.#basePath,
        method: "GET",
        authorization: actualContext.authorization,
      })
      .then((body) =>
        this.#jsonLdService.expandArray(body, () => new Dataplane()),
      );
  }
}
