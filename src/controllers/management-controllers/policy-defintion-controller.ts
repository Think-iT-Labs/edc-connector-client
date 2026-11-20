import { DEFAULT_QUERY_SPEC } from "../../constants";
import { EdcConnectorClientContext } from "../../context";
import {
  IdResponse,
  PolicyDefinition,
  PolicyDefinitionInput,
  PolicyEvaluationPlan,
  PolicyValidationResult,
  QuerySpec,
} from "../../entities";
import { Inner } from "../../inner";
import { ManagementBaseController } from "./management-base-controller";

export class PolicyDefinitionController extends ManagementBaseController {
  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super("policydefinitions", inner, context);
  }

  async create(
    input: PolicyDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<IdResponse> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<IdResponse>(actualContext.management, {
      path: this.management.getBasePath(actualContext),
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        ...input,
        "@context": this.management.getContextUrl(actualContext),
      },
    });
  }

  async update(
    policyId: string,
    input: PolicyDefinitionInput,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${policyId}`,
      method: "PUT",
      authorization: actualContext.authorization,
      body: {
        ...input,
        "@context": this.management.getContextUrl(actualContext),
      },
    });
  }

  async delete(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<void> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${policyId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }

  async get(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<PolicyDefinition>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${policyId}`,
      method: "GET",
      authorization: actualContext.authorization,
    });
  }

  async queryAll(
    query: QuerySpec = DEFAULT_QUERY_SPEC,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyDefinition[]> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<PolicyDefinition[]>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/request`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        ...query,
        "@context": this.management.getContextUrl(actualContext),
      },
    });
  }

  async validate(
    policyId: string,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyValidationResult> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<PolicyValidationResult>(
      actualContext.management,
      {
        path: `${this.management.getBasePath(actualContext)}/${policyId}/validate`,
        method: "POST",
        authorization: actualContext.authorization,
      },
    );
  }

  async evaluationPlan(
    policyId: string,
    policyScope: string,
    context?: EdcConnectorClientContext,
  ): Promise<PolicyEvaluationPlan> {
    const actualContext = this.management.getActualContext(context);

    return this.fetch<PolicyEvaluationPlan>(actualContext.management, {
      path: `${this.management.getBasePath(actualContext)}/${policyId}/evaluationplan`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": this.management.getContextUrl(actualContext),
        "@type": "PolicyEvaluationPlanRequest",
        policyScope,
      },
    });
  }
}
