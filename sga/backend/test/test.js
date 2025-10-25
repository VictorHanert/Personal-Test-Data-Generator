import { fakeCpr } from "../methods.js";

describe("fakeCpr()", () => {
  test("Should return a string", () => {
    const cpr = fakeCpr();

    expect(typeof cpr).toBe("string");
  });

  test("Should return 10 digits", () => {
    const cpr = fakeCpr();
    expect(cpr).toMatch(/^\d{10}$/);
  });
});
