import express from "express";

const app = express();

// Return a fake CPR
app.get("/fake-cpr", (req, res) => {
  res.json({ status: "ok" });
});

// Return a fake first name, last name and gender
app.get("/fake-first-name-last-name-gender", (req, res) => {
  res.json({ status: "ok" });
});

// Return a fake first name, last name, gender and date of birth
app.get("/fake-first-name-last-name-gender-dob", (req, res) => {
  res.json({ status: "ok" });
});

// Return a fake CPR, first name, last name and gender
app.get("/fake-cpr-first-name-last-name-gender", (req, res) => {
  res.json({ status: "ok" });
});

// Return a fake CPR, first name, last name, gender and date of birth
app.get("/fake-cpr-first-name-last-name-gender-dob", (req, res) => {
  res.json({ status: "ok" });
});

// Return a fake address
app.get("/fake-address", (req, res) => {
  res.json({ status: "ok" });
});

// Return a fake mobile phone number
app.get("/fake-mobile-phone-number", (req, res) => {
  res.json({ status: "ok" });
});

// Return all information for a fake person
// (CPR, first name, last name, gender, date of birth, address, mobile phone number)
app.get("/fake-person-information", (req, res) => {
  res.json({ status: "ok" });
});

// Return fake person information in bulk (all information for 2 to 100 persons)
app.get("/fake-person-information-bulk", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});
