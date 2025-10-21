import FakeInfo from "../FakeInfo.js";

describe("validatePhoneNumber", () => {
  let fakeInfo;

  beforeEach(() => {
    fakeInfo = new FakeInfo();
  });

  test("should return true for a valid phone number", () => {
    const validPhoneNumber = "31234567"; // Prefix "31" is valid
    expect(fakeInfo.validatePhoneNumber(validPhoneNumber)).toBe(true);
  });

  test("should return false for a phone number with invalid length", () => {
    const shortPhoneNumber = "3123456"; // Only 7 digits
    const longPhoneNumber = "312345678"; // 9 digits
    expect(fakeInfo.validatePhoneNumber(shortPhoneNumber)).toBe(false);
    expect(fakeInfo.validatePhoneNumber(longPhoneNumber)).toBe(false);
  });

  test("should return false for a phone number with non-numeric characters", () => {
    const nonNumericPhoneNumber = "31abcd67";
    expect(fakeInfo.validatePhoneNumber(nonNumericPhoneNumber)).toBe(false);
  });

  test("should return false for a phone number with an invalid prefix", () => {
    const invalidPrefixPhoneNumber = "99234567"; // "99" is not valid
    expect(fakeInfo.validatePhoneNumber(invalidPrefixPhoneNumber)).toBe(false);
  });

  test("should return false for a phone number that is not a string", () => {
    const nonStringPhoneNumber = 31234567;
    expect(fakeInfo.validatePhoneNumber(nonStringPhoneNumber)).toBe(false);
  });

  test("returns true only for numbers that the system considers valid", () => {
    expect(fakeInfo.validatePhoneNumber("31234567")).toBe(true);
    expect(fakeInfo.validatePhoneNumber("99234567")).toBe(false);
  });

  test("should return false for an empty string", () => {
  expect(fakeInfo.validatePhoneNumber("")).toBe(false);
});

test("should return false for null or undefined input", () => {
  expect(fakeInfo.validatePhoneNumber(null)).toBe(false);
  expect(fakeInfo.validatePhoneNumber(undefined)).toBe(false);
});

test("should trim whitespace before validation", () => {
  expect(fakeInfo.validatePhoneNumber(" 31234567 ")).toBe(true);
});

test("returns consistent boolean output for random inputs", () => {
  const results = [
    fakeInfo.validatePhoneNumber("31234567"),
    fakeInfo.validatePhoneNumber("abcdef12"),
    fakeInfo.validatePhoneNumber(""),
    fakeInfo.validatePhoneNumber("00000000")
  ];
  results.forEach(result => {
    expect(typeof result).toBe("boolean");
  });
});

test("should return true for all known valid prefixes", () => {
  FakeInfo.PHONE_PREFIXES.forEach(prefix => {
    const phone = `${prefix}${"0".repeat(8 - prefix.length)}`;
    expect(fakeInfo.validatePhoneNumber(phone)).toBe(true);
  });
});

test("should return false for excessively long input strings", () => {
  const longNumber = "3".repeat(1000);
  expect(fakeInfo.validatePhoneNumber(longNumber)).toBe(false);
});

});
