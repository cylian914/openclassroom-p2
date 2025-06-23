const express = require('express');
const auth = require ("../middleware/auth")
const bookCtrl = require("../../controllers/book")


const router = express.Router();

router.get("/", bookCtrl.books);

module.exports = router;