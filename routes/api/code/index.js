const router = require('express').Router();
const controller = require('./controller');
const auth = require('../../../middleware/auth');

router.use(auth);
router.get('/', controller.getCode);

module.exports = router;