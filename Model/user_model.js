const pool = require('../Config/database');
const bcrypt = require('bcrypt');

async function createTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE KEY,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table "users" created successfully.');
    connection.release();
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

createTable();

const User = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.phone = user.phone;
  this.password = user.password;
  this.role = user.role;
};

User.create = async (newUser, result) => {
  const { name, email, phone, password, role } = newUser;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [res] = await pool.query(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, role]
    );
    console.log('Created user:', { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  } catch (err) {
    console.log('Error:', err);
    result(err, null);
  }
};

User.findByEmail = async (email, result) => {
  try {
    const [res] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: 'not_found' }, null);
  } catch (err) {
    console.log('Error:', err);
    result(err, null);
  }
};

module.exports = {
  User
};
