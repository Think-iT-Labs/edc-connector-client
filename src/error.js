"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdcConnectorClientError = exports.EdcConnectorClientErrorType = void 0;
const typed_error_1 = require("@think-it-labs/typed-error");
var EdcConnectorClientErrorType;
(function (EdcConnectorClientErrorType) {
    EdcConnectorClientErrorType["Unknown"] = "Unknown";
    EdcConnectorClientErrorType["Duplicate"] = "Duplicate";
    EdcConnectorClientErrorType["NotFound"] = "NotFound";
    EdcConnectorClientErrorType["BadRequest"] = "BadRequest";
    EdcConnectorClientErrorType["Unreachable"] = "Unreachable";
})(EdcConnectorClientErrorType = exports.EdcConnectorClientErrorType || (exports.EdcConnectorClientErrorType = {}));
class EdcConnectorClientError extends typed_error_1.TypedError {
}
exports.EdcConnectorClientError = EdcConnectorClientError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXdEO0FBR3hELElBQVksMkJBTVg7QUFORCxXQUFZLDJCQUEyQjtJQUNyQyxrREFBbUIsQ0FBQTtJQUNuQixzREFBdUIsQ0FBQTtJQUN2QixvREFBcUIsQ0FBQTtJQUNyQix3REFBeUIsQ0FBQTtJQUN6QiwwREFBMkIsQ0FBQTtBQUM3QixDQUFDLEVBTlcsMkJBQTJCLEdBQTNCLG1DQUEyQixLQUEzQixtQ0FBMkIsUUFNdEM7QUFFRCxNQUFhLHVCQUNYLFNBQVEsd0JBQXVDO0NBRWhEO0FBSEQsMERBR0MifQ==