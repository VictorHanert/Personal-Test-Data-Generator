// File: FakeInfo.js
// Node.js port of the PHP FakeInfo class
// Author: (ported by ChatGPT), based on original by Arturo Mora-Rioja
// Version: 1.0.0 (Node port)

import fs from "fs";
import path from "path";

export default class FakeInfo {
  static GENDER_FEMININE = "female";
  static GENDER_MASCULINE = "male";

  static FILE_PERSON_NAMES = "data/person-names.json";

  static PHONE_PREFIXES = [
    "2", "30", "31", "40", "41", "42", "50", "51", "52", "53", "60", "61", "71", "81", "91", "92", "93", "342",
    "344", "345", "346", "347", "348", "349", "356", "357", "359", "362", "365", "366", "389", "398", "431",
    "441", "462", "466", "468", "472", "474", "476", "478", "485", "486", "488", "489", "493", "494", "495",
    "496", "498", "499", "542", "543", "545", "551", "552", "556", "571", "572", "573", "574", "577", "579",
    "584", "586", "587", "589", "597", "598", "627", "629", "641", "649", "658", "662", "663", "664", "665",
    "667", "692", "693", "694", "697", "771", "772", "782", "783", "785", "786", "788", "789", "826", "827", "829"
  ];

  static MIN_BULK_PERSONS = 2;
  static MAX_BULK_PERSONS = 100;

  /** @type {string} */ #cpr;
  /** @type {string} */ #firstName;
  /** @type {string} */ #lastName;
  /** @type {string} */ #gender;
  /** @type {string} */ #birthDate; // YYYY-MM-DD
  /** @type {object} */ #address = {};
  /** @type {string} */ #phone;

  constructor() {
    this.#setFullNameAndGender();
    this.#setBirthDate();
    this.#setCpr();
    this.#setAddress();
    this.#setPhone();
  }

  // -------------------------
  // Private helpers
  // -------------------------
  static #randInt(min, max) {
    // inclusive integers like PHP mt_rand
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static #pick(arr) {
    return arr[FakeInfo.#randInt(0, arr.length - 1)];
  }

  static #fileExists(p) {
    try {
      return fs.existsSync(p) && fs.statSync(p).isFile();
    } catch {
      return false;
    }
  }

  static #loadJSONIfExists(p) {
    if (!FakeInfo.#fileExists(p)) return null;
    try {
      const txt = fs.readFileSync(p, "utf8");
      return JSON.parse(txt);
    } catch {
      return null;
    }
  }

  // -------------------------
  // Name & gender
  // -------------------------
  #setFullNameAndGender() {
    // Try to load data/person-names.json; expected shape:
    // { "persons": [ { "firstName": "...", "lastName": "...", "gender": "female"|"male" }, ... ] }
    const filePath = path.resolve(process.cwd(), FakeInfo.FILE_PERSON_NAMES);
    let namesData = FakeInfo.#loadJSONIfExists(filePath);

    if (!namesData || !Array.isArray(namesData.persons) || namesData.persons.length === 0) {
      // fallback tiny dataset to keep class functional without external files
      namesData = {
        persons: [
          { firstName: "Anna", lastName: "Jensen", gender: FakeInfo.GENDER_FEMININE },
          { firstName: "Maja", lastName: "Nielsen", gender: FakeInfo.GENDER_FEMININE },
          { firstName: "Freja", lastName: "Larsen", gender: FakeInfo.GENDER_FEMININE },
          { firstName: "Noah", lastName: "Christensen", gender: FakeInfo.GENDER_MASCULINE },
          { firstName: "William", lastName: "Pedersen", gender: FakeInfo.GENDER_MASCULINE },
          { firstName: "Oscar", lastName: "Andersen", gender: FakeInfo.GENDER_MASCULINE }
        ]
      };
    }

    const person = FakeInfo.#pick(namesData.persons);
    this.#firstName = person.firstName;
    this.#lastName = person.lastName;
    this.#gender = person.gender;
  }

  // -------------------------
  // Birth date (1900..current year)
  // -------------------------
  #setBirthDate() {
    const nowYear = new Date().getFullYear();
    const year = FakeInfo.#randInt(1900, nowYear);
    const month = FakeInfo.#randInt(1, 12);
    let day;

    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
      day = FakeInfo.#randInt(1, 31);
    } else if ([4, 6, 9, 11].includes(month)) {
      day = FakeInfo.#randInt(1, 30);
    } else {
      // February — intentionally ignore leap years to mirror PHP code
      day = FakeInfo.#randInt(1, 28);
    }

    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    this.#birthDate = `${year}-${mm}-${dd}`;
  }

  // -------------------------
  // CPR
  // -------------------------
  #setCpr() {
    if (!this.#birthDate) this.#setBirthDate();
    if (!this.#firstName || !this.#lastName || !this.#gender) this.#setFullNameAndGender();

    // CPR must end in an even number for females, odd for males
    let finalDigit = FakeInfo.#randInt(0, 9);
    if (this.#gender === FakeInfo.GENDER_FEMININE && finalDigit % 2 === 1) {
      finalDigit += 1; // could become 10; adjust back to 0 if so
      if (finalDigit === 10) finalDigit = 0;
    }
    if (this.#gender === FakeInfo.GENDER_MASCULINE && finalDigit % 2 === 0) {
      finalDigit += 1; // ensure odd
      if (finalDigit === 10) finalDigit = 1;
    }

    const yyyy = this.#birthDate.slice(0, 4);
    const mm = this.#birthDate.slice(5, 7);
    const dd = this.#birthDate.slice(8, 10);
    const yy = yyyy.slice(2, 4);

    const randDigit = () => String(FakeInfo.#randInt(0, 9));

    this.#cpr = `${dd}${mm}${yy}${randDigit()}${randDigit()}${randDigit()}${finalDigit}`;
  }

  // -------------------------
  // Address
  // -------------------------
  #setAddress() {
    const street = FakeInfo.#getRandomText(40, true);

    // Number: 1..999 optionally with a capital letter (≈20%)
    let number = String(FakeInfo.#randInt(1, 999));
    if (FakeInfo.#randInt(1, 10) < 3) {
      number += FakeInfo.#getRandomText(1, false).toUpperCase();
    }

    // Floor: "st" about 30% else 1..99
    const floor = (FakeInfo.#randInt(1, 10) < 4) ? "st" : FakeInfo.#randInt(1, 99);

    // Door distribution same as PHP
    const doorType = FakeInfo.#randInt(1, 20);
    let door;
    if (doorType < 8) {
      door = "th";
    } else if (doorType < 15) {
      door = "tv";
    } else if (doorType < 17) {
      door = "mf";
    } else if (doorType < 19) {
      door = String(FakeInfo.#randInt(1, 50));
    } else {
      const lowerCaseLetters = [
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q",
        "r","s","t","u","v","w","x","y","z","ø","æ","å"
      ];
      door = FakeInfo.#pick(lowerCaseLetters);
      if (doorType === 20) door += "-";
      door += String(FakeInfo.#randInt(1, 999));
    }

    // Postal code + town
    const { postal_code, town_name } = this.#getRandomTown();

    this.#address = {
      street,
      number,
      floor,
      door,
      postal_code,
      town_name
    };
  }

  // Minimal Town helper (tries data/towns.json; else uses a fallback list)
  #getRandomTown() {
    // Expected shape of data/towns.json: [{ "postal_code": "1050", "town_name": "København K" }, ...]
    const townsPath = path.resolve(process.cwd(), "data/towns.json");
    let towns = FakeInfo.#loadJSONIfExists(townsPath);
    if (!Array.isArray(towns) || towns.length === 0) {
      towns = [
        { postal_code: "1050", town_name: "København K" },
        { postal_code: "2100", town_name: "København Ø" },
        { postal_code: "8000", town_name: "Aarhus C" },
        { postal_code: "5000", town_name: "Odense C" },
        { postal_code: "9000", town_name: "Aalborg" },
        { postal_code: "4000", town_name: "Roskilde" }
      ];
    }
    return FakeInfo.#pick(towns);
  }

  // -------------------------
  // Random text (letters + optional Danish chars + space)
  // -------------------------
  static #getRandomText(length = 1, includeDanishCharacters = true) {
    let valid = [
      " ",..."abcdefghijklmnopqrstuvwxyz".split(""),
      ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    ];
    if (includeDanishCharacters) {
      valid = valid.concat(["æ","ø","å","Æ","Ø","Å"]);
    }
    // First character cannot be space
    let text = valid[FakeInfo.#randInt(1, valid.length - 1)];
    for (let i = 1; i < length; i++) {
      text += valid[FakeInfo.#randInt(0, valid.length - 1)];
    }
    return text;
  }

  // -------------------------
  // Phone number
  // -------------------------
  #setPhone() {
    let phone = FakeInfo.#pick(FakeInfo.PHONE_PREFIXES);
    const prefixLen = phone.length;
    for (let i = 0; i < (8 - prefixLen); i++) {
      phone += String(FakeInfo.#randInt(0, 9));
    }
    this.#phone = phone;
  }

  // -------------------------
  // Public getters (API mirrors PHP)
  // -------------------------
  getCpr() {
    return this.#cpr;
  }

  getFullNameAndGender() {
    return {
      firstName: this.#firstName,
      lastName: this.#lastName,
      gender: this.#gender
    };
  }

  getFullNameGenderAndBirthDate() {
    return {
      firstName: this.#firstName,
      lastName: this.#lastName,
      gender: this.#gender,
      birthDate: this.#birthDate
    };
  }

  getCprFullNameAndGender() {
    return {
      CPR: this.#cpr,
      firstName: this.#firstName,
      lastName: this.#lastName,
      gender: this.#gender
    };
  }

  getCprFullNameGenderAndBirthDate() {
    return {
      CPR: this.#cpr,
      firstName: this.#firstName,
      lastName: this.#lastName,
      gender: this.#gender,
      birthDate: this.#birthDate
    };
  }

  getAddress() {
    return { address: this.#address };
  }

  getPhoneNumber() {
    return this.#phone;
  }

  getFakePerson() {
    return {
      CPR: this.#cpr,
      firstName: this.#firstName,
      lastName: this.#lastName,
      gender: this.#gender,
      birthDate: this.#birthDate,
      address: this.#address,
      phoneNumber: this.#phone
    };
  }

  /**
   * @param {number} amount between 2 and 100
   */
  getFakePersons(amount = FakeInfo.MIN_BULK_PERSONS) {
    if (amount < FakeInfo.MIN_BULK_PERSONS) amount = FakeInfo.MIN_BULK_PERSONS;
    if (amount > FakeInfo.MAX_BULK_PERSONS) amount = FakeInfo.MAX_BULK_PERSONS;

    const bulk = [];
    for (let i = 0; i < amount; i++) {
      const f = new FakeInfo();
      bulk.push(f.getFakePerson());
    }
    return bulk;
  }
}
