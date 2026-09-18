require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`PlanetPulse API listening on http://localhost:${PORT}`);
});
