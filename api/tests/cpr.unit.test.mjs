import FakeInfo from '../FakeInfo.js';


describe('validateCPR', () => {
    let fakeInfo;

    beforeEach(() => {
        fakeInfo = new FakeInfo();
    });

    test('should return "male" for a valid male CPR', () => {
        const validMaleCPR = "0101011235"; // Ends with an odd digit
        expect(fakeInfo.validateCPR(validMaleCPR, "male")).toBe("male");
    });

    test('should return "female" for a valid female CPR', () => {
        const validFemaleCPR = "0101011234"; // Ends with an even digit
        expect(fakeInfo.validateCPR(validFemaleCPR, "female")).toBe("female");
    });

    test('should return null for an invalid CPR length', () => {
        const invalidCPR = "12345"; // Too short
        expect(fakeInfo.validateCPR(invalidCPR, "male")).toBeNull();
    });

    test('should return null for a non-string CPR', () => {
        const invalidCPR = 1234567890; // Not a string
        expect(fakeInfo.validateCPR(invalidCPR, "male")).toBeNull();
    });

    test('should return null for a CPR with non-numeric characters', () => {
        const invalidCPR = "01010112A4"; // Contains a letter
        expect(fakeInfo.validateCPR(invalidCPR, "female")).toBeNull();
    });

    test('should return null for a mismatched gender and CPR', () => {
        const mismatchedCPR = "0101011234"; // Ends with an even digit (female), but gender is male
        expect(fakeInfo.validateCPR(mismatchedCPR, "male")).toBeNull();
    });

    test('should return null for an invalid gender', () => {
        const validCPR = "0101011235"; // Valid male CPR
        expect(fakeInfo.validateCPR(validCPR, "other")).toBeNull(); // Unsupported gender
    });
});