const router = require('express').Router();
const controller = require("./controller");
const auth = require('../../../middleware/auth');

router.use(auth);

router.get('/info', controller.getUserInfo);
router.get('/search', controller.searchUser);
router.get('/rank', controller.pagingRanking);

module.exports = router;