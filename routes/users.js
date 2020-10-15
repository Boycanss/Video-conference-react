var express = require('express');
var router = express.Router();

//import controller 
const UserController = require('../api/controllers/userController');

/* GET users listing. */

//REGISTER
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new UserController(name, email, password);
  newUser.register(req, res);
})

//LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const logUser = new UserController('', email, password);
  logUser.login(req, res);
})

module.exports = router;
