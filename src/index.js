const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

const db = require('./queries');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(bodyParser.json());

app.get('/users', (req, res) => {
  const getU = Promise.all(db.getUsers());
  console.log(getU);
  db.getUsers().then((response) => {
    res.send(response);
  });
});
