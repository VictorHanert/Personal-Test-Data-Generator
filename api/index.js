import express from 'express';
import FakeInfo from './FakeInfo';

const app = express()
const port = 3000



app.get('/', (req, res) => {
  res.send('Hello World!')
})


// GET /cpr
app.get("/cpr", (_req, res) => {
  res.json({ CPR: FakeInfo.getCPR() });
});

// GET /name-gender
app.get("/name-gender", (_req, res) => {
  const { firstName, lastName, gender } = FakeInfo.getFullNameAndGender();
  res.json({ firstName, lastName, gender });
});

// GET /name-gender-dob
app.get("/name-gender-dob", (_req, res) => {
  const { firstName, lastName, gender, birthDate } = FakeInfo.getFullNameGenderAndBirthDate();
  res.json({ firstName, lastName, gender, birthDate });
});

// GET /cpr-name-gender
app.get("/cpr-name-gender", (_req, res) => {
  const { firstName, lastName, gender } = FakeInfo.getFullNameAndGender();
  const CPR = FakeInfo.getCPR();
  res.json({ CPR, firstName, lastName, gender });
});

// GET /cpr-name-gender-dob
app.get("/cpr-name-gender-dob", (_req, res) => {
  const { firstName, lastName, gender, birthDate } = FakeInfo.getFullNameGenderAndBirthDate();
  const CPR = FakeInfo.getCPR();
  res.json({ CPR, firstName, lastName, gender, birthDate });
});

// GET /address
app.get("/address", async (_req, res) => {
  try {
    res.json(await getAddress());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /phone
app.get("/phone", (_req, res) => {
  res.json({ phoneNumber: getPhoneNumber() });
});

// GET /person and /person?n=#
app.get("/person", async (req, res) => {
  try {
    const n = req.query.n;
    if (n) {
      return res.json(await getFakePersons(n));
    }
    return res.json(await getFakePerson());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
