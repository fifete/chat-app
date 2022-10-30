const { Client } = require('pg');

const client = new Client({
  host: 'dpg-cdff3isgqg4d3ghlpd1g-a.oregon-postgres.render.com',
  user: 'kittychat_0nqo_user',
  port: 5432,
  password: 'vrufCc0cEF1mlNAGTJQkSPa7576Z3Vlt',
  database: 'kittychat_0nqo',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = client;
