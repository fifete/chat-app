/* eslint-disable prettier/prettier */
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
        res.status(400).send({error: error.detail});
        throw error;
      }
      res.status(200).send(`User added with ID: ${results.rows}`);
    }
  );
}

module.exports = {
    getUsers: getUsers,
    addUser: addUser
};
