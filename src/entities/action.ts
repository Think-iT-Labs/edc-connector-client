import { Constraint } from "./constraint";

export interface Action {
  constraint?: Constraint;
  includedIn?: string;
  type?: string;
}
