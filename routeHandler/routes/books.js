const express = require('express');
const auth = require ("../middleware/auth")
const bookCtrl = require("../../controllers/book");
const fileHandler = require("../middleware/multer-config")

const router = express.Router();

router.get("/", bookCtrl.books);
router.get("/bestrating", bookCtrl.bestrating)
router.get("/:id", bookCtrl.id)

router.post("/", auth, fileHandler, bookCtrl.addBooks);
router.put("/:id", auth, fileHandler, bookCtrl.modifyBooks)
router.delete("/:id", auth,  bookCtrl.deleteBooks)
router.post("/:id/rating", auth, fileHandler, bookCtrl.rateBooks)

module.exports = router;