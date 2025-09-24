const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Hit this endpoint when all answers are added
router.post("/create-session", reviewController.createSessionFromQuestions);

module.exports = router;
