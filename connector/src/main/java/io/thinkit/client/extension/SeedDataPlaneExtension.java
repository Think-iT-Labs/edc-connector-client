package io.thinkit.client.extension;

import org.eclipse.edc.connector.controlplane.dataplane.spi.DataPlaneSelectorService;
import org.eclipse.edc.connector.controlplane.dataplane.spi.instance.DataPlaneInstance;
import org.eclipse.edc.participantcontext.single.spi.SingleParticipantContextSupplier;
import org.eclipse.edc.runtime.metamodel.annotation.Inject;
import org.eclipse.edc.spi.EdcException;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.eclipse.edc.spi.system.ServiceExtensionContext;

/**
 * Seeds a static {@link DataPlaneInstance} into the selector so that the management data plane
 * endpoints have something to report and transfers can select a data plane. The connector relies
 * on {@link NoOpDataPlaneClientExtension} to short-circuit the data flow, so this instance is never
 * actually contacted; it only needs to exist and carry the participant context used by selection.
 */
public class SeedDataPlaneExtension implements ServiceExtension {

    @Inject
    private DataPlaneSelectorService dataPlaneSelectorService;

    @Inject
    private SingleParticipantContextSupplier participantContextSupplier;

    @Override
    public void initialize(ServiceExtensionContext context) {
        var participantContext = participantContextSupplier.get()
                .orElseThrow(f -> new EdcException("Cannot load participant context: " + f.getFailureDetail()));

        var instance = DataPlaneInstance.Builder.newInstance()
                .id("data-plane")
                .url("http://localhost:9192/control/v1/dataflows")
                .participantContextId(participantContext.getParticipantContextId())
                .allowedSourceType("HttpData")
                .allowedTransferType("HttpData-PULL")
                .build();

        dataPlaneSelectorService.register(instance)
                .orElseThrow(f -> new EdcException("Cannot seed data plane instance: " + f.getFailureDetail()));
    }
}
