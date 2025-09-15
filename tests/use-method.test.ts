import { EdcConnectorClient } from "../src/client";
import { EdcConnectorClientContext } from "../src/context";
import { EdcController } from "../src/edc-controller";
import { Inner } from "../src/inner";

class CustomController extends EdcController {
    getInner() {
        return this.inner as Inner;
    }

    getContext() {
        return this.context as EdcConnectorClientContext;
    }
}

describe("Builder.use custom controller integration", () => {
    it("exposes the custom controller on the client and wires internals", () => {
        const token = "test-token-123";
        const managementUrl = "https://example.com/management";

        const client = new EdcConnectorClient.Builder()
            .apiToken(token)
            .managementUrl(managementUrl)
            .use("custom", CustomController)
            .build();

        expect(client.custom).toBeDefined();
        expect(typeof client.custom).toBe("object");
        expect(client.custom).toBeInstanceOf(CustomController);

        const inner = client.custom.getInner();
        expect(inner).toBeInstanceOf(Inner);

        const context = client.custom.getContext();
        expect(context).toBeInstanceOf(EdcConnectorClientContext);

        expect(context.apiToken).toBe(token);

        expect(context.management).toBe(managementUrl);
    });
});


