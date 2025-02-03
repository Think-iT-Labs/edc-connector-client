export interface KeyPair {
  defaultPair: boolean;
  groupName: string;
  id: string;
  keyContext: string;
  keyId: string;
  participantContextId: string;
  privateKeyAlias: string;
  rotationDuration: number;
  serializedPublicKey: string;
  state: number;
  timestamp: number;
  useDuration: number;
}

export interface KeyDescriptor {
  active: boolean;
  keyGeneratorParams: {
    [key: string]: unknown;
  };
  keyId: string;
  privateKeyAlias: string;
  publicKeyJwk: {
    [key: string]: unknown;
  };
  publicKeyPem: string;
  resourceId: string;
  type: string;
}
