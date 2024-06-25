const User = require('../Model/user_model').User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const utils=require('../utils/auth')

const createUser = (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role
  });

  User.create(newUser, (err, user) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json(user);
  });
};



 
const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    User.findByEmail(email, async (err, user) => {
      if (err) {
        if (err.kind === 'not_found') {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

      
        utils.generateToken({ userId: user.id}); 
          sessionStorage.setItem('token',token);
  
        res.status(200).json({ message: 'Login successful'},token);
      } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
  };
    

module.exports = {
  createUser,
  loginUser
}
