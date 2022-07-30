const router = require('express').Router();
const controller = require("./controller");

router.post('/get-info', controller.getGitInfo);
router.post('/getUserInfo', controller.getUserInfo);
router.get('/getMyInfo', controller.getMyInfo);

module.exports = router;