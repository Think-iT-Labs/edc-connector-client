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
    const url = new URL(`${baseUrl}${innerRequest.path}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5uZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQStFO0FBZ0IvRSxNQUFhLEtBQUs7SUFBbEI7O0lBMEdBLENBQUM7SUF6R0MsS0FBSyxDQUFDLE9BQU8sQ0FBSSxPQUFlLEVBQUUsWUFBMEI7UUFDMUQsWUFBWSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNsRCxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO1FBRTFELE1BQU0sUUFBUSxHQUFHLE1BQU0sdUJBQUEsSUFBSSxzQ0FBTyxNQUFYLElBQUksRUFBUSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFMUQsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtZQUMzQixPQUFPLFNBQXFCLENBQUM7U0FDOUI7UUFFRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FDVixPQUFlLEVBQ2YsWUFBeUI7UUFFekIsTUFBTSxRQUFRLEdBQUcsTUFBTSx1QkFBQSxJQUFJLHNDQUFPLE1BQVgsSUFBSSxFQUFRLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUUxRCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtZQUM3QyxNQUFNLElBQUksK0JBQXVCLENBQy9CLG1DQUEyQixDQUFDLFdBQVcsRUFDdkMseUJBQXlCLENBQzFCLENBQUM7U0FDSDtRQUVELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0E4RUY7QUExR0Qsc0JBMEdDO2lEQTVFQyxLQUFLLHVCQUFRLE9BQWUsRUFBRSxZQUEwQjs7SUFDdEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxP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