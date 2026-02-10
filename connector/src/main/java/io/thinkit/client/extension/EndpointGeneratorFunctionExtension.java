package io.thinkit.client.extension;

import org.eclipse.edc.connector.dataplane.spi.Endpoint;
import org.eclipse.edc.connector.dataplane.spi.iam.PublicEndpointGeneratorService;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

public class EndpointGeneratorFunctionExtension implements ServiceExtension {

    @Inject
    private PublicEndpointGeneratorService publicEndpointGeneratorService;

    @Override
    public void initialize(ServiceExtensionContext context) {
        publicEndpointGeneratorService.addGeneratorFunction("HttpData", dataAddress -> new Endpoint("http://localhost:1111/test", "any"));
    }
}
