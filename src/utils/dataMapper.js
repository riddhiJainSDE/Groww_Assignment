// src/utils/dataMapper.js
export const normalizeData = (json) => {
  if (!json) return { rows: [], labels: [], values: [], raw: json };

  // ------------------------------
  // 1. Finnhub simple quote { c: 123.45, o, h, l, v }
  // ------------------------------
  if (json?.c && typeof json.c === "number") {
    return {
      rows: [json], // keep original keys like c, o, h, l
      labels: ["Now"],
      values: [json.c],
      raw: json
    };
  }

  // ------------------------------
  // 2. Finnhub candles { t: [...], c: [...], o, h, l, v }
  // ------------------------------
// inside normalizeData in dataMapper.js
if (json?.c && typeof json.c === "number") {
  return {
    rows: [
      {
        "Current Price": json.c,
        "Change": json.d,
        "Percent Change": json.dp,
        "Day High": json.h,
        "Day Low": json.l,
        "Day Open": json.o,
        "Previous Close": json.pc,
        "Timestamp": json.t,
      }
    ],
    labels: ["Current Price"],
    values: [json.c],
  };
}


  // ------------------------------
  // 3. Alpha Vantage "Global Quote"
  // ------------------------------
  if (json["Global Quote"]) {
    const row = Object.fromEntries(
      Object.entries(json["Global Quote"]).map(([k, v]) => [k.replace(/^\d+\. /, ""), v])
    );
    return {
      rows: [row], // expose all fields (symbol, open, high, low, price, etc)
      labels: ["price"],
      values: [parseFloat(row["price"]) || 0],
      raw: json
    };
  }

  // ------------------------------
  // 4. Alpha Vantage Time Series (Daily / Weekly / Monthly)
  // ------------------------------
  const tsKey = Object.keys(json).find((k) =>
    k.toLowerCase().includes("time series")
  );
  if (tsKey && json[tsKey]) {
    const entries = Object.entries(json[tsKey]);
    const rows = entries.map(([date, vals]) => ({
      date,
      open: parseFloat(vals["1. open"]),
      high: parseFloat(vals["2. high"]),
      low: parseFloat(vals["3. low"]),
      close: parseFloat(vals["4. close"]),
      volume: parseInt(vals["5. volume"], 10),
    }));
    return {
      rows,
      labels: rows.map((r) => r.date),
      values: rows.map((r) => r.close),
      raw: json
    };
  }

  // ------------------------------
  // 5. Finnhub news (array of objects with headline)
  // ------------------------------
  if (Array.isArray(json) && json[0]?.headline) {
    return { rows: json, labels: [], values: [], raw: json };
  }

  // ------------------------------
  // 6. Generic { data: [] }
  // ------------------------------
  if (Array.isArray(json?.data)) {
    return { rows: json.data, labels: [], values: [], raw: json };
  }

  // ------------------------------
  // 7. Already array
  // ------------------------------
  if (Array.isArray(json)) {
    return { rows: json, labels: [], values: [], raw: json };
  }

  // ------------------------------
  // 8. Unknown object → wrap
  // ------------------------------
  if (typeof json === "object") {
    return { rows: [json], labels: [], values: [], raw: json };
  }

  return { rows: [], labels: [], values: [], raw: json };
};
// src/utils/dataMapper.js

export const finnhubFieldMap = {
  c: "Current Price",
  d: "Change",
  dp: "Percent Change",
  h: "Day High",
  l: "Day Low",
  o: "Day Open",
  pc: "Previous Close",
  t: "Timestamp"
};
