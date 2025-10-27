import request from "supertest";
import app from "../index.js";

describe("Integration Test – /name-gender endpoint", () => {
  test("GET /name-gender should return status 200 and valid JSON", async () => {
    const res = await request(app).get("/name-gender");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("firstName");
    expect(res.body).toHaveProperty("lastName");
    expect(res.body).toHaveProperty("gender");
  });

  test("firstName and lastName should be strings", async () => {
    const res = await request(app).get("/name-gender");
    expect(typeof res.body.firstName).toBe("string");
    expect(typeof res.body.lastName).toBe("string");
  });

  test("gender should be 'male' or 'female'", async () => {
    const res = await request(app).get("/name-gender");
    expect(["male", "female"]).toContain(res.body.gender);
  });

  test("each call should produce random people occasionally", async () => {
    const res1 = await request(app).get("/name-gender");
    const res2 = await request(app).get("/name-gender");
    expect(JSON.stringify(res1.body)).not.toEqual(JSON.stringify(res2.body));
  });
});
