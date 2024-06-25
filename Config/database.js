const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'mysql-2e3fcc54-ritiksharmaformal-e1b9.d.aivencloud.com',
  user: 'avnadmin',
  password: 'root',
  database: 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function verifyConnection() {
    try {
      const connection = await pool.getConnection();
      console.log('Connected to MySQL.');
      connection.release();
    } catch (err) {
      console.error('Error connecting to MySQL:', err);
    }
  }
  
  verifyConnection();

  module.exports =pool;
  