const express = require('express');
const router = express.Router();

const { getLatestSummary, getSummaryForDate, listSummaryDates } = require('../db/summaries');

// A briefing only changes every few hours, so there's no reason to hit the
// database on every page view.
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map(); // key -> { data, fetchedAt }

async function cached(key, load) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.fetchedAt < CACHE_TTL_MS) return hit.data;
  const data = await load();
  // Don't cache "nothing yet" - the first briefing should show up as soon as
  // the worker writes it.
  if (data && (!Array.isArray(data) || data.length > 0)) cache.set(key, { data, fetchedAt: Date.now() });
  return data;
}

// The worker creates the table on its first run; until then there's simply
// no briefing, not a server error.
function handleError(res, err) {
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(404).json({ message: 'No briefing available yet' });
  }
  console.error('Error fetching summary:', err);
  return res.status(500).json({ message: 'Internal server error' });
}

router.get('/summary', async (req, res) => {
  try {
    const summary = await cached('latest', getLatestSummary);
    if (!summary) return res.status(404).json({ message: 'No briefing available yet' });
    res.status(200).json(summary);
  } catch (err) {
    handleError(res, err);
  }
});

// Must be registered before '/summary/:date' or "archive" would be read as a date.
router.get('/summary/archive', async (req, res) => {
  try {
    const dates = await cached('archive', () => listSummaryDates());
    res.status(200).json({ briefings: dates || [] });
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return res.status(200).json({ briefings: [] });
    handleError(res, err);
  }
});

router.get('/summary/:date', async (req, res) => {
  const { date } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: 'Date must be YYYY-MM-DD' });
  }

  try {
    const summary = await cached(`date:${date}`, () => getSummaryForDate(date));
    if (!summary) return res.status(404).json({ message: 'No briefing for that date' });
    res.status(200).json(summary);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
