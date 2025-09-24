const express = require("express");
const multer = require("multer");
const { uploadPdf } = require("../controllers/pdfcontroller.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadPdf);

// 👇 use CommonJS export
module.exports = router;
