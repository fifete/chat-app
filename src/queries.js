/* eslint-disable prettier/prettier */
const client = require('./connection');
//get users from postgres database usign client.query
// client.connect();
const getUsers = (request, response) => {
    console.log(client.query('SELECT * FROM users'));
    console.log('getUsers');
    /* return client.query('SELECT * FROM users')
        .then(response => {
        return response.rows;
        })
        .catch(err => {
        console.log(err);
        }); */
        client.query('SELECT * FROM users', (error, results) => {
            if (error) {
              throw error;
            }
            response.status(200).json(results.rows);
          });
    };
  
  function addUser(nameUser, email, status) {
    client
      .query(
        `INSERT INTO public.users(username, state, email)
        VALUES ($1, $2, $3);`, [nameUser, status, email]
      )
      .then((response) => {
        console.log(response.rows);
        response.send('User added');
      })
      .catch((err) => {
        console.log(err);
      });
  }

module.exports = {
    getUsers: getUsers,
    addUser: addUser
};
