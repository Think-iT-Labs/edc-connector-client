import { EdcConnectorClientContext } from "../src";
import { Inner } from "../src/inner";

interface ActiveResponse {
  active: boolean;
}

export class EdcController {
  protected inner: Inner;
  protected context?: EdcConnectorClientContext;

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    this.inner = inner;
    this.context = context;
  }
}

export type EdcControllerClass = {
  prototype: Pick<EdcController, keyof EdcController>;
  new (inner: Inner, context?: EdcConnectorClientContext): EdcController;
};

export class ResourcesCountController extends EdcController {
  async active(): Promise<ActiveResponse> {
    return {
      active: true,
    };
  }
}

export class WooooController extends EdcController {
  async woooo(): Promise<ActiveResponse> {
    return {
      active: false,
    };
  }
}

export type Class<T, Arguments extends unknown[] = any[]> = {
  prototype: Pick<T, keyof T>;
  new (...arguments_: Arguments): T;
};
