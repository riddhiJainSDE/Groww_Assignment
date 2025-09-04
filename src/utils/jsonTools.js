// utils/jsonTools.js
export function flattenJson(obj, prefix = "", out = []) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flattenJson(v, `${prefix}[${i}]`, out));
  } else if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach(k =>
      flattenJson(obj[k], prefix ? `${prefix}.${k}` : k, out)
    );
  } else {
    out.push({ path: prefix, type: typeof obj, value: obj });
  }
  return out;
}

export function findFirstArrayPath(obj, prefix = "") {
  if (Array.isArray(obj)) return prefix || "root";
  if (typeof obj === "object" && obj !== null) {
    for (let k of Object.keys(obj)) {
      const res = findFirstArrayPath(obj[k], prefix ? `${prefix}.${k}` : k);
      if (res) return res;
    }
  }
  return null;
}

export function getByPath(obj, path) {
  return path.split(".").reduce((acc, k) => {
    if (!acc) return undefined;
    if (k.includes("[")) {
      const [key, idx] = k.split(/\[|\]/).filter(Boolean);
      return acc[key] ? acc[key][parseInt(idx, 10)] : undefined;
    }
    return acc[k];
  }, obj);
}

export function prettifyPath(path) {
  return path
    .replace(/\.\d+\./g, " → ") // indexes
    .replace(/\./g, " → ")
    .replace(/\[(\d+)\]/g, "[$1]"); // keep array indexes visible
}
