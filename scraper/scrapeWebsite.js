const axios = require('axios');
const cheerio = require('cheerio');

// Function to scrape a single website
 module.exports = async function scrapeWebsite(site) {
    try {
        //Fetch the website data
        const response = await axios.get(site.url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        //page = page
        const page = site.page;
        //Load website data to Cherrio
        const $ = cheerio.load(response.data);
        
        if (site.url == 'https://www.washingtonpost.com/') {
            console.log(response.data);
        }

        // console.log("response header: " + response.data);


        // Get article title and URL
        const title = $(site.titleSelector).first().text().trim();
        let url = $(site.urlSelector).first().attr('href');    
        console.log("-----------------------------------------")
        console.log(`scrapeWebsite site.name: ${site.name}`)
        console.log(`${site.name} title: ${title}`)
        console.log(`${site.name} url: ${url}`)

        //TEST
        let site_icon_url = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || $('link[rel="shortcut icon mask-icon"]').attr('href');
        console.log(`'site_icon_url	 for' ${site.name} : ${site_icon_url	}`);

        // Ensure the URL is absolute
        if (url && !url.startsWith('http')) {
            let baseUrl = new URL(site.url).origin;
            url = new URL(url, baseUrl).href;
            console.log("HAS A FIXED URL: " + url)
        }

        let website;
        if (url) {
            website = new URL(site.url).origin;
            
            console.log("website: " + website)

        }

        // scrape 
        // website favicon
        if (site_icon_url && !site_icon_url.startsWith('http')) {
            const baseSiteIconUrl = new URL(url).origin
            console.log (`baseSiteIconURL for ${site.name}: ${baseSiteIconUrl} `)
            site_icon_url = new URL(site_icon_url, baseSiteIconUrl).href;
        }
        // make sure we have some day for title, url and site_icon_url
        if (title && url && site_icon_url	) {
            return { title, url, site_icon_url, page, website, source: site.name };
        } else {
            console.warn(`No title or URL found for ${site.name}`);
            return null;
        }
    } catch (error) {
        console.error(`Error scraping ${site.name}:`, error.message);
        return null;
    }
}

            // let appendUrl = site.urlEnding;
            // console.log("appendUrl: " + appendUrl)
            // if (appendUrl) {
            //     baseUrl = baseUrl + appendUrl;
            //     url = new URL(url, baseUrl).href;

            //     console.log ('appendedUrl')
            // }