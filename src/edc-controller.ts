import { EdcConnectorClientContext } from "./context";
import { Inner } from "./inner";

export class EdcController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.inner = inner;
    this.context = context;
  }
}
