const express = require("express");
const { getAllActivities, getWeeklyTargetKg } = require("../store");
const { currentIsoWeekRange } = require("../week");

const router = express.Router();

// GET /api/summary - all-time total + byType breakdown + current weekly-target state
router.get("/", async (req, res, next) => {
  try {
    const activities = await getAllActivities();

    const totalCo2Kg = Number(activities.reduce((sum, a) => sum + a.co2Kg, 0).toFixed(3));

    const byType = {};
    for (const a of activities) {
      byType[a.type] = Number(((byType[a.type] || 0) + a.co2Kg).toFixed(3));
    }

    const weeklyTargetKg = await getWeeklyTargetKg();
    const { start, end } = currentIsoWeekRange();
    const weekTotalKg = activities
      .filter((a) => a.date >= start && a.date <= end)
      .reduce((sum, a) => sum + a.co2Kg, 0);
    const targetExceeded = weekTotalKg > weeklyTargetKg;

    res.json({
      totalCo2Kg,
      byType,
      weeklyTargetKg,
      targetExceeded,
      weekTotalKg: Number(weekTotalKg.toFixed(3)),
      weekStart: start,
      weekEnd: end,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
