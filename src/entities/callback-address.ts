export interface CallbackAddress {
  "@type"?: "CallbackAddress";
  uri: string;
  events: string[];
  transactional?: boolean;
  authKey?: string;
  authCodeId?: string;
}

/**
 * Stamps each callback address with its JSON-LD `@type`, which the connector
 * requires to deserialize the `uri`. Returns `undefined` untouched so it is
 * dropped from the request body.
 */
export function withCallbackAddressType(
  callbackAddresses?: CallbackAddress[],
): CallbackAddress[] | undefined {
  return callbackAddresses?.map((callbackAddress) => ({
    "@type": "CallbackAddress",
    ...callbackAddress,
  }));
}
