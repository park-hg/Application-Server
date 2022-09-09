const router = require('express').Router();
const controller = require("./controller");

router.get('/', controller.getGitInfo);

module.exports = router;