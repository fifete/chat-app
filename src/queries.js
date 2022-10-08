const client = require('./connection.js');

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
        res.status(400).send({error: error.detail});
        throw error;
      }
      res.status(201).send(`User added with ID: ${results.rows}`);
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

module.exports = {
  getUsers: getUsers,
  addUser: addUser,
  getUserState: getUserState,
  updateUserState: updateUserState,
  deleteUser: deleteUser,
};
