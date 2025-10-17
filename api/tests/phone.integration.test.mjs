import request from "supertest";
import app from "../index.js";

describe("GET /validate-phone", () => {
  test("returns 200 + payload for a valid phone number", async () => {
    // "31" is a valid prefix, 8 digits total
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "31234567" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, phone: "31234567" });
  });

  test("returns 400 when phone is missing", async () => {
    const res = await request(app).get("/validate-phone");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test("returns 400 when length is invalid", async () => {
    const resShort = await request(app)
      .get("/validate-phone")
      .query({ phone: "3123456" }); // 7 digits
    expect(resShort.statusCode).toBe(400);

    const resLong = await request(app)
      .get("/validate-phone")
      .query({ phone: "312345678" }); // 9 digits
    expect(resLong.statusCode).toBe(400);
  });

  test("returns 400 when non-numeric", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "31abcd67" });
    expect(res.statusCode).toBe(400);
  });

  test("returns 400 when prefix is invalid", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "99234567" }); // "99" not in allowed prefixes
    expect(res.statusCode).toBe(400);
  });
});