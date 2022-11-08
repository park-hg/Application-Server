const router = require('express').Router();
const controller = require("./controller");
const auth = require('../../../middleware/auth');

router.use(auth);
// 채점 서버
router.post('/', controller.judgeLambda);
module.exports = router;