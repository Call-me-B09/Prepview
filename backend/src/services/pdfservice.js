const axios = require("axios");
const FormData = require("form-data");
const dotenv = require("dotenv");
dotenv.config();

async function extractPdfText(fileBuffer) {
  try {
    const form = new FormData();
    form.append("file", fileBuffer, "cv.pdf");
    form.append("language", "eng");
    form.append("isOverlayRequired", "false");
  console.log(process.env.OCRSPACE_API_KEY);

    const res = await axios.post("https://api.ocr.space/parse/image", form, {
      headers: {
        ...form.getHeaders(),
        apikey: process.env.OCRSPACE_API_KEY
      },
      maxBodyLength: Infinity
    });

    if (res.data && res.data.ParsedResults && res.data.ParsedResults.length > 0) {
      const fullText = res.data.ParsedResults.map(p => p.ParsedText).join("\n").trim();
      return { text: fullText, numPages: res.data.ParsedResults.length };
    } else {
      return { text: "", numPages: 0 };
    }

  } catch (err) {
    console.error("OCR PDF parsing error:", err);
    throw new Error("Failed to parse PDF via OCR.");
  }
}

module.exports = { extractPdfText };
