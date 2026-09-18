const { sql, ensureSchema } = require("./db");

function rowToActivity(row) {
  return {
    id: row.id,
    type: row.type,
    label: row.label,
    category: row.category,
    unit: row.unit,
    quantity: Number(row.quantity),
    co2Kg: Number(row.co2_kg),
    suspicious: row.suspicious,
    date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}

async function insertActivity(activity) {
  await ensureSchema();
  await sql`
    INSERT INTO activities (id, type, label, category, unit, quantity, co2_kg, suspicious, date, created_at)
    VALUES (${activity.id}, ${activity.type}, ${activity.label}, ${activity.category}, ${activity.unit},
            ${activity.quantity}, ${activity.co2Kg}, ${activity.suspicious}, ${activity.date}, ${activity.createdAt})
  `;
  return activity;
}

async function getAllActivities() {
  await ensureSchema();
  const rows = await sql`SELECT * FROM activities ORDER BY created_at DESC`;
  return rows.map(rowToActivity);
}

async function getFilteredActivities({ type, from, to } = {}) {
  const all = await getAllActivities();
  return all.filter((a) => {
    if (type && a.type !== type) return false;
    if (from && a.date < from) return false;
    if (to && a.date > to) return false;
    return true;
  });
}

async function getWeeklyTargetKg() {
  await ensureSchema();
  const rows = await sql`SELECT weekly_target_kg FROM settings WHERE id = 1`;
  return rows.length ? Number(rows[0].weekly_target_kg) : 50;
}

async function setWeeklyTargetKg(value) {
  await ensureSchema();
  await sql`
    INSERT INTO settings (id, weekly_target_kg) VALUES (1, ${value})
    ON CONFLICT (id) DO UPDATE SET weekly_target_kg = EXCLUDED.weekly_target_kg
  `;
  return value;
}

module.exports = {
  insertActivity,
  getAllActivities,
  getFilteredActivities,
  getWeeklyTargetKg,
  setWeeklyTargetKg,
};
