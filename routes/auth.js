const express = require('express');
const router = express.Router();
const autoController = require('../controllers/auth');

router.get("/login", autoController.getLogIn);
router.post("/login", autoController.postLogIn);
router.post("/logout", autoController.postLogOut);


module.exports = router;