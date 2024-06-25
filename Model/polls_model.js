const pool = require('../Config/database');

async function createTables() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS poll (
        poll_id INT AUTO_INCREMENT PRIMARY KEY,
        poll_name VARCHAR(255) NOT NULL,
        poll_question VARCHAR(255) NOT NULL,
        visible_to_teacher BOOLEAN NOT NULL DEFAULT FALSE,
        visible_to_student BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await connection.query(`
      CREATE TABLE IF NOT EXISTS poll_option (
        option_id INT AUTO_INCREMENT PRIMARY KEY,
        poll_id INT NOT NULL,
        option_text VARCHAR(255) NOT NULL,
        option_support INT DEFAULT 0,
        FOREIGN KEY (poll_id) REFERENCES poll(poll_id) ON DELETE CASCADE
      );
    `);
    connection.release();
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

createTables();

const Poll = function (poll) {
  this.poll_id = poll.poll_id;
  this.poll_name = poll.poll_name;
  this.poll_question = poll.poll_question;
  this.visible_to_teacher = poll.visible_to_teacher;
  this.visible_to_student = poll.visible_to_student;
};

Poll.create = async (newPoll, options, result) => {
  const { poll_name, poll_question, visible_to_teacher, visible_to_student } = newPoll;

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [resPoll] = await connection.query(`
      INSERT INTO poll (poll_name, poll_question, visible_to_teacher, visible_to_student)
      VALUES (?, ?, ?, ?)`, [poll_name, poll_question, visible_to_teacher, visible_to_student]);
    const pollId = resPoll.insertId;

    const optionPromises = options.map(option => {
      return connection.query(`
        INSERT INTO poll_option (poll_id, option_text)
        VALUES (?, ?)`, [pollId, option]);
    });

    await Promise.all(optionPromises);

    await connection.commit();
    connection.release();

    result(null, { id: pollId, ...newPoll });
  } catch (err) {
    console.error('Error:', err);
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    result(err, null);
  }
};

Poll.getAll = async (result) => {
  try {
    const [rows] = await pool.query('SELECT * FROM poll');
    result(null, rows);
  } catch (err) {
    console.error('Error:', err);
    result(err, null);
  }
};

Poll.getTeachersPoll = async (result) => {
  try {
    const [rows] = await pool.query('SELECT * FROM poll WHERE visible_to_teacher = 1');
    result(null, rows);
  } catch (err) {
    console.error(err);
    result(err, null);
  }
};

Poll.getStudentsPoll = async (result) => {
  try {
    const [rows] = await pool.query('SELECT * FROM poll WHERE visible_to_student = 1');
    result(null, rows);
  } catch (err) {
    console.error(err);
    result(err, null);
  }
};

module.exports = Poll;
