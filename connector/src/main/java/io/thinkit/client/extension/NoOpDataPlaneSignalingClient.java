package io.thinkit.client.extension;

import org.eclipse.edc.connector.controlplane.dataplane.spi.instance.DataPlaneInstance;
import org.eclipse.edc.signaling.domain.DataFlowPrepareMessage;
import org.eclipse.edc.signaling.domain.DataFlowResumeMessage;
import org.eclipse.edc.signaling.domain.DataFlowStartMessage;
import org.eclipse.edc.signaling.domain.DataFlowStartedNotificationMessage;
import org.eclipse.edc.signaling.domain.DataFlowStatusMessage;
import org.eclipse.edc.signaling.domain.DataFlowSuspendMessage;
import org.eclipse.edc.signaling.domain.DataFlowTerminateMessage;
import org.eclipse.edc.signaling.port.DataPlaneSignalingClient;
import org.eclipse.edc.spi.response.StatusResult;

/**
 * A {@link DataPlaneSignalingClient} that short-circuits every signaling call,
 * acknowledging it as successful without contacting an actual data plane. It
 * plays the same role the former {@code NoOpDataFlowControllerExtension} did,
 * but at the signaling-client level, so the genuine EDC
 * {@code DataPlaneSignalingFlowController} (and its V4 registration endpoints)
 * can be used while the connector still runs without a real data plane.
 */
public class NoOpDataPlaneSignalingClient extends DataPlaneSignalingClient {

    public NoOpDataPlaneSignalingClient(DataPlaneInstance dataPlane) {
        super(dataPlane, null, null, null);
    }

    @Override
    public StatusResult<DataFlowStatusMessage> prepare(DataFlowPrepareMessage request) {
        return StatusResult.success(statusMessage("PREPARED"));
    }

    @Override
    public StatusResult<DataFlowStatusMessage> start(DataFlowStartMessage request) {
        return StatusResult.success(statusMessage("STARTED"));
    }

    @Override
    public StatusResult<Void> suspend(String flowId, DataFlowSuspendMessage message) {
        return StatusResult.success();
    }

    @Override
    public StatusResult<DataFlowStatusMessage> resume(String flowId, DataFlowResumeMessage message) {
        return StatusResult.success(statusMessage("STARTED"));
    }

    @Override
    public StatusResult<Void> terminate(String flowId, DataFlowTerminateMessage message) {
        return StatusResult.success();
    }

    @Override
    public StatusResult<Void> started(String flowId, DataFlowStartedNotificationMessage message) {
        return StatusResult.success();
    }

    @Override
    public StatusResult<Void> completed(String flowId) {
        return StatusResult.success();
    }

    private static DataFlowStatusMessage statusMessage(String state) {
        return DataFlowStatusMessage.Builder.newInstance().state(state).build();
    }
}
