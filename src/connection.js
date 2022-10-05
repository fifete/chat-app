const { Pool } = require('pg');

// /* eslint-disable prettier/prettier */
// const { Client } = require('pg').Pool;

const client = new Pool({
  host: 'ec2-34-227-120-79.compute-1.amazonaws.com',
  user: 'xlmawradjiyvek',
  port: 5432,
  password: 'a90c1d045191b430580336853d481d607fb39243f62948f4c56e9eb7f5f256d3',
  database: 'df01fd8sptukh3',
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* 
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'postgres',
  database: 'postgres',
}); 
*/

module.exports = client;
