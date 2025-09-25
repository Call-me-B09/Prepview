const Session = require("../models/session"); // Add this

exports.getAllSessions = async (req, res) => {
  try {
    const { userId } = req.query; // get from query
    console.log("UserId received:", userId); // debug log

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};
