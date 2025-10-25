import { fakeCpr } from "../methods.js";

describe("fakeCpr()", () => {
  test("Should return a string", () => {
    // Act
    const cpr = fakeCpr();

    // Assert
    expect(typeof cpr).toBe("string");
  });
});
