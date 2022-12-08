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
var _PublicController_inner;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
class PublicController {
    constructor(inner) {
        _PublicController_inner.set(this, void 0);
        __classPrivateFieldSet(this, _PublicController_inner, inner, "f");
    }
    async getTranferedData(context, headers) {
        return __classPrivateFieldGet(this, _PublicController_inner, "f").stream(context.public, {
            path: "/public",
            method: "GET",
            headers,
        });
    }
}
exports.PublicController = PublicController;
_PublicController_inner = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJvbGxlcnMvcHVibGljLWNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBYSxnQkFBZ0I7SUFHM0IsWUFBWSxLQUFZO1FBRnhCLDBDQUFjO1FBR1osdUJBQUEsSUFBSSwyQkFBVSxLQUFLLE1BQUEsQ0FBQztJQUN0QixDQUFDO0lBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUNwQixPQUFrQyxFQUNsQyxPQUEyQztRQUUzQyxPQUFPLHVCQUFBLElBQUksK0JBQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUN4QyxJQUFJLEVBQUUsU0FBUztZQUNmLE1BQU0sRUFBRSxLQUFLO1lBQ2IsT0FBTztTQUNSLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpCRCw0Q0FpQkMifQ==