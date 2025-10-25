import { db } from "./database.js";

// Return a fake CPR
export function fakeCpr() {
  console.log("fakeCpr()");
  const randomPerson = db.persons[Math.floor(Math.random() * db.persons.length)];

  return randomPerson;
}

// Return a fake first name, last name and gender
export function fakeFirstNameLastNameGender() {
  console.log("fakeFirstNameLastNameGender()");
}

// Return a fake first name, last name, gender and date of birth
export function fakeFirstNameLastNameGenderDob() {
  console.log("fakeFirstNameLastNameGenderDob()");
}

// Return a fake CPR, first name, last name and gender
export function fakeCprFirstNameLastNameGender() {
  console.log("fakeCprFirstNameLastNameGender()");
}
// Return a fake CPR, first name, last name, gender and date of birth
export function fakeCprFirstNameLastNameGenderDob() {
  console.log("fakeCprFirstNameLastNameGenderDob()");
}

// Return a fake address
export function fakeAddress() {
  console.log("fakeAddress()");
}

// Return a fake mobile phone number
export function fakeMobilePhoneNumber() {
  console.log("fakeMobilePhoneNumber()");
}

// Return all information for a fake person
// (CPR, first name, last name, gender, date of birth, address, mobile phone number)
export function fakePersonInformation() {
  console.log("fakePersonInformation()");
}

// Return fake person information in bulk (all information for 2 to 100 persons)
export function fakePersonInformationBulk() {
  console.log("fakePersonInformationBulk()");
}
