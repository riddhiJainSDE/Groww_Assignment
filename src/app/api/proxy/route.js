export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let target = searchParams.get("url");

    if (!target) {
      return Response.json({ ok: false, error: "Missing ?url" }, { status: 400 });
    }

    const urlObj = new URL(target);

    // Auto-inject Finnhub key if missing
    if (urlObj.hostname.includes("finnhub.io")) {
      if (!urlObj.searchParams.get("token")) {
        urlObj.searchParams.set("token", process.env.NEXT_PUBLIC_FINNHUB_KEY);
      }
      target = urlObj.toString();
    }

    const res = await fetch(target, { cache: "no-store" });
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      return Response.json(
        { ok: false, error: "Non-JSON response", status: res.status, snippet: text.slice(0, 200) },
        { status: 502 }
      );
    }

    const data = await res.json();
    return Response.json({ ok: true, status: res.status, data });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
