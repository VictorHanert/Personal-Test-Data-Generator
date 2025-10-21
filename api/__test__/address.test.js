// @jest-environment node
import FakeInfo from '../FakeInfo.js';

// Danish letters allowed in street/town if you want to be permissive:
const LETTERS_DK = 'A-Za-zÆØÅæøå';
const STREET_RE = new RegExp(`^[${LETTERS_DK} .'-]{2,47}$`); // letters + space + common separators
const TOWN_RE   = new RegExp(`^[${LETTERS_DK} ]+$`); // one or more letters/spaces

function typeGuardStringLike(x, name) {
  if (typeof x !== 'string' && typeof x !== 'number') {
    throw new TypeError(`${name} must be a string or number`);
  }
}

function validateStreet(street) {
  if (typeof street !== 'string') throw new TypeError('street must be a string');
  const s = street.trim();
  if (s.length < 2 || s.length > 47) throw new RangeError('street length must be 2–47');
  if (!STREET_RE.test(s)) throw new RangeError('street has invalid characters');
  return true;
}

function validateNumber(number) {
  typeGuardStringLike(number, 'number');
  const s = String(number).trim();
  // 1–999 with optional single uppercase letter (ASCII), no spaces inside.
  const ok = /^([1-9]\d{0,2})([A-Z])?$/.test(s);
  if (!ok) throw new RangeError('number must be 1–999 with optional single uppercase letter');
  return true;
}

// Optional stricter rule (official Danish guidance): letter cannot be I, J, O, Q.
// Use this to create *failing* tests if your generator allows these letters.
function validateNumberNoIJOQ(number) {
  typeGuardStringLike(number, 'number');
  const s = String(number).trim();
  const m = s.match(/^([1-9]\d{0,2})([A-Z])?$/);
  if (!m) throw new RangeError('number invalid');
  const letter = m[2];
  if (letter && /[IJOQ]/.test(letter)) throw new RangeError('number letter cannot be I,J,O,Q');
  return true;
}

function validateFloor(floor) {
  typeGuardStringLike(floor, 'floor');
  const s = String(floor).trim();
  if (s === 'st') return true;
  if (!/^\d{1,2}$/.test(s)) throw new RangeError('floor must be "st" or 1–99');
  const n = Number(s);
  if (n < 1 || n > 99) throw new RangeError('floor out of range 1–99');
  return true;
}

function validateDoor(door) {
  typeGuardStringLike(door, 'door');
  const s = String(door).trim();

  // Allowed:
  // 1) "th", "tv", "mf"
  // 2) 1–50 (no leading zeros)
  // 3) pattern: [a-z] optional '-' then 1–3 digits (e.g., c3, d-14, a-101)
  if (s === 'th' || s === 'tv' || s === 'mf') return true;
  if (/^([1-9]|[1-4]\d|50)$/.test(s)) return true;
  if (/^[a-z](?:-)?\d{1,3}$/.test(s)) return true;

  throw new RangeError('door invalid');
}

function validatePostalCode(pc) {
  typeGuardStringLike(pc, 'postal code');
  const s = String(pc).trim();
  if (!/^\d{4}$/.test(s)) throw new RangeError('postal code must be exactly 4 digits');
  return true;
}

function validateTown(town) {
  if (typeof town !== 'string') throw new TypeError('town must be a string');
  const s = town.trim();
  if (s.length === 0) throw new RangeError('town must not be empty');
  if (!TOWN_RE.test(s)) throw new RangeError('town invalid');
  return true;
}

/* ---------------------------
   Positive tests (generation)
   --------------------------- */

describe('Address generation – positive (random sample size 2–47)', () => {
  // Random number of generated addresses, 2..47
  const SAMPLES = Math.floor(Math.random() * (47 - 2 + 1)) + 2;

  test(`generates ${SAMPLES} valid addresses`, () => {
    for (let i = 0; i < SAMPLES; i++) {
      const f = new FakeInfo();
      const { street, number, floor, door, postal_code, town_name } = f.address;

      expect(() => validateStreet(street)).not.toThrow();
      expect(() => validateNumber(number)).not.toThrow();
      expect(() => validateFloor(floor)).not.toThrow();
      expect(() => validateDoor(door)).not.toThrow();
      expect(() => validatePostalCode(postal_code)).not.toThrow();
      expect(() => validateTown(town_name)).not.toThrow();
    }
  });
});

/* --------------------------------------
   Boundary Value Analysis – street (2–47)
   -------------------------------------- */

describe('Street – BVA', () => {
  test('min-1 length fails', () => {
    expect(() => validateStreet('A')).toThrow(RangeError);
    expect(() => validateStreet('')).toThrow(RangeError);
  });
  test('min & min+1 pass', () => {
    expect(() => validateStreet('Aa')).not.toThrow();
    expect(() => validateStreet('Aaa')).not.toThrow();
  });
  test('max-1 & max pass', () => {
    const s46 = 'A'.repeat(46);
    const s47 = 'A'.repeat(47);
    expect(() => validateStreet(s46)).not.toThrow();
    expect(() => validateStreet(s47)).not.toThrow();
  });
  test('max+1 fails', () => {
    const s48 = 'A'.repeat(48);
    expect(() => validateStreet(s48)).toThrow(RangeError);
  });
  test('invalid data types throw', () => {
    // @ts-ignore
    expect(() => validateStreet(null)).toThrow(TypeError);
    // @ts-ignore
    expect(() => validateStreet(42)).toThrow(TypeError); // street must be string
    // @ts-ignore
    expect(() => validateStreet({})).toThrow(TypeError);
  });
});

/* ------------------------------------------------
   Number – BVA (1–999 with optional uppercase A–Z)
   ------------------------------------------------ */

describe('Number – BVA', () => {
  test('min-1 & negatives fail', () => {
    expect(() => validateNumber('0')).toThrow(RangeError);
    expect(() => validateNumber(-1)).toThrow(RangeError);
  });
  test('min & min+1 pass', () => {
    expect(() => validateNumber('1')).not.toThrow();
    expect(() => validateNumber('2')).not.toThrow();
  });
  test('max-1 & max pass', () => {
    expect(() => validateNumber('998')).not.toThrow();
    expect(() => validateNumber('999')).not.toThrow();
  });
  test('max+1 fails', () => {
    expect(() => validateNumber('1000')).toThrow(RangeError);
  });
  test('letter suffix allowed (A–Z)', () => {
    expect(() => validateNumber('43B')).not.toThrow();
    expect(() => validateNumber('2Z')).not.toThrow();
  });
  test('bad formats fail', () => {
    expect(() => validateNumber('A1')).toThrow(RangeError);
    expect(() => validateNumber('12ab')).toThrow(RangeError);
    expect(() => validateNumber('12 A')).toThrow(RangeError);
  });
  test('invalid data types throw', () => {
    // @ts-ignore
    expect(() => validateNumber([])).toThrow(TypeError);
    // @ts-ignore
    expect(() => validateNumber({})).toThrow(TypeError);
  });

  // OPTIONAL stricter rule (adds expected FAILS against current generator):
  test('I/J/O/Q disallowed (official guidance) – should fail', () => {
    expect(() => validateNumberNoIJOQ('14I')).toThrow(RangeError);
    expect(() => validateNumberNoIJOQ('14J')).toThrow(RangeError);
    expect(() => validateNumberNoIJOQ('14O')).toThrow(RangeError);
    expect(() => validateNumberNoIJOQ('14Q')).toThrow(RangeError);
  });
});

/* -------------------------------
   Floor – BVA ("st" or 1..99)
   ------------------------------- */

describe('Floor – BVA', () => {
  test('min-1 & negatives fail', () => {
    expect(() => validateFloor('0')).toThrow(RangeError);
    expect(() => validateFloor(-3)).toThrow(RangeError);
  });
  test('min & min+1 pass', () => {
    expect(() => validateFloor('1')).not.toThrow();
    expect(() => validateFloor(2)).not.toThrow();
  });
  test('"st" valid', () => {
    expect(() => validateFloor('st')).not.toThrow();
  });
  test('max-1 & max pass; max+1 fails', () => {
    expect(() => validateFloor('98')).not.toThrow();
    expect(() => validateFloor('99')).not.toThrow();
    expect(() => validateFloor('100')).toThrow(RangeError);
  });
  test('invalid types throw', () => {
    // @ts-ignore
    expect(() => validateFloor(null)).toThrow(TypeError);
    // @ts-ignore
    expect(() => validateFloor({})).toThrow(TypeError);
  });
});

/* --------------------------------------
   Door – BVA (labels / 1–50 / pattern)
   -------------------------------------- */

describe('Door – BVA', () => {
  test('labels pass and wrong case fails', () => {
    expect(() => validateDoor('th')).not.toThrow();
    expect(() => validateDoor('tv')).not.toThrow();
    expect(() => validateDoor('mf')).not.toThrow();
    expect(() => validateDoor('TH')).toThrow(RangeError);
  });

  test('numeric boundaries: 1..50 pass; 0 and 51 fail', () => {
    expect(() => validateDoor('1')).not.toThrow();
    expect(() => validateDoor('2')).not.toThrow();
    expect(() => validateDoor('50')).not.toThrow();
    expect(() => validateDoor('0')).toThrow(RangeError);
    expect(() => validateDoor('51')).toThrow(RangeError);
  });

  test('pattern [a-z][-]?\\d{1,3}: edges', () => {
    expect(() => validateDoor('a1')).not.toThrow();     // min digits
    expect(() => validateDoor('a-1')).not.toThrow();    // dash
    expect(() => validateDoor('b12')).not.toThrow();
    expect(() => validateDoor('c123')).not.toThrow();   // max digits
    expect(() => validateDoor('c-123')).not.toThrow();

    expect(() => validateDoor('a')).toThrow(RangeError);       // missing digits
    expect(() => validateDoor('d1234')).toThrow(RangeError);   // 4 digits
    expect(() => validateDoor('A12')).toThrow(RangeError);     // uppercase
    expect(() => validateDoor('ab12')).toThrow(RangeError);    // 2 letters
    expect(() => validateDoor('e-')).toThrow(RangeError);      // dash only
  });

  test('invalid data types throw', () => {
    // @ts-ignore
    expect(() => validateDoor({})).toThrow(TypeError);
    // @ts-ignore
    expect(() => validateDoor([])).toThrow(TypeError);
  });
});

/* ---------------------------------------
   Postal code (4 digits) & town (letters)
   --------------------------------------- */

describe('Postal & Town – BVA', () => {
  // Postal code
  test('postal boundaries', () => {
    expect(() => validatePostalCode('0001')).not.toThrow();
    expect(() => validatePostalCode('9999')).not.toThrow();
    expect(() => validatePostalCode('999')).toThrow(RangeError);
    expect(() => validatePostalCode('10000')).toThrow(RangeError);
    expect(() => validatePostalCode('12A4')).toThrow(RangeError);
  });

  test('postal invalid types throw', () => {
    // @ts-ignore
    expect(() => validatePostalCode({})).toThrow(TypeError);
    // @ts-ignore
    expect(() => validatePostalCode(null)).toThrow(TypeError);
  });

  // Town
  test('town basics', () => {
    expect(() => validateTown('A')).not.toThrow();               // min
    expect(() => validateTown('Odense')).not.toThrow();
    expect(() => validateTown('Sønderborg')).not.toThrow();
    expect(() => validateTown('Frederiksberg C')).not.toThrow(); // spaces allowed
    expect(() => validateTown('')).toThrow(RangeError);
    expect(() => validateTown('Aarhus2')).toThrow(RangeError);   // digits not allowed
  });

  test('town invalid types throw', () => {
    // @ts-ignore
    expect(() => validateTown(null)).toThrow(TypeError);
    // @ts-ignore
    expect(() => validateTown(123)).toThrow(TypeError);
  });
});
