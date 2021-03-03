const router = require('express').Router();
const handle = require('../controllers/auth.controller');

router.get('/', handle.getUsers); // for development only
router.post('/login', handle.login);// for loging in
router.post('/register', handle.register);// for registering

module.exports = router;
