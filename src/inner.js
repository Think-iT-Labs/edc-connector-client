"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inner = void 0;
const error_1 = require("./error");
class Inner {
    async request(baseUrl, innerRequest) {
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
            headers: {
                "X-Api-Key": (_a = innerRequest.apiToken) !== null && _a !== void 0 ? _a : "",
                "Content-Type": "application/json",
            },
            body: innerRequest.body ? JSON.stringify(innerRequest.body) : undefined,
        });
        try {
            const response = await fetch(request);
            if (response.ok) {
                if (response.status === 204) {
                    return undefined;
                }
                return response.json();
            }
            switch (response.status) {
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
    }
}
exports.Inner = Inner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5uZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5uZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQStFO0FBVS9FLE1BQWEsS0FBSztJQUNoQixLQUFLLENBQUMsT0FBTyxDQUFJLE9BQWUsRUFBRSxZQUEwQjs7UUFDMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVoRCxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUU7WUFDdEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtnQkFDMUQsR0FBRyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxNQUFNLE1BQU0sR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO1FBQ25DLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtZQUMvQixNQUFNO1lBQ04sT0FBTyxFQUFFO2dCQUNQLFdBQVcsRUFBRSxNQUFBLFlBQVksQ0FBQyxRQUFRLG1DQUFJLEVBQUU7Z0JBQ3hDLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7WUFDRCxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDeEUsQ0FBQyxDQUFDO1FBRUgsSUFBSTtZQUNGLE1BQU0sUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXRDLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRTtnQkFDZixJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO29CQUMzQixPQUFPLFNBQXFCLENBQUM7aUJBQzlCO2dCQUVELE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3hCO1lBRUQsUUFBUSxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUN2QixLQUFLLEdBQUcsQ0FBQyxDQUFDO29CQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksK0JBQXVCLENBQ3ZDLG1DQUEyQixDQUFDLFFBQVEsRUFDcEMsb0JBQW9CLENBQ3JCLENBQUM7b0JBRUYsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFFbkMsTUFBTSxLQUFLLENBQUM7aUJBQ2I7Z0JBQ0QsS0FBSyxHQUFHLENBQUMsQ0FBQztvQkFDUixNQUFNLEtBQUssR0FBRyxJQUFJLCtCQUF1QixDQUN2QyxtQ0FBMkIsQ0FBQyxTQUFTLEVBQ3JDLHFCQUFxQixDQUN0QixDQUFDO29CQUVGLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBRW5DLE1BQU0sS0FBSyxDQUFDO2lCQUNiO2dCQUNELE9BQU8sQ0FBQyxDQUFDO29CQUNQLE1BQU0sSUFBSSwrQkFBdUIsQ0FDL0IsbUNBQTJCLENBQUMsT0FBTyxFQUNuQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FDdEIsQ0FBQztpQkFDSDthQUNGO1NBQ0Y7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSwrQkFBdUIsQ0FBQyxFQUFFO2dCQUMvQyxLQUFLLEdBQUcsSUFBSSwrQkFBdUIsQ0FDakMsbUNBQTJCLENBQUMsT0FBTyxFQUNuQyxzQkFBc0IsRUFDdEIsRUFBRSxLQUFLLEVBQUUsS0FBYyxFQUFFLENBQzFCLENBQUM7YUFDSDtZQUVELE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0NBQ0Y7QUF2RUQsc0JBdUVDIn0=