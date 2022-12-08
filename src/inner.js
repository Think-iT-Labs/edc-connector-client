"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Inner_instances, _Inner_fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inner = void 0;
const error_1 = require("./error");
class Inner {
    constructor() {
        _Inner_instances.add(this);
    }
    async request(baseUrl, innerRequest) {
        innerRequest.headers = innerRequest.headers || {};
        innerRequest.headers["Content-type"] = "application/json";
        const response = await __classPrivateFieldGet(this, _Inner_instances, "m", _Inner_fetch).call(this, baseUrl, innerRequest);
        if (response.status === 204) {
            return undefined;
        }
        return response.json();
    }
    async stream(baseUrl, innerRequest) {
        const response = await __classPrivateFieldGet(this, _Inner_instances, "m", _Inner_fetch).call(this, baseUrl, innerRequest);
        if (response.status === 204 || !response.body) {
            throw new error_1.EdcConnectorClientError(error_1.EdcConnectorClientErrorType.Unreachable, "response is never empty");
        }
        return response;
    }
}
exports.Inner = Inner;
_Inner_instances = new WeakSet(), _Inner_fetch = async function _Inner_fetch(baseUrl, innerRequest) {
    var _a;
    const url = new URL(innerRequest.path, baseUrl);
    if (innerRequest.query) {
        Object.entries(innerRequest.query).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }
    const method = innerRequest.method;
    const request = new Request(url, {
        method,
        headers: Object.assign(Object.assign({}, innerRequest.headers), { "X-Api-Key": (_a = innerRequest.apiToken) !== null && _a !== void 0 ? _a : "" }),
        body: innerRequest.body ? JSON.stringify(innerRequest.body) : undefined,
    });
    try {
        const response = await fetch(request);
        if (response.ok) {
            return response;
        }
        switch (response.status) {
            case 400: {
                const error = new error_1.EdcConnectorClientError(error_1.EdcConnectorClientErrorType.BadRequest, "request was malformed");
                error.body = await response.json();
                throw error;
            }
            case 404: {
                const error = new error_1.EdcConnectorClientError(error_1.EdcConnectorClientErrorType.NotFound, "resource not found");
                error.body = await response.json();
                throw error;
            }
            case 409: {
                const error = new error_1.EdcConnectorClientError(error_1.EdcConnectorClientErrorType.Duplicate, "duplicated resource");
                error.body = await response.json();
                throw error;
            }
            default: {
                throw new error_1.EdcConnectorClientError(error_1.EdcConnectorClientErrorType.Unknown, await response.text());
            }
        }
    }
    catch (error) {
        if (!(error instanceof error_1.EdcConnectorClientError)) {
            error = new error_1.EdcConnectorClientError(error_1.EdcConnectorClientErrorType.Unknown, "something went wrong", { cause: error });
        }
        throw error;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5uZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQStFO0FBZ0IvRSxNQUFhLEtBQUs7SUFBbEI7O0lBMEdBLENBQUM7SUF6R0MsS0FBSyxDQUFDLE9BQU8sQ0FBSSxPQUFlLEVBQUUsWUFBMEI7UUFDMUQsWUFBWSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNsRCxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO1FBRTFELE1BQU0sUUFBUSxHQUFHLE1BQU0sdUJBQUEsSUFBSSxzQ0FBTyxNQUFYLElBQUksRUFBUSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFMUQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUMzQixPQUFPLFNBQXFCLENBQUM7U0FDOUI7UUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FDVixPQUFlLEVBQ2YsWUFBeUI7UUFFekIsTUFBTSxRQUFRLEdBQUcsTUFBTSx1QkFBQSxJQUFJLHNDQUFPLE1BQVgsSUFBSSxFQUFRLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUxRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtZQUM3QyxNQUFNLElBQUksK0JBQXVCLENBQy9CLG1DQUEyQixDQUFDLFdBQVcsRUFDdkMseUJBQXlCLENBQzFCLENBQUM7U0FDSDtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0E4RUY7QUExR0Qsc0JBMEdDO2lEQTVFQyxLQUFLLHVCQUFRLE9BQWUsRUFBRSxZQUEwQjs7SUFDdEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxD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