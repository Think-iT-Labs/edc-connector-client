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
        this.public = new controllers_1.PublicController(inner);
    }
    createContext(token, addresses) {
        return new context_1.EdcConnectorClientContext(token, addresses);
    }
    static version() {
        return package_json_1.version;
    }
}
exports.EdcConnectorClient = EdcConnectorClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBc0Q7QUFDdEQsK0NBS3VCO0FBRXZCLG1DQUFnQztBQUVoQyxrREFBMEM7QUFFMUMsTUFBYSxrQkFBa0I7SUFNN0I7UUFDRSxNQUFNLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1FBRTFCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSw0QkFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQ0FBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUNBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLDhCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxhQUFhLENBQ1gsS0FBYSxFQUNiLFNBQW9CO1FBRXBCLE9BQU8sSUFBSSxtQ0FBeUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPO1FBQ1osT0FBTyxzQkFBTyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQXpCRCxnREF5QkMifQ==