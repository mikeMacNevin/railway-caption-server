const express = require('express');
const app = express();
const cron = require('node-cron');

//CORS
const cors = require('cors');
app.use(cors())

//deleted
// app.use(express.json());

//MIKE imports//
const { router: articlesRouter, warmCache } = require('./routes/articles');

//EXPRESS - need to update port once I move it to railway
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Routes
app.use('/api', articlesRouter);

// The actual scraping now runs in its own process (scrapeWorker.js) so a
// ~180-site scrape cycle never competes with serving visitor requests here.
// This process only ever reads what that worker has already saved to the
// database - warm the cache from whatever's there on boot, then keep it
// fresh on the same cadence the scraper used to run on. Individual pages
// still self-heal on a cache miss via the TTL check in articles.js, so this
// is purely a cold-start optimization, not a correctness requirement.
warmCache();
cron.schedule('*/60 * * * *', warmCache);
