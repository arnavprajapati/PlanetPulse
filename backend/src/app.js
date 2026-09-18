const express = require("express");
const cors = require("cors");

const activitiesRouter = require("./routes/activities");
const footprintRouter = require("./routes/footprint");
const summaryRouter = require("./routes/summary");
const targetRouter = require("./routes/target");
const { ACTIVITY_TYPES } = require("./emissionFactors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/activity-types", (req, res) => {
  res.json({ activityTypes: ACTIVITY_TYPES });
});

app.use("/api/activities", activitiesRouter);
app.use("/api/footprint", footprintRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/target", targetRouter);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal_error", message: "Something went wrong." });
});

module.exports = app;
