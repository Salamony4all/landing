const { put, list } = require("@vercel/blob");

const STATE_PATH = "experience-app-state.json";

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { blobs } = await list({ prefix: STATE_PATH });
      if (!blobs.length) {
        return res.status(204).end();
      }
      const latest = blobs.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      )[0];
      const response = await fetch(latest.url);
      const state = await response.json();
      return res.status(200).json(state);
    } catch (error) {
      return res.status(500).json({ error: "Failed to load state." });
    }
  }

  if (req.method === "POST") {
    try {
      const raw = await readBody(req);
      const payload = raw ? JSON.parse(raw) : {};
      await put(STATE_PATH, JSON.stringify(payload), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
      });
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to save state." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Method Not Allowed");
};
