const express = require("express");
const { getOverview, getWeeklyActivity, getByStatus, getByPriority, getRecentActivity, getUpcoming } = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(protect);

router.get("/overview", getOverview);
router.get("/weekly", getWeeklyActivity);
router.get("/by-status", getByStatus);
router.get("/by-priority", getByPriority);
router.get("/recent", getRecentActivity);
router.get("/upcoming", getUpcoming);

module.exports = router;
