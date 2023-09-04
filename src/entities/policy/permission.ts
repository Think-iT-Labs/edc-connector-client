import { Action } from "./action";
import { Constraint } from "./constraint";
import { Duty } from "./duty";

export interface Permission {
  assignee?: string;
  assigner?: string;
  duties?: Duty[];
  target?: string;
  uid?: string;
  constraint?: Constraint[];
  action: Action | string;
}
