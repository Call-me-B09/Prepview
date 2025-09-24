const express = require("express");
const router = express.Router();
const { getAllSessions } = require("../controllers/sessioncontroller.js");

// GET /api/sessions
router.get("/sessions", getAllSessions);

module.exports = router;
