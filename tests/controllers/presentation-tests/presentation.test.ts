import { GenericContainer, StartedTestContainer } from "testcontainers"
import { EdcConnectorClient } from "../../../src"
import { PresentationController } from "../../../src/controllers/presentation-controller"

describe("Presentation", () => {
    let startedContainer: StartedTestContainer
    let presentation: PresentationController

    beforeAll(async () => {
        startedContainer = await new GenericContainer("stoplight/prism:5.8.1")
            .withCopyFilesToContainer([
                {
                    source: "node_modules/presentation-api.yml",
                    target: "/presentation-api.yml",
                },
            ]).withCommand(["mock", "-h", "0.0.0.0", "/presentation-api.yml"])
            .withExposedPorts(4010)
            .start()

        presentation = new EdcConnectorClient.Builder().presentationUrl("http://localhost:" + startedContainer.getFirstMappedPort()).build().presentation
    })

    afterAll(async () => {
        await startedContainer.stop()
    })

    it("should query all presentations", async () => {
        const presentations = await presentation.queryAll(
            "1",
            "auth-token",
            {
                "@context": [
                    "https://w3id.org/tractusx-trust/v0.8",
                    "https://identity.foundation/presentation-exchange/submission/v1"
                ],
                "@type": "PresentationQueryMessage",
                "presentationDefinition": null,
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
