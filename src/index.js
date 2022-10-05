const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

// eslint-disable-next-line import/extensions
const client = require('./connection.js');

// eslint-disable-next-line import/extensions
const bd = require('./queries.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(bodyParser.json());

client.connect();

app.get('/users', (req, res) => {
  bd.getUsers().then((response) => {
    res.send(response);
  });
});

app.get('/userState', (req, res) => {
  bd.getUserState().then((response) => {
    res.send(response);
  });
});

app.post('/addUser', (req, res) => {
  bd.addUser('Pamela', 'pam@kity.com', '123456', true)
});

app.put('/updateState', (req, res) => {
  bd.updateUserState('123456', false)
});

app.delete('/deleteUser', (req, res) => {
  bd.deleteUser('4')
});

