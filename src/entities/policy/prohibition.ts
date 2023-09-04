import { Action } from "./action";
import { Constraint } from "./constraint";

export interface Prohibition {
  assignee?: string;
  assigner?: string;
  target?: string;
  uid?: string;
  constraint?: Constraint[];
  action?: Action | string;
}
