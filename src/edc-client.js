"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdcClient = void 0;
const context_1 = require("./context");
const controllers_1 = require("./controllers");
const inner_1 = require("./inner");
const package_json_1 = require("../package.json");
class EdcClient {
    constructor() {
        const inner = new inner_1.Inner();
        this.data = new controllers_1.DataController(inner);
        this.dataplane = new controllers_1.DataplaneController(inner);
        this.observability = new controllers_1.ObservabilityController(inner);
    }
    createContext(token, addresses) {
        return new context_1.EdcClientContext(token, addresses);
    }
    static version() {
        return package_json_1.version;
    }
}
exports.EdcClient = EdcClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRjLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lZGMtY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUE2QztBQUM3QywrQ0FJdUI7QUFFdkIsbUNBQWdDO0FBRWhDLGtEQUEwQztBQUUxQyxNQUFhLFNBQVM7SUFLcEI7UUFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1FBRTFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSw0QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQ0FBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUNBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELGFBQWEsQ0FBQyxLQUFhLEVBQUUsU0FBb0I7UUFDL0MsT0FBTyxJQUFJLDBCQUFnQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPLHNCQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBcEJELDhCQW9CQyJ9