function isoWeekRange(dateStr) {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  const day = d.getUTCDay(); 
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const toStr = (x) => x.toISOString().slice(0, 10);
  return { start: toStr(monday), end: toStr(sunday) };
}

function currentIsoWeekRange() {
  return isoWeekRange(new Date().toISOString().slice(0, 10));
}

module.exports = { isoWeekRange, currentIsoWeekRange };
