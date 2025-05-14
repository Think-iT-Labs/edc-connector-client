export type PresentationQueryMessage = {
  "@context": {}
  "@type": string
  presentationDefinition?: { [key: string]: unknown } | null
  scope?: string[]
}

export type PresentationResponseMessage = {
  "@context": { [key: string]: unknown },
  presentation: Array<string | {
    empty: boolean;
    valueType: "ARRAY" | "OBJECT" | "STRING" | "NUMBER" | "TRUE" | "FALSE" | "NULL",
    [key: string]: unknown
  }>
}

