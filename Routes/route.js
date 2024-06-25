const express = require('express');
const userController = require('../Controller/user_controller'); 
const poll_controller = require('../Controller/poll_controller');
const Auth_middleware=require('../Middlewares/Authentication');

const router = express.Router();

router.post('/register', userController.createUser);

router.get('/login', userController.loginUser);

router.use(Auth_middleware);

router.post('/createPoll', poll_controller.createPoll);

router.get('/getAllPolls', poll_controller.getAllPolls);

router.get('/getStudentPolls', poll_controller.getStudentsPolls);

router.get('/getTeacherPolls', poll_controller.getTeachersPolls);



module.exports = router;

