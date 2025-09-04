// src/utils/jsonExplorer.js
export function flattenJson(obj, basePath = "") {
  const out = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) {
      out.push({ path, type: "array", sample: node.slice(0, 2) });
      if (node.length > 0) walk(node[0], path ? `${path}[0]` : "[0]");
      return;
    }
    if (node !== null && typeof node === "object") {
      Object.entries(node).forEach(([k, v]) => {
        const next = path ? `${path}.${k}` : k;
        walk(v, next);
      });
      return;
    }
    out.push({ path, type: typeof node, sample: node });
  };
  walk(obj, basePath);
  return out;
}

// safe getter supports dots and [0]
export function getByPath(obj, path) {
  if (path === undefined || path === null || path === "") return obj;
  // convert "[0].a" -> ".0.a" style split
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

export function findFirstArrayPath(obj) {
  const flat = flattenJson(obj);
  const arr = flat.find(f => f.type === "array");
  return arr?.path || "";
}
