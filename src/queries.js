/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const client = require('./connection');

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

function getUserName(req, res) {
  const { email } = req.body;
  client.query(`SELECT * FROM users WHERE email=$1`,
  [email],(error, results) => {
      if (error) {
        return res.status(400).send({ message: error.detail });
      }
      console.log(results);
      return res.status(200).send({ message: results.rows[0].user_name })
    })
}

const verifyUserLogged = async (userData, res) => {
  try {
    const { email, password } = userData;
    const result = await client.query(
      `SELECT * FROM users WHERE email=$1 AND password=$2`,
      [email, password]
    );
    if (result.rows.length === 0) {
      return res.status(404).send({ message: 'Email or Password invalid' });
    }

    return jwt.sign({ userData }, 'secretkey', { expiresIn: '24h' },
    (err, token) => {
      res.status(200).send({
        message: token,
      });
    });
  } catch (error) {
    console.log(error.stack);
  }
};

module.exports = {
    getUsers: getUsers,
    addUser: addUser,
    verifyUserLogged: verifyUserLogged,
    getUserName: getUserName
};
