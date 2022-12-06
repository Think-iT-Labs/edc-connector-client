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
var _ObservabilityController_inner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityController = void 0;
class ObservabilityController {
    constructor(inner) {
        _ObservabilityController_inner.set(this, void 0);
        __classPrivateFieldSet(this, _ObservabilityController_inner, inner, "f");
    }
    async checkHealth(context) {
        return __classPrivateFieldGet(this, _ObservabilityController_inner, "f").request(context.default, {
            path: "/api/check/health",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async checkLiveness(context) {
        return __classPrivateFieldGet(this, _ObservabilityController_inner, "f").request(context.default, {
            path: "/api/check/liveness",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async checkReadiness(context) {
        return __classPrivateFieldGet(this, _ObservabilityController_inner, "f").request(context.default, {
            path: "/api/check/readiness",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
    async checkStartup(context) {
        return __classPrivateFieldGet(this, _ObservabilityController_inner, "f").request(context.default, {
            path: "/api/check/startup",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
}
exports.ObservabilityController = ObservabilityController;
_ObservabilityController_inner = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YWJpbGl0eS1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXJzL29ic2VydmFiaWxpdHktY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFJQSxNQUFhLHVCQUF1QjtJQUdsQyxZQUFZLEtBQVk7UUFGeEIsaURBQWM7UUFHWix1QkFBQSxJQUFJLGtDQUFVLEtBQUssTUFBQSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQWtDO1FBQ2xELE9BQU8sdUJBQUEsSUFBSSxzQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQzFDLElBQUksRUFBRSxtQkFBbUI7WUFDekIsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQ2pCLE9BQWtDO1FBRWxDLE9BQU8sdUJBQUEsSUFBSSxzQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQzFDLElBQUksRUFBRSxxQkFBcUI7WUFDM0IsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQ2xCLE9BQWtDO1FBRWxDLE9BQU8sdUJBQUEsSUFBSSxzQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQzFDLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQ2hCLE9BQWtDO1FBRWxDLE9BQU8sdUJBQUEsSUFBSSxzQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO1lBQzFDLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBNUNELDBEQTRDQyJ9