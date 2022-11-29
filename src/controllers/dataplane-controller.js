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
var _DataplaneController_inner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataplaneController = void 0;
class DataplaneController {
    constructor(inner) {
        _DataplaneController_inner.set(this, void 0);
        __classPrivateFieldSet(this, _DataplaneController_inner, inner, "f");
    }
    async registerDataplane(context, input) {
        return __classPrivateFieldGet(this, _DataplaneController_inner, "f").request(context.dataplane, {
            path: "/dataplane/instances",
            method: "POST",
            apiToken: context.apiToken,
            body: input,
        });
    }
    async listDataplanes(context) {
        return __classPrivateFieldGet(this, _DataplaneController_inner, "f").request(context.dataplane, {
            path: "/dataplane/instances",
            method: "GET",
            apiToken: context.apiToken,
        });
    }
}
exports.DataplaneController = DataplaneController;
_DataplaneController_inner = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXBsYW5lLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJvbGxlcnMvZGF0YXBsYW5lLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsTUFBYSxtQkFBbUI7SUFHOUIsWUFBWSxLQUFZO1FBRnhCLDZDQUFjO1FBR1osdUJBQUEsSUFBSSw4QkFBVSxLQUFLLE1BQUEsQ0FBQztJQUN0QixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUNyQixPQUF5QixFQUN6QixLQUFxQjtRQUVyQixPQUFPLHVCQUFBLElBQUksa0NBQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUM1QyxJQUFJLEVBQUUsc0JBQXNCO1lBQzVCLE1BQU0sRUFBRSxNQUFNO1lBQ2QsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQ2xCLE9BQXlCO1FBRXpCLE9BQU8sdUJBQUEsSUFBSSxrQ0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQzVDLElBQUksRUFBRSxzQkFBc0I7WUFDNUIsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7U0FDM0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBNUJELGtEQTRCQyJ9