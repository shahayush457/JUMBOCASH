const router = require('express').Router();
const handle = require('../controllers/entity.controller');
const auth = require('../middlewares/isAuthenticated.jwt');


router
  .route('/')
  .get(auth, handle.userEntities) // to give entities added by user
  .post(auth, handle.createEntity)// to create a entity of a user


router.get('/:id', handle.getEntity); // to get a specific entity

module.exports = router;

