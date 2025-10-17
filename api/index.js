// index.js
import express from 'express';
import FakeInfo from './FakeInfo.js';

const app = express();
const port = 3000;

app.get('/hello', (_req, res) => {
  res.send('Hello World!');
});

// GET /cpr
app.get('/cpr', (_req, res) => {
  const f = new FakeInfo();
  res.json({ CPR: f.cpr });            // or: res.json({ CPR: f.getFakePerson().CPR });
});

// GET /name-gender
app.get('/name-gender', (_req, res) => {
  const f = new FakeInfo();
  const { firstName, lastName, gender } = f.getFullNameAndGender();
  res.json({ firstName, lastName, gender });
});

// GET /name-gender-dob
app.get('/name-gender-dob', (_req, res) => {
  const f = new FakeInfo();
  const { firstName, lastName, gender, birthDate } = f.getFullNameGenderAndBirthDate();
  res.json({ firstName, lastName, gender, birthDate });
});

// GET /cpr-name-gender
app.get('/cpr-name-gender', (_req, res) => {
  const f = new FakeInfo();
  const { firstName, lastName, gender } = f.getFullNameAndGender();
  res.json({ CPR: f.cpr, firstName, lastName, gender });
});

// GET /cpr-name-gender-dob
app.get('/cpr-name-gender-dob', (_req, res) => {
  const f = new FakeInfo();
  const { firstName, lastName, gender, birthDate } = f.getFullNameGenderAndBirthDate();
  res.json({ CPR: f.cpr, firstName, lastName, gender, birthDate });
});

// GET /address
app.get('/address', (_req, res) => {
  const f = new FakeInfo();
  res.json(f.getAddress()); // getAddress() is sync in your class
});

// GET /phone
app.get('/phone', (_req, res) => {
  const f = new FakeInfo();
  res.json({ phoneNumber: f.getPhoneNumber() });
});

// GET /person and /person?n=#
app.get('/person', (req, res) => {
  // amount is optional; your class enforces [2..100] for bulk
  const n = Number(req.query.n);
  if (Number.isFinite(n)) {
    const f = new FakeInfo();
    return res.json(f.getFakePersons(n));
  }
  const f = new FakeInfo();
  return res.json(f.getFakePerson());
});

app.get('/validate-cpr', (req, res) => {
  const { cpr, gender } = req.query;

  if (!cpr || typeof cpr !== 'string') {
    return res.status(400).json({ error: 'CPR is required' });
  }
  if (!gender || !['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Gender must be "male" or "female"' });
  }

  const f = new FakeInfo();
  const isValid = f.validateCPR(cpr, gender);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid CPR' });
  }

  // If valid, you can derive it or just echo back the provided gender.
  // Prefer deriving to ensure consistency:
  const derived = f.getGenderFromCPR?.(cpr) ?? gender;
  return res.status(200).json({ gender: derived });
});

app.get("/validate-phone", (req, res) => {
  const { phone } = req.query;

  if (typeof phone !== "string") {
    return res.status(400).json({ error: 'Query param "phone" is required' });
  }

  const fi = new FakeInfo();
  const valid = fi.validatePhoneNumber(phone);

  if (!valid) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  return res.status(200).json({ ok: true, phone });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});

export default app;