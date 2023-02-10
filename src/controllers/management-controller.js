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
            path: "/instances",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async listDataplanes(context) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/instances",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async createAsset(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/assets",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async deleteAsset(context, assetId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/assets/${assetId}`,
            method: "DELETE",
            apiToken: context.apiToken,
        });
    }
    async getAsset(context, assetId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/assets/${assetId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async listAssets(context) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/assets",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async createPolicy(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/policydefinitions",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async deletePolicy(context, policyId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/policydefinitions/${policyId}`,
            method: "DELETE",
            apiToken: context.apiToken,
        });
    }
    async getPolicy(context, policyId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/policydefinitions/${policyId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async queryAllPolicies(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/policydefinitions/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async createContractDefinition(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/contractdefinitions",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async deleteContractDefinition(context, contractDefinitionId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractdefinitions/${contractDefinitionId}`,
            method: "DELETE",
            apiToken: context.apiToken,
        });
    }
    async getContractDefinition(context, contractDefinitionId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractdefinitions/${contractDefinitionId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async queryAllContractDefinitions(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/contractdefinitions/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async requestCatalog(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/catalog/request",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async initiateContractNegotiation(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/contractnegotiations",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async queryNegotiations(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/contractnegotiations/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async getNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractnegotiations/${negotiationId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async getNegotiationState(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractnegotiations/${negotiationId}/state`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async cancelNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractnegotiations/${negotiationId}/cancel`,
            method: "POST",
            apiToken: context.apiToken,
        });
    }
    async declineNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractnegotiations/${negotiationId}/decline`,
            method: "POST",
            apiToken: context.apiToken,
        });
    }
    async getAgreementForNegotiation(context, negotiationId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractnegotiations/${negotiationId}/agreement`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async queryAllAgreements(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/contractagreements/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
    async getAgreement(context, agreementId) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: `/contractagreements/${agreementId}`,
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async initiateTransfer(context, input) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/transferprocess",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async queryAllTransferProcesses(context, query = {}) {
        return __classPrivateFieldGet(this, _ManagementController_inner, "f").request(context.data, {
            path: "/transferprocess/request",
            method: "POST",
            apiToken: context.apiToken,
            body: query,
        });
    }
}
exports.ManagementController = ManagementController;
_ManagementController_inner = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlbWVudC1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJzL21hbmFnZW1lbnQtY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUF1QkEsTUFBYSxvQkFBb0I7SUFHL0IsWUFBWSxLQUFZO1FBRnhCLDhDQUFjO1FBR1osdUJBQUEsSUFBSSwrQkFBVSxLQUFLLE1BQUEsQ0FBQztJQUN0QixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUNyQixPQUFrQyxFQUNsQyxLQUFxQjtRQUVyQixPQUFPLHVCQUFBLElBQUksbUNBQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUN2QyxJQUFJLEVBQUUsWUFBWTtZQUNsQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtZQUMxQixJQUFJLEVBQUUsS0FBSztTQUNaLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUNsQixPQUFrQztRQUVsQyxPQUFPLHVCQUFBLElBQUksbUNBQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUN2QyxJQUFJLEVBQUUsWUFBWTtZQUNsQixNQUFNLEVBQUUsS0FBSztZQUNiLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtTQUMzQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FDZixPQUFrQyxFQUNsQyxLQUFpQjtRQUVqQixPQUFPLHVCQUFBLElBQUksbUNBQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUN2QyxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxNQUFNO1lBQ2QsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FB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