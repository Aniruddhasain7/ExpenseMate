const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  generateAudit,
  chatWithCopilot,
} = require("../controllers/copilotController");

const router = express.Router();

router.post("/audit", protect, generateAudit);
router.post("/chat", protect, chatWithCopilot);

module.exports = router;
