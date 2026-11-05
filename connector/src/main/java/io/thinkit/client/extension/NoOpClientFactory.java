package io.thinkit.client.extension;

import org.eclipse.edc.connector.controlplane.dataplane.spi.instance.DataPlaneInstance;
import org.eclipse.edc.signaling.port.ClientFactory;
import org.eclipse.edc.signaling.port.DataPlaneSignalingClient;

/**
 * Produces {@link NoOpDataPlaneSignalingClient}s instead of the HTTP-based
 * clients the default {@link ClientFactory} would create.
 */
public class NoOpClientFactory extends ClientFactory {

    public NoOpClientFactory() {
        super(null, null, null);
    }

    @Override
    public DataPlaneSignalingClient createClient(DataPlaneInstance instance) {
        return new NoOpDataPlaneSignalingClient(instance);
    }
}
