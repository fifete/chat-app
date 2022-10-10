/* eslint-disable prettier/prettier */
const client = require('./connection');
const jwt = require('jsonwebtoken');

const getUsers = (request, response) => {
  client.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
  
function addUser(req, res) {
  const { nameUser, email, password } = req.body;
  client.query(
    `INSERT INTO public.users(user_name, email, password)
      VALUES ($1, $2, $3);`,
    [nameUser, email, password],
    (error, results) => {
      if (error) {
        // send error.detail and status 400 to client
        return res.status(400).send({ message: error.detail });
      }
      return res.status(200).send({
        message: `User added with ID: ${results}`
      });
    }
  );
}

function verifyUserLogged(userData, res) {
  const {email, password} = userData
  client.query(
    `SELECT * FROM users WHERE email = $1 AND password = $2`,
    [email, password],
    (error, results) => {
      if (error) {
        // send error.detail and status 400 to client
        console.log(error);
        return res.status(400).send({ message: error.detail });
      }
      console.log(results);
      return jwt.sign({ userData }, 'secretkey', { expiresIn: '24h' },
        (err, token) => {
          res.status(200).send({
            token,
          });
        }
      );}
  );
}

module.exports = {
    getUsers: getUsers,
    addUser: addUser,
    verifyUserLogged: verifyUserLogged
};
