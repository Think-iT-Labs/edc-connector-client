import { EdcConnectorClientContext } from "../context";
import { EdcController } from "../edc-controller";

export class PublicController extends EdcController {
  async getTransferredData(
    headers: Record<string, string | undefined>,
    context?: EdcConnectorClientContext,
  ): Promise<Response> {
    const actualContext = context || this.context!;

    return this.inner.stream(actualContext.public, {
      path: "/",
      method: "GET",
      headers,
    });
  }
}
