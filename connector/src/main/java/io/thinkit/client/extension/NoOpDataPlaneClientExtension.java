package io.thinkit.client.extension;

import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.runtime.metamodel.annotation.Provides;
import org.eclipse.edc.signaling.port.ClientFactory;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

/**
 * Overrides the data-plane-signaling {@link ClientFactory} with a no-op one, so
 * the real {@code DataPlaneSignalingFlowController} never performs actual data
 * plane HTTP calls. Injecting the default {@link ClientFactory} forces it to be
 * created first, allowing this override to take its place.
 */
@Provides(ClientFactory.class)
public class NoOpDataPlaneClientExtension implements ServiceExtension {

    @Inject
    private ClientFactory clientFactory; // forces the default factory to be injected so it can be overridden

    @Override
    public String name() {
        return "No-op Data Plane Signaling Client (test connector)";
    }

    @Override
    public void initialize(ServiceExtensionContext context) {
        context.registerService(ClientFactory.class, new NoOpClientFactory());
    }
}
