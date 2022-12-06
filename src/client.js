"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdcConnectorClient = void 0;
const context_1 = require("./context");
const controllers_1 = require("./controllers");
const inner_1 = require("./inner");
const package_json_1 = require("../package.json");
class EdcConnectorClient {
    constructor() {
        const inner = new inner_1.Inner();
        this.data = new controllers_1.DataController(inner);
        this.dataplane = new controllers_1.DataplaneController(inner);
        this.observability = new controllers_1.ObservabilityController(inner);
    }
    createContext(token, addresses) {
        return new context_1.EdcConnectorClientContext(token, addresses);
    }
    static version() {
        return package_json_1.version;
    }
}
exports.EdcConnectorClient = EdcConnectorClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBc0Q7QUFDdEQsK0NBSXVCO0FBRXZCLG1DQUFnQztBQUVoQyxrREFBMEM7QUFFMUMsTUFBYSxrQkFBa0I7SUFLN0I7UUFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1FBRTFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSw0QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQ0FBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUNBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELGFBQWEsQ0FDWCxLQUFhLEVBQ2IsU0FBb0I7UUFFcEIsT0FBTyxJQUFJLG1DQUF5QixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU87UUFDWixPQUFPLHNCQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGO0FBdkJELGdEQXVCQyJ9