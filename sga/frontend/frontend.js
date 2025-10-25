import express from "express";

const app = express();
const PORT = 8080;
// backend API that provides the fake CPR
const BACKEND_API = "http://localhost:3000/api/fake-cpr";

app.get("/fake-cpr", async (req, res) => {
  try {
    const resp = await fetch(BACKEND_API);
    const data = await resp.json();

    res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Fake CPR</title>
    <style>body{font-family:system-ui,Segoe UI,Arial;padding:1rem}</style>
  </head>
  <body>
    <h1>Fake CPR</h1>
    <pre id="data">${JSON.stringify(data, null, 2)}</pre>
    <p><a href="/fake-cpr">Refresh</a></p>
  </body>
</html>`);
  } catch (err) {
    res.status(500).send(`<!doctype html><html><body><h1>Error</h1><pre>${String(err)}</pre></body></html>`);
  }
});

app.listen(PORT, () => {
  console.log(`Frontend is running on port`, PORT);
});
