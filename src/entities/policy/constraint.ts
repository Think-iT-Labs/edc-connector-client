export interface Constraint {
}

export interface AtomicConstraint extends Constraint {
  leftOperand: string,
  operator: string,
  rightOperand: string
}

export interface MultiplicityConstraint extends Constraint {
  "@type": string;
  constraint: Constraint[];
}
