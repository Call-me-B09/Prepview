const express = require("express");
const multer = require("multer");
const { uploadAudioAnswer } = require("../controllers/audiocontroller");

const router = express.Router();
const upload = multer();

router.post("/upload-audio", upload.single("audio"), uploadAudioAnswer);

module.exports = router;
