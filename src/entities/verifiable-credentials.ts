import { Action, PolicyInput } from "./policy";

export interface VerifiableCredentialsResource {
  holderId: string;
  id: string;
  issuancePolicy: PolicyInput; // NOTE: should we remove extra fields
  issuerId: string;
  participantContextId: string;
  reissuancePolicy: PolicyInput;
  state: number;
  timeOfLastStatusUpdate: string;
  timestamp: number;
  verifiableCredential: VerifiableCredentialContainer;
}

interface VerifiableCredentialContainer {
  credential: VerifiableCredential;
  format:
  | "JSON_LD"
  | "JWT"
  | "VC1_0_LD"
  | "VC1_0_JWT"
  | "VC2_0_JOSE"
  | "VC2_0_SD_JWT"
  | "VC2_0_COSE";
  rawVc: string;
}

interface VerifiableCredential {
  credentialSchema: CredentialSchema[];
  credentialStatus: CredentialStatus[];
  credentialSubject: CredentialSubject[];
  dataModelVersion: "V_1_1" | "V_2_0";
  description: string;
  expirationDate: string;
  id: string;
  issuanceDate: string;
  issuer: Issuer;
  name: string;
  type: string[];
}

interface CredentialSchema {
  id: string;
  type: string;
}

interface CredentialStatus {
  additionalProperties: { [key: string]: unknown };
  id: string;
  type: string;
}

interface CredentialSubject {
  id: string;
}

interface Issuer {
  id: string;
  additionalProperties: {
    [key: string]: unknown;
  };
}

interface Policy {
  "@type"?: "SET" | "OFFER" | "CONTRACT";
  assignee?: string;
  assigner?: string;
  extensibleProperties?: object;
  inheritsFrom?: string;
  obligations?: {
    action?: {
      includedIn?: string;
      type?: string;
      constraint?: {
        edctype: string;
      };
    };
    constraints?: {
      edctype: string;
    }[];
  }[];
  permissions?: {
    action?: Action;
    constraints?: {
      edctype: string;
    }[];
    duties?: {
      action?: Action;
      constraints?: {
        edctype: string;
      }[];
    }[];
  }[];
  profiles?: string[];
  prohibitions?: {
    action?: Action;
    constraints?: {
      edctype: string;
    }[];
    remedies?: {
      action?: Action;
      constraints?: {
        edctype: string;
      }[];
    }[];
  }[];
  target?: string;
}

export interface VerifiableCredentialManifest {
  id: string;
  issuancePolicy: Policy;
  participantContextId: string;
  reissuancePolicy: Policy;
  verifiableCredentialContainer: VerifiableCredentialContainer;
}

export interface CredentialRequestDto {
  credentials: CredentialDescriptor;
  holderPid: string;
  isserDid: string;
}

interface CredentialDescriptor {
  credentialType: string;
  format: string;
}
