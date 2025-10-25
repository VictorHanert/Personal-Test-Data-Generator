import express from "express";
import {
  fakeAddress,
  fakeCpr,
  fakeCprFirstNameLastNameGender,
  fakeCprFirstNameLastNameGenderDob,
  fakeFirstNameLastNameGender,
  fakeFirstNameLastNameGenderDob,
  fakeMobilePhoneNumber,
  fakePerson,
  fakePersonBulk,
} from "./methods.js";

const app = express();

// Return a fake CPR
app.get("/api/fake-cpr", (req, res) => {
  console.log("/api/fake-cpr");

  const cpr = fakeCpr();
  console.log(cpr);

  res.json({
    data: { cpr },
  });
});

// Return a fake first name, last name and gender
app.get("/api/fake-first-name-last-name-gender", (req, res) => {
  const data = fakeFirstNameLastNameGender();
  console.log(data);

  res.json({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
    },
  });
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
app.get("/api/fake-cpr-first-name-last-name-gender-dob", (req, res) => {
  const data = fakeCprFirstNameLastNameGenderDob();

  res.json({
    data: {
      cpr: data.cpr,
      firstName: data.firstName,
      lastname: data.lastname,
      gender: data.gender,
      dob: data.dob,
    },
  });
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
app.get("/api/fake-person", (req, res) => {
  const person = fakePerson();
  res.json({
    data: { person },
  });
});

// Return fake person information in bulk (all information for 2 to 100 persons)
app.get("/api/fake-person-bulk/:n", (req, res) => {
  const n = parseInt(req.params.n);

  // if no n return error
  if (isNaN(n)) return res.status(400).json({ error: "Invalid parameter" });

  // if under 2 return error
  if (n < 2) return res.status(400).json({ error: "Minimum 2 required" });

  // if over 100 return error
  if (n > 100) return res.status(400).json({ error: "Maximum 100 allowed" });

  const persons = fakePersonBulk(n);

  res.json({
    data: {
      persons,
    },
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Backend is running on PORT", PORT);
});
