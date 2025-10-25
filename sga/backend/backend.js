import express from "express";
import {
  fakeAddress,
  fakeCpr,
  fakeCprFirstNameLastNameGender,
  fakeCprFirstNameLastNameGenderDob,
  fakeFirstNameLastNameGender,
  fakeFirstNameLastNameGenderDob,
  fakeMobilePhoneNumber,
  fakePersonInformation,
  fakePersonInformationBulk,
} from "./methods.js";

const app = express();

// Return a fake CPR
app.get("/api/fake-cpr", (req, res) => {
  fakeCpr();
  res.json({ status: "ok" });
});

// Return a fake first name, last name and gender
app.get("/api/fake-first-name-last-name-gender", (req, res) => {
  fakeFirstNameLastNameGender();
  res.json({ status: "ok" });
});

// Return a fake first name, last name, gender and date of birth
app.get("/fake-first-name-last-name-gender-dob", (req, res) => {
  fakeFirstNameLastNameGenderDob;
  res.json({ status: "ok" });
});

// Return a fake CPR, first name, last name and gender
app.get("/fake-cpr-first-name-last-name-gender", (req, res) => {
  fakeCprFirstNameLastNameGender();
  res.json({ status: "ok" });
});

// Return a fake CPR, first name, last name, gender and date of birth
app.get("/fake-cpr-first-name-last-name-gender-dob", (req, res) => {
  fakeCprFirstNameLastNameGenderDob();
  res.json({ status: "ok" });
});

// Return a fake address
app.get("/fake-address", (req, res) => {
  fakeAddress();
  res.json({ status: "ok" });
});

// Return a fake mobile phone number
app.get("/fake-mobile-phone-number", (req, res) => {
  fakeMobilePhoneNumber();
  res.json({ status: "ok" });
});

// Return all information for a fake person
// (CPR, first name, last name, gender, date of birth, address, mobile phone number)
app.get("/fake-person-information", (req, res) => {
  fakePersonInformation();
  res.json({ status: "ok" });
});

// Return fake person information in bulk (all information for 2 to 100 persons)
app.get("/fake-person-information-bulk", (req, res) => {
  fakePersonInformationBulk();
  res.json({ status: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Backend is running on PORT", PORT);
});
