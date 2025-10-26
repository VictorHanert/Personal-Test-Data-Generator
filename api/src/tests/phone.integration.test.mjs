import request from "supertest";
import app from "../index.js";
import {describe, expect, test} from '@jest/globals';

describe("GET /validate-phone", () => {
  test("200: valid phone with allowed prefix", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "31234567" }); // "31" allowed, 8 digits
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, phone: "31234567" });
  });

  test("200: phone with spaces (validator removes internal + trims)", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: " 31 23 45 67 " });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    // echo will return the raw query value; if you want normalized echo,
    // change the route to return the cleaned number instead.
  });

  test("400: missing phone", async () => {
    const res = await request(app).get("/validate-phone");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  test("400: invalid length (7 digits)", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "3123456" });
    expect(res.statusCode).toBe(400);
  });

  test("400: invalid length (9 digits)", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "312345678" });
    expect(res.statusCode).toBe(400);
  });

  test("400: non-numeric", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "31abcd67" });
    expect(res.statusCode).toBe(400);
  });

  test("400: invalid prefix", async () => {
    const res = await request(app)
      .get("/validate-phone")
      .query({ phone: "99234567" }); // prefix "99" not allowed
    expect(res.statusCode).toBe(400);
  });
});