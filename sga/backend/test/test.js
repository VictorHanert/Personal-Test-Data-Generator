import { fakeCpr } from "../methods.js";

describe("fakeCpr()", () => {
  test("Should return a string", () => {
    const randomPerson = fakeCpr();
    const cpr = randomPerson.cpr;

    expect(typeof cpr).toBe("string");
  });

  test("Should have odd last digit for male", () => {
    const randomPerson = fakeCpr();
    const cpr = randomPerson.cpr;
    const gender = randomPerson.gender;

    if (gender === "male") {
      const lastDigit = parseInt(cpr[cpr.length - 1]);
      expect(lastDigit % 2).toBe(1);
    }
  });

  test("Should have even last digit for female", () => {
    const randomPerson = fakeCpr();
    const cpr = randomPerson.cpr;
    const gender = randomPerson.gender;

    if (gender === "female") {
      const lastDigit = parseInt(cpr[cpr.length - 1]);
      expect(lastDigit % 2).toBe(0);
    }
  });
});
