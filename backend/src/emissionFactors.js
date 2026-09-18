const ACTIVITY_TYPES = {
  car: { label: "Car travel", unit: "km", factor: 0.20, category: "transport", perUnit: true, sanityMax: 2000 },
  bus: { label: "Bus travel", unit: "km", factor: 0.08, category: "transport", perUnit: true, sanityMax: 2000 },
  flight: { label: "Flight", unit: "km", factor: 0.25, category: "transport", perUnit: true, sanityMax: 20000 },
  electricity: { label: "Electricity use", unit: "kWh", factor: 0.80, category: "energy", perUnit: true, sanityMax: 2000 },
  veg_meal: { label: "Vegetarian meal", unit: "meal", factor: 0.5, category: "food", perUnit: false, sanityMax: 20 },
  nonveg_meal: { label: "Non-vegetarian meal", unit: "meal", factor: 2.0, category: "food", perUnit: false, sanityMax: 20 },
};

function calculateCo2Kg(type, quantity) {
  const def = ACTIVITY_TYPES[type];
  if (!def) return null;
  return Number((def.factor * quantity).toFixed(3));
}

function isSuspicious(type, quantity) {
  const def = ACTIVITY_TYPES[type];
  if (!def) return false;
  return quantity > def.sanityMax;
}

module.exports = { ACTIVITY_TYPES, calculateCo2Kg, isSuspicious };
