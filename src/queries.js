const client = require('./connection.js');
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
        res.status(400).send({message: error.detail});
        throw error;
      }
      res.status(201).send({message:`User added with ID: ${results}`});
    }
  );
}

/* addUser('Daniela', 'dan@kity.com', '123456', true);
    addUser('Gaby', 'gaby@kity.com', '123456', true); */
/* addUser('Pao', 'pao@kity.com', '123456', false); */

function getUserState(status) {
  client
    .query(`SELECT * FROM users WHERE status=${status}`)
    .then((response) => {
      console.log(response.rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getUserState(status) {
  client
    .query(`SELECT * FROM users WHERE status=${status}`)
    .then((response) => {
      console.log(response.rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

/* const getUserState = (request, response) => {
  client.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}; */
/* getUserState(true); */

function updateUserState(id, status) {
  client
    .query(`UPDATE public.users SET status=${status} where id_user=${id}`)
    .then((response) => {
      console.log(response.rows);
    })
    .catch((err) => {
      console.log(err);
    });
}

/* updateUserState(3, true); */

function deleteUser(id) {
  client
    .query(`DELETE FROM users WHERE id_user= ${id};`)
    .then((response) => {
      console.log(response.rows);
    })
    .catch((err) => {
      console.log(err);
    });
}
/* deleteUser(3); */
/* function verifyUserLogged(userData, res) {
  const {email, password} = userData
  client.query(
    `SELECT * FROM users WHERE email=$1 AND password=$2`,
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
} */

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
  getUserState: getUserState,
  updateUserState: updateUserState,
  deleteUser: deleteUser,
  verifyUserLogged: verifyUserLogged,
  getUserName: getUserName
};
