/*
 * Accessors kept for compatibility with the entity classes of 0.11.x, which
 * exposed some properties under a name that differs from their compacted term
 * (e.g. `id` for `@id`, `datasets` for `dataset`).
 *
 * They are defined as non-enumerable getters, so the objects stay plain:
 * they are not serialized by `JSON.stringify`, nor copied by spread or
 * `Object.assign`, so they are never sent back to the connector.
 */

const POLICY_TYPES = ["Set", "Offer", "Agreement", "Policy"];
const CATALOG_TYPES = ["Catalog"];
const DATASET_TYPES = ["Dataset"];

const POLICY_RULES = {
  permissions: "permission",
  prohibitions: "prohibition",
  obligations: "obligation",
} as const;

type Node = Record<string, unknown>;

/**
 * Defines the legacy accessors on every node of a compacted response body.
 * The body is modified in place and returned.
 */
export function withLegacyAccessors<T>(body: T): T {
  if (Array.isArray(body)) {
    body.forEach((element) => withLegacyAccessors(element));
  } else if (isNode(body)) {
    Object.values(body).forEach((value) => withLegacyAccessors(value));
    defineNodeAccessors(body);
  }

  return body;
}

/**
 * Defines the legacy `permissions`, `prohibitions` and `obligations` accessors
 * on a policy.
 */
export function definePolicyAccessors<T extends object>(policy: T): T {
  const node = policy as Node;
  for (const [accessor, term] of Object.entries(POLICY_RULES)) {
    defineGetter(node, accessor, () => toArray(node[term]));
  }
  return policy;
}

function defineNodeAccessors(node: Node) {
  if (typeof node["@id"] === "string") {
    defineGetter(node, "id", () => node["@id"]);
  }

  const types = toArray(node["@type"]).map(localName);

  if (hasAnyType(types, CATALOG_TYPES)) {
    defineGetter(node, "datasets", () => toArray(node.dataset));
  }

  if (hasAnyType(types, DATASET_TYPES)) {
    defineGetter(node, "offers", () => toArray(node.hasPolicy));
  }

  if (
    hasAnyType(types, POLICY_TYPES) ||
    Object.values(POLICY_RULES).some((term) => term in node)
  ) {
    definePolicyAccessors(node);
  }
}

function defineGetter(node: Node, name: string, get: () => unknown) {
  // never shadow a property the connector actually returned
  if (Object.prototype.hasOwnProperty.call(node, name)) {
    return;
  }

  Object.defineProperty(node, name, {
    get,
    enumerable: false,
    configurable: true,
  });
}

function isNode(value: unknown): value is Node {
  return value !== null && typeof value === "object";
}

function toArray(value: unknown): unknown[] {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function localName(type: unknown): unknown {
  return typeof type === "string" ? type.replace(/^.*[:/#]/, "") : type;
}

function hasAnyType(types: unknown[], candidates: string[]): boolean {
  return types.some((type) => candidates.includes(type as string));
}
