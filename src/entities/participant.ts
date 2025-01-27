export interface Participant {
  apiTokenAlias: string;
  createdAt: number;
  did: string;
  lastModified: number;
  participantContextId: string;
  roles: string[];
  state: number;
}

export interface ParticipantInput {
  active: boolean;
  additionalProperties: {
    [key: string]: unknown;
  };
  did: string;
  key: {
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
  };
  participantId: string;
  roles: string[];
  serviceEndpoints: {
    id: string;
    serviceEndpoint: string;
    type: string;
  }[];
}

export interface ParticipantRoleResponse {
  invalidValue: Record<string, unknown>;
  message: string;
  path: string;
  type: string;
}
