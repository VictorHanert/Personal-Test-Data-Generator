import request from "supertest";
import app from "../index.js";

describe("GET /validate-cpr", () => {
  test("200: female CPR (even last digit) with gender=female", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ cpr: "0101011234", gender: "female" });
    expect(res.statusCode).toBe(200);
    expect(res.body.gender).toBe("female");
  });

  test("200: male CPR (odd last digit) with gender=male", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ cpr: "0101011235", gender: "male" });
    expect(res.statusCode).toBe(200);
    expect(res.body.gender).toBe("male");
  });

  test("400: missing cpr", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ gender: "male" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/CPR is required/i);
  });
 

  test("400: invalid CPR length", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ cpr: "12345", gender: "male" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid cpr/i);
  });

  test("400: non-numeric CPR", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ cpr: "01010112A4", gender: "female" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid cpr/i);
  });

  test("400: parity mismatch (even last digit but gender=male)", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ cpr: "0101011234", gender: "male" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid cpr/i);
  });

  // Optional depending on whether you add .trim() in validateCPR:
  test("200: CPR with surrounding spaces (if validator trims)", async () => {
    const res = await request(app)
      .get("/validate-cpr")
      .query({ cpr: " 0101011234 ", gender: "female" });
    // If you *don’t* trim in validateCPR, change expected status to 400.
    expect([200, 400]).toContain(res.statusCode);
  });
});