const client = require('./connection.js');

function getUsers() {
  return client
    .query('SELECT * FROM users')
    .then((response) => {
      return response.rows;
    })
    .catch((err) => {
      console.log(err);
    });
}

function addUser(nameUser, email, password, status) {
  client
    .query(
      `INSERT INTO public.users(name_user, email, password, status)
            VALUES ( '${nameUser}', '${email}', '${password}', ${status})`
    )
    .then((response) => {
      console.log(response.rows);
      return 'agregado';
/*       client.end(); */
    })
    .catch((err) => {
      console.log(err);
/*       client.end(); */
    });
}

/* addUser('Daniela', 'dan@kity.com', '123456', true);
    addUser('Gaby', 'gaby@kity.com', '123456', true); */
/* addUser('Pao', 'pao@kity.com', '123456', false); */

function getUserState(status) {
  client
    .query(`SELECT * FROM users WHERE status=${status}`)
    .then((response) => {
      console.log(response.rows);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
}
/* getUserState(true); */

function updateUserState(id, status) {
  client
    .query(`UPDATE public.users SET status=${status} where id_user=${id}`)
    .then((response) => {
      console.log(response.rows);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
}

/* updateUserState(3, true); */

function deleteUser(id) {
  client
    .query(`DELETE FROM users WHERE id_user= ${id};`)
    .then((response) => {
      console.log(response.rows);
      client.end();
    })
    .catch((err) => {
      console.log(err);
      client.end();
    });
}
/* deleteUser(3); */

module.exports = {
  getUsers: getUsers,
  addUser: addUser
};
