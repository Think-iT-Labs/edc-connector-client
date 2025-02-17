export interface DIDDocument {
  "@context": {
    [key: string]: unknown;
  }[];

  authentication: string[];
  id: string;
  service: {
    id: string;
    serviceEndpoint: string;
    type: string;
  }[];
  verificationMethod: {
    controller: string;
    id: string;
    publicKeyJwk: {
      [key: string]: unknown;
    };
    publicKeyMultibase: string;
    type: string;
  }[];
}

export interface DIDService {
  id: string;
  serviceEndpoint: string;
  type: string;
}
