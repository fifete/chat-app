/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
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
        res.status(400).send({message: error.detail});
        throw error;
      }
      res.status(201).send({message:`User added with ID: ${results}`});
    }
  );
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

function getUserRow(req, res) {
  const { email } = req.body;
  client.query(`SELECT * FROM users WHERE email=$1`,
  [email],(error, results) => {
      if (error) {
        return res.status(400).send({ message: error.detail });
      }
      return res.status(200).send({ message: results.rows[0] })
    })
}

const updateUserState = async (userOnlineData, status) => {
  console.log(`🎈`, userOnlineData);
  try {
    const { email} = userOnlineData;
    const result = await client.query(
      'UPDATE users SET status=$2 WHERE email=$1',
      [email, status]
    );
    if (result.rows.length === 0) {
      return 'user not found'
    }
  } catch (error) {
    console.log(error.stack);
  }
};

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

const getChannels = (request, response) => {
  client.query('SELECT * FROM channels', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

function channelByName(req, res) {
  const { channelName } = req.body;
  client.query(`SELECT * FROM channels WHERE name_channel=$1`,
  [channelName],(error, results) => {
      if (error) {
        return res.status(400).send({ message: error.detail });
      }
      return res.status(200).send({ message: results.rows[0] })
    })
}

function addChannel(req, res) {
  const { nameChannel, description, uid, token} = req.body;
  jwt.verify(token, 'secretkey', (error, authData) => {
    if(error){
      res.sendStatus(403).send({message: error});
    } else{
      client.query(
        `INSERT INTO public.channels(name_channel, description, uid)
          VALUES ($1, $2, $3);`,
        [nameChannel, description, uid],
        (err, results) => {
          if (err) {
            res.status(400).send({message: err.detail});
            throw err;
          }
          res.status(200).send({
            message: "Canal fue creado",
            authData
          });
        }
      );
  }
  });
}

function addUserToChannel(req, res) {
  const { cid, uid } = req.body;
  client.query(
    `INSERT INTO users_channels(cid, uid)
      VALUES ($1, $2);`,
    [cid, uid],
    (error, results) => {
      if (error) {
        res.status(400).send({message: error.detail});
        throw error;
      }
      res.status(200).send({message:`User added to users_channels table`});
    }
  );
}


module.exports = {
  getUsers: getUsers,
  addUser: addUser,
  getUserState: getUserState,
  updateUserState: updateUserState,
  deleteUser: deleteUser,
  verifyUserLogged: verifyUserLogged,
  getUserRow: getUserRow,
  updateUserState:updateUserState,
  getChannels:getChannels,
  channelByName:channelByName,
  addChannel:addChannel,
  addUserToChannel:addUserToChannel
};