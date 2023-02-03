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
var _EdcConnectorClientContext_apiToken, _EdcConnectorClientContext_addresses;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdcConnectorClientContext = void 0;
class EdcConnectorClientContext {
    constructor(apiToken, addresses) {
        _EdcConnectorClientContext_apiToken.set(this, void 0);
        _EdcConnectorClientContext_addresses.set(this, void 0);
        __classPrivateFieldSet(this, _EdcConnectorClientContext_apiToken, apiToken, "f");
        __classPrivateFieldSet(this, _EdcConnectorClientContext_addresses, addresses, "f");
    }
    get default() {
        return __classPrivateFieldGet(this, _EdcConnectorClientContext_addresses, "f").default;
    }
    get ids() {
        return __classPrivateFieldGet(this, _EdcConnectorClientContext_addresses, "f").ids;
    }
    get data() {
        return __classPrivateFieldGet(this, _EdcConnectorClientContext_addresses, "f").data;
    }
    get control() {
        return __classPrivateFieldGet(this, _EdcConnectorClientContext_addresses, "f").control;
    }
    get public() {
        return __classPrivateFieldGet(this, _EdcConnectorClientContext_addresses, "f").public;
    }
    get apiToken() {
        return __classPrivateFieldGet(this, _EdcConnectorClientContext_apiToken, "f");
    }
}
exports.EdcConnectorClientContext = EdcConnectorClientContext;
_EdcConnectorClientContext_apiToken = new WeakMap(), _EdcConnectorClientContext_addresses = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQWEseUJBQXlCO0lBSXBDLFlBQVksUUFBZ0IsRUFBRSxTQUFvQjtRQUhsRCxzREFBa0I7UUFDbEIsdURBQXNCO1FBR3BCLHVCQUFBLElBQUksdUNBQWEsUUFBUSxNQUFBLENBQUM7UUFDMUIsdUJBQUEsSUFBSSx3Q0FBYyxTQUFTLE1BQUEsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyx1QkFBQSxJQUFJLDRDQUFXLENBQUMsT0FBTyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFDTCxPQUFPLHVCQUFBLElBQUksNENBQVcsQ0FBQyxHQUFHLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUksSUFBSTtRQUNOLE9BQU8sdUJBQUEsSUFBSSw0Q0FBVyxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyx1QkFBQSxJQUFJLDRDQUFXLENBQUMsT0FBTyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLHVCQUFBLElBQUksNENBQVcsQ0FBQyxNQUFNLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNWLE9BQU8sdUJBQUEsSUFBSSwyQ0FBVSxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQWhDRCw4REFnQ0MifQ==