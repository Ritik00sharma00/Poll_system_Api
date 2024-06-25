const Poll = require('../Model/polls_model');

const createPoll = async (req, res) => {
  const { poll_name, poll_question, visible_to_teacher, visible_to_student, options } = req.body;

  if (!Array.isArray(options) || options.length < 2 || options.length > 5) {
    return res.status(400).send('Options must be an array with 2 to 5 items.');
  }

  const newPoll = {
    poll_name,
    poll_question,
    visible_to_teacher,
    visible_to_student,
  };

  Poll.create(newPoll, options, (err, data) => {
    if (err) {
      console.error('Error creating poll:', err);
      res.status(500).send('Error creating poll');
    } else {
      res.status(201).send('Poll created successfully');
    }
  });
};

const getAllPolls = async (req, res) => {
  Poll.getAll((err, data) => {
    if (err) {
      console.error('Error fetching polls:', err);
      res.status(500).send('Error fetching polls');
    } else {
      res.status(200).json(data);
    }
  });
};
const getTeachersPolls = async (req, res) => {
  Poll.getTeachersPoll((err, data) => {
    if (err) {
      console.error('Error fetching teacher polls:', err);
      res.status(500).send('Error fetching teacher polls');
    } else {
      res.status(200).json(data);
    }
  });
};

const getStudentsPolls = async (req, res) => {
  Poll.getStudentsPoll((err, data) => {
    if (err) {
      console.error('Error fetching student polls:', err);
      res.status(500).send('Error fetching student polls');
    } else {
      res.status(200).json(data);
    }
  });
};

module.exports = {
  createPoll,
  getAllPolls,
  getTeachersPolls,
  getStudentsPolls,
};
