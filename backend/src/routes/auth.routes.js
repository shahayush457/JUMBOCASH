const router = require('express').Router();
const handle = require('../controllers/auth.controller');

router.get('/', handle.getUsers); // for development only
router.post('/login', handle.login);
router.post('/register', handle.register);

module.exports = router;
