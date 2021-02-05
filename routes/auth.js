const express = require('express');
const router = express.Router();
const autoController = require('../controllers/auth');

router.get("/login", autoController.getLogin);
router.post("/login", autoController.postLogin);


module.exports = router;