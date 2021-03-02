const router = require('express').Router();
const handle = require('../controllers/entity.controller');
const auth = require('../middlewares/isAuthenticated.jwt');

router
  .route('/')
  .get(auth, handle.userEntities)
  .post(auth, handle.createEntity)


router.get('/:id', handle.getEntity);

module.exports = router;

