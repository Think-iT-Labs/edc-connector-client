"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdcClientError = exports.EdcClientErrorType = void 0;
const typed_error_1 = require("@think-it-labs/typed-error");
var EdcClientErrorType;
(function (EdcClientErrorType) {
    EdcClientErrorType["Unknown"] = "Unknown";
    EdcClientErrorType["Duplicate"] = "Duplicate";
    EdcClientErrorType["NotFound"] = "NotFound";
})(EdcClientErrorType = exports.EdcClientErrorType || (exports.EdcClientErrorType = {}));
class EdcClientError extends typed_error_1.TypedError {
}
exports.EdcClientError = EdcClientError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXdEO0FBR3hELElBQVksa0JBSVg7QUFKRCxXQUFZLGtCQUFrQjtJQUM1Qix5Q0FBbUIsQ0FBQTtJQUNuQiw2Q0FBdUIsQ0FBQTtJQUN2QiwyQ0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBSlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFJN0I7QUFFRCxNQUFhLGNBQWUsU0FBUSx3QkFBOEI7Q0FFakU7QUFGRCx3Q0FFQyJ9