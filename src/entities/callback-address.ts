export interface CallbackAddress {
  "@type"?: "CallbackAddress";
  uri: string;
  events: string[];
  transactional?: boolean;
  authKey?: string;
  authCodeId?: string;
}
