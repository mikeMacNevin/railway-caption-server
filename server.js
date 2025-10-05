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
const articlesRouter = require('./routes/articles');

//EXPRESS - need to update port once I move it to railway
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//Routes
app.use('/api', articlesRouter);

// Initial run
scrapeAllSites();
// Check for updates every 30 minutes d
cron.schedule('*/30 * * * *', scrapeAllSites); 


