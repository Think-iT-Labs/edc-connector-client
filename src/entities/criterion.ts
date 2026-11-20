import { JsonLdNode } from "./jsonld";

export interface CriterionInput {
  "@type": "Criterion";
  operandLeft: string;
  operator: string;
  operandRight?: any;
}

export interface Criterion extends JsonLdNode {
  operandLeft: string;
  operator: string;
  operandRight?: any;
}
