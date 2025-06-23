const express = require('express');
const auth = require ("../middleware/auth")
const bookCtrl = require("../../controllers/book")


const router = express.Router();

router.get("/", bookCtrl.books);
router.get("/:id", bookCtrl.id)
router.get("/bestrating", bookCtrl.bestrating)

router.post("/", auth,  bookCtrl.books);
router.put("/:id", auth,  bookCtrl.id)
router.delete("/:id", auth,  bookCtrl.id)
router.post("/bestrating", auth,  bookCtrl.bestrating)

module.exports = router;