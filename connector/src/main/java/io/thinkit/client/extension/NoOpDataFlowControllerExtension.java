package io.thinkit.client.extension;

import org.eclipse.edc.connector.controlplane.asset.spi.domain.Asset;
import org.eclipse.edc.connector.controlplane.transfer.spi.flow.DataFlowController;
import org.eclipse.edc.connector.controlplane.transfer.spi.types.DataFlowResponse;
import org.eclipse.edc.connector.controlplane.transfer.spi.types.TransferProcess;
import org.eclipse.edc.policy.model.Policy;
import org.eclipse.edc.runtime.metamodel.annotation.Provider;
import org.eclipse.edc.spi.response.StatusResult;
import org.eclipse.edc.spi.system.ServiceExtension;
import org.jetbrains.annotations.NotNull;

import java.util.Set;

public class NoOpDataFlowControllerExtension implements ServiceExtension {

    @Provider
    public DataFlowController noOpDataFlowController() {
        return new NoOpDataFlowController();
    }

    public class NoOpDataFlowController implements DataFlowController {
        @Override
        public boolean canHandle(TransferProcess transferProcess) {
            return true;
        }

        @Override
        public StatusResult<DataFlowResponse> prepare(TransferProcess transferProcess, Policy policy) {
            return StatusResult.success(DataFlowResponse.Builder.newInstance().build());
        }

        @Override
        public @NotNull StatusResult<DataFlowResponse> start(TransferProcess transferProcess, Policy policy) {
            return StatusResult.success(DataFlowResponse.Builder.newInstance().build());
        }

        @Override
        public StatusResult<Void> suspend(TransferProcess transferProcess) {
            return StatusResult.success();
        }

        @Override
        public StatusResult<DataFlowResponse> resume(TransferProcess transferProcess) {
            return StatusResult.success(DataFlowResponse.Builder.newInstance().build());
        }

        @Override
        public StatusResult<Void> terminate(TransferProcess transferProcess) {
            return StatusResult.success();
        }

        @Override
        public StatusResult<Void> started(TransferProcess transferProcess) {
            return StatusResult.success();
        }

        @Override
        public StatusResult<Void> completed(TransferProcess transferProcess) {
            return StatusResult.success();
        }

        @Override
        public Set<String> transferTypesFor(Asset asset) {
            return Set.of("HttpData-PULL");
        }

        @Override
        public Set<String> transferTypesFor(String assetId) {
            return Set.of("HttpData-PULL");
        }
    }
}
