require('dotenv').config();

const pool = require('./dbConfig');

module.exports = async function saveToDatabase(article) {
    if (!article) return;

    try {
        const query = 'INSERT INTO articles (title, url, source, site_icon_url, website, page) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.execute(query, [article.title, article.url, article.source, article.site_icon_url, article.website, article.page]);
        console.log(`Saved article from ${article.source}: ${article.title}`);
    } catch (error) {
        console.error(`Error saving to database for ${article.source}:`, error.message);
    }
}