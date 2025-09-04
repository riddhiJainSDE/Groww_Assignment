const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;

export async function fetchStockQuote(symbol) {
  console.log("[AlphaVantage] Fetching stock quote for:", symbol);

  const res = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
  );

  const data = await res.json();
  console.log("[AlphaVantage] Raw quote response:", data);

  if (data["Global Quote"]) {
    return data["Global Quote"];
  }

  // Defensive fallback
  if (data["Note"]) {
    console.warn("[AlphaVantage] Rate limit hit:", data["Note"]);
    throw new Error("API rate limit reached, please wait");
  }

  if (data["Error Message"]) {
    console.error("[AlphaVantage] Invalid symbol:", symbol);
    throw new Error("Invalid symbol or API error");
  }

  return null;
}

export async function fetchStockTimeSeries(symbol) {
  console.log("[AlphaVantage] Fetching time series for:", symbol);

  const res = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
  );

  const data = await res.json();
  console.log("[AlphaVantage] Raw time series response:", data);

  const series = data["Time Series (Daily)"];
  if (!series) {
    if (data["Note"]) {
      console.warn("[AlphaVantage] Rate limit hit:", data["Note"]);
      throw new Error("API rate limit reached, please wait");
    }
    if (data["Error Message"]) {
      console.error("[AlphaVantage] Invalid symbol:", symbol);
      throw new Error("Invalid symbol or API error");
    }
    return [];
  }

  return Object.entries(series).map(([date, values]) => ({
    t: date,
    open: parseFloat(values["1. open"]),
    high: parseFloat(values["2. high"]),
    low: parseFloat(values["3. low"]),
    close: parseFloat(values["4. close"]),
    volume: parseInt(values["5. volume"]),
  }));
}
