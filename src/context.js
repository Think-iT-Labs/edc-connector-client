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
var _EdcClientContext_apiToken, _EdcClientContext_addresses;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdcClientContext = void 0;
class EdcClientContext {
    constructor(apiToken, addresses) {
        _EdcClientContext_apiToken.set(this, void 0);
        _EdcClientContext_addresses.set(this, void 0);
        __classPrivateFieldSet(this, _EdcClientContext_apiToken, apiToken, "f");
        __classPrivateFieldSet(this, _EdcClientContext_addresses, addresses, "f");
    }
    get default() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").default;
    }
    get validation() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").validation;
    }
    get ids() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").ids;
    }
    get data() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").data;
    }
    get control() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").control;
    }
    get dataplane() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").dataplane;
    }
    get public() {
        return __classPrivateFieldGet(this, _EdcClientContext_addresses, "f").public;
    }
    get apiToken() {
        return __classPrivateFieldGet(this, _EdcClientContext_apiToken, "f");
    }
}
exports.EdcClientContext = EdcClientContext;
_EdcClientContext_apiToken = new WeakMap(), _EdcClientContext_addresses = new WeakMap();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLE1BQWEsZ0JBQWdCO0lBSTNCLFlBQVksUUFBZ0IsRUFBRSxTQUFvQjtRQUhsRCw2Q0FBa0I7UUFDbEIsOENBQXNCO1FBR3BCLHVCQUFBLElBQUksOEJBQWEsUUFBUSxNQUFBLENBQUM7UUFDMUIsdUJBQUEsSUFBSSwrQkFBYyxTQUFTLE1BQUEsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyx1QkFBQSxJQUFJLG1DQUFXLENBQUMsT0FBTyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLHVCQUFBLElBQUksbUNBQVcsQ0FBQyxVQUFVLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQUksR0FBRztRQUNMLE9BQU8sdUJBQUEsSUFBSSxtQ0FBVyxDQUFDLEdBQUcsQ0FBQztJQUM3QixDQUFDO0lBRUQsSUFBSSxJQUFJO1FBQ04sT0FBTyx1QkFBQSxJQUFJLG1DQUFXLENBQUMsSUFBSSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLHVCQUFBLElBQUksbUNBQVcsQ0FBQyxPQUFPLENBQUM7SUFDakMsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE9BQU8sdUJBQUEsSUFBSSxtQ0FBVyxDQUFDLFNBQVMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSSxNQUFNO1FBQ1IsT0FBTyx1QkFBQSxJQUFJLG1DQUFXLENBQUMsTUFBTSxDQUFDO0lBQ2hDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDVixPQUFPLHVCQUFBLElBQUksa0NBQVUsQ0FBQztJQUN4QixDQUFDO0NBQ0Y7QUF4Q0QsNENBd0NDIn0=