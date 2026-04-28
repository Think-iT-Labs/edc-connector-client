import { StartedTestContainer } from "testcontainers"
import { EdcConnectorClient } from "../../../src"
import { PresentationController } from "../../../src/controllers/presentation-controller"
import {
    startPrismContainer,
    stopPrismContainer,
} from "../../prism-container"

describe("Presentation", () => {
    let startedContainer: StartedTestContainer | undefined
    let presentation: PresentationController

    beforeAll(async () => {
        startedContainer = await startPrismContainer(
            "node_modules/presentation-api.yml",
            "/presentation-api.yml",
        )

        presentation = new EdcConnectorClient.Builder().presentationUrl("http://localhost:" + startedContainer.getFirstMappedPort()).build().presentation
    })

    afterAll(async () => {
        await stopPrismContainer(startedContainer)
    })

    it("should query all presentations", async () => {
        const presentations = await presentation.queryAll(
            "1",
            "auth-token",
            {
                "@context": {
                    "@vocab": "https://w3id.org/edc/v0.0.1/ns/"
                },
                "@type": "PresentationQueryMessage",
                "scope": [
                    "org.eclipse.edc.vc.type:SomeCredential_0.3.5:write",
                    "org.eclipse.edc.vc.type:SomeOtherCredential:read",
                    "org.eclipse.edc.vc.type:ThirdCredential:*"
                ]
            },
        )

        expect(presentations).not.toBeNull()

        expect(presentations).toHaveProperty("@context")
        expect(presentations).toHaveProperty("@type")
        expect(presentations).toHaveProperty("presentation")
    })
})
