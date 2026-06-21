const express = require('express');
const app = express();
const cron = require('node-cron');

//CORS
const cors = require('cors');
app.use(cors())

//deleted
// app.use(express.json());

//MIKE imports//
const scrapeAllSites = require('./scraper/scrapeAllSites')
const { router: articlesRouter, warmCache } = require('./routes/articles');

//EXPRESS - need to update port once I move it to railway
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Routes
app.use('/api', articlesRouter);

// Initial scrape + cache warm on startup
scrapeAllSites().then(() => warmCache());

// Re-scrape every 60 minutes, then re-warm cache
cron.schedule('*/60 * * * *', () => scrapeAllSites().then(() => warmCache()));


