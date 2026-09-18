const express = require("express");
const { getWeeklyTargetKg, setWeeklyTargetKg } = require("../store");

const router = express.Router();

// GET /api/target - current weekly target
router.get("/", async (req, res, next) => {
  try {
    const weeklyTargetKg = await getWeeklyTargetKg();
    res.json({ weeklyTargetKg });
  } catch (err) {
    next(err);
  }
});

// PUT /api/target - set the weekly target, body: { weeklyTargetKg }
router.put("/", async (req, res, next) => {
  try {
    const value = Number(req.body?.weeklyTargetKg);
    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({
        error: "invalid_target",
        message: "weeklyTargetKg must be a positive number",
      });
    }
    const weeklyTargetKg = await setWeeklyTargetKg(value);
    res.json({ weeklyTargetKg });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
