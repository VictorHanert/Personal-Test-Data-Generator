import FakeInfo from "../FakeInfo.js";

describe("Unit Test – Name & Gender", () => {
  let fake;

  beforeEach(() => {
    fake = new FakeInfo();
  });

  test("getFullNameAndGender should return object with firstName, lastName, and gender", () => {
    const result = fake.getFullNameAndGender();
    expect(result).toHaveProperty("firstName");
    expect(result).toHaveProperty("lastName");
    expect(result).toHaveProperty("gender");
  });

  test("firstName and lastName are non-empty strings", () => {
    const { firstName, lastName } = fake.getFullNameAndGender();
    expect(typeof firstName).toBe("string");
    expect(typeof lastName).toBe("string");
    expect(firstName.length).toBeGreaterThan(0);
    expect(lastName.length).toBeGreaterThan(0);
  });

  test("gender should be either 'male' or 'female'", () => {
    const { gender } = fake.getFullNameAndGender();
    expect(["male", "female"]).toContain(gender);
  });

  test("should work even if JSON file is missing (fallback dataset)", () => {
    const originalPath = FakeInfo.FILE_PERSON_NAMES;
    FakeInfo.FILE_PERSON_NAMES = "data/nonexistent.json";
    const temp = new FakeInfo();
    const { firstName, lastName, gender } = temp.getFullNameAndGender();
    expect(firstName).toBeTruthy();
    expect(lastName).toBeTruthy();
    expect(["male", "female"]).toContain(gender);
    FakeInfo.FILE_PERSON_NAMES = originalPath; // reset
  });

  test("random persons should not always be identical", () => {
    const person1 = new FakeInfo().getFullNameAndGender();
    const person2 = new FakeInfo().getFullNameAndGender();
    expect(JSON.stringify(person1)).not.toEqual(JSON.stringify(person2));
  });
});
