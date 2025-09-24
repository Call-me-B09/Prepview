const axios = require("axios");
const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// 🔹 Main transcription function
async function transcribeAudio(fileBuffer) {
  try {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Invalid or empty file buffer");
    }

    // 1️⃣ Upload file directly via axios
    const uploadResp = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      fileBuffer,
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          "content-type": "application/octet-stream",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const uploadUrl = uploadResp.data.upload_url;
    if (!uploadUrl) throw new Error("AssemblyAI did not return an upload URL");

    console.log("✅ Upload successful:", uploadUrl);

    // 2️⃣ Start transcription
    const transcriptJob = await client.transcripts.create({ audio_url: uploadUrl });
    console.log("📄 Transcript job started:", transcriptJob.id);

    // 3️⃣ Poll until transcription completes
    let result;
    while (true) {
      result = await client.transcripts.get(transcriptJob.id);
      if (result.status === "completed") {
        console.log("✅ Transcription completed");
        break;
      }
      if (result.status === "error") {
        throw new Error(`AssemblyAI error: ${result.error}`);
      }
      console.log("⏳ Waiting for transcription...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    // 4️⃣ Return the transcribed text
    return result.text;

  } catch (error) {
    console.error("❌ Transcription error:", error.message || error);
    throw error;
  }
}

module.exports = { transcribeAudio };
