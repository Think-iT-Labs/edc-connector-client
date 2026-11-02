package io.thinkit.client.extension;

import org.eclipse.edc.connector.controlplane.dataplane.spi.instance.DataPlaneInstance;
import org.eclipse.edc.connector.controlplane.dataplane.spi.store.DataPlaneInstanceStore;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

/**
 * Seeds a static {@link DataPlaneInstance} into the selector store so that the management data plane
 * endpoints have something to report. The connector relies on {@link NoOpDataFlowControllerExtension}
 * for the actual data flow, so this instance is never contacted; it only needs to exist.
 */
public class SeedDataPlaneExtension implements ServiceExtension {

    @Inject
    private DataPlaneInstanceStore dataPlaneInstanceStore;

    @Override
    public void initialize(ServiceExtensionContext context) {
        var instance = DataPlaneInstance.Builder.newInstance()
                .id("data-plane")
                .url("http://localhost:9192/control/v1/dataflows")
                .allowedSourceType("HttpData")
                .allowedTransferType("HttpData-PULL")
                .build();

        dataPlaneInstanceStore.save(instance);
    }
}
