"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ManagementController_inner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementController = void 0;
class ManagementController {
    constructor(inner) {
        _ManagementController_inner.set(this, void 0);
        __classPrivateFieldSet(this, _ManagementController_inner, inner, "f");
    }
    async registerDataplane(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/instances",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async listDataplanes(context) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/instances",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async createAsset(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/assets",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async deleteAsset(context, assetId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/assets/${assetId}`,
            method: "DELETE",
            apiToken: context.apiToken,
        });
    }
    async getAsset(context, assetId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/assets/${assetId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async listAssets(context) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/assets",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async createPolicy(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/policydefinitions",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async deletePolicy(context, policyId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/policydefinitions/${policyId}`,
            method: "DELETE",
            apiToken: context.apiToken,
        });
    }
    async getPolicy(context, policyId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/policydefinitions/${policyId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async queryAllPolicies(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/policydefinitions/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async createContractDefinition(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/contractdefinitions",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async deleteContractDefinition(context, contractDefinitionId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractdefinitions/${contractDefinitionId}`,
            method: "DELETE",
            apiToken: context.apiToken,
        });
    }
    async getContractDefinition(context, contractDefinitionId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractdefinitions/${contractDefinitionId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async queryAllContractDefinitions(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/contractdefinitions/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async requestCatalog(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/catalog/request",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async initiateContractNegotiation(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/contractnegotiations",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async queryNegotiations(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/contractnegotiations/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async getNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractnegotiations/${negotiationId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async getNegotiationState(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractnegotiations/${negotiationId}/state`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async cancelNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractnegotiations/${negotiationId}/cancel`,
            method: "POST",
            apiToken: context.apiToken,
        });
    }
    async declineNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractnegotiations/${negotiationId}/decline`,
            method: "POST",
            apiToken: context.apiToken,
        });
    }
    async getAgreementForNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractnegotiations/${negotiationId}/agreement`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async queryAllAgreements(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/contractagreements/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async getAgreement(context, agreementId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/api/v1/data/contractagreements/${agreementId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async initiateTransfer(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/transferprocess",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async queryAllTransferProcesses(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/api/v1/data/transferprocess/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
}
exports.ManagementController = ManagementController;
_ManagementController_inner = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlbWVudC1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJzL21hbmFnZW1lbnQtY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsTUFBYSxvQkFBb0I7SUFHL0IsWUFBWSxLQUFZO1FBRnhCLDhDQUFjO1FBR1osdUJBQUEsSUFBSSwrQkFBVSxLQUFLLE1BQUEsQ0FBQztJQUN0QixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUNyQixPQUFrQyxFQUNsQyxLQUFxQjtRQUVyQixPQUFPLHVCQUFBLElBQUksbUNBQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUN2QyxJQUFJLEVBQUUsd0JBQXdCO1lBQzlCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQ2xCLE9BQWtDO1FBRWxDLE9BQU8sdUJBQUEsSUFBSSxtQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ3ZDLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQ2YsT0FBa0MsRUFDbEMsS0FBaUI7UUFFakIsT0FBTyx1QkFBQSxJQUFJLG1DQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7WUFDdkMsSUFBSSxFQUFFLHFCQUFxQjtZQUMzQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtZQUMxQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQztJ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