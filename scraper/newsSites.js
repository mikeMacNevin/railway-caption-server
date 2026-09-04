module.exports = [

    /* Start Travel */

    // error 403
    // {
    //     name: 'Travel Weekly',
    //     url: 'https://www.travelweekly.com/',
    //     titleSelector: 'div.story span.title-xxxl',
    //     urlSelector: 'div.story a.text-block', 
    //     page: 'travel'
    // },

    {
        name: 'Skift',
        url: 'https://skift.com/',
        titleSelector: 'h3.c-tease__title',
        urlSelector: 'h3.c-tease__title > a', 
        page: 'travel'
    },

    // error 403
    // {
    //     name: 'Travel Pulse',
    //     url: 'https://www.travelpulse.com/news',
    //     titleSelector: 'div.hero-image-grid-item div.text',
    //     urlSelector: 'div.hero-image-grid-item > a.link-wrapper', 
    //     page: 'travel'
    // },
    // error 403
    // {
    //     name: 'Travel and Leisure',
    //     url: 'https://www.travelandleisure.com/',
    //     titleSelector: 'div#card-list_2-0 span.card__title-text ',
    //     urlSelector: 'div#card-list_2-0 a#mntl-card-list-items_5-0',
    //     page: 'travel'
    // },

    // {
    //     name: 'National Geographic',
    //     url: 'https://www.nationalgeographic.com/travel',
    //     titleSelector: 'a.PromoTile__Link > span',
    //     urlSelector: 'a.PromoTile__Link"', 
    //     page: 'travel'
    // },
    // consistently times out
    // {
    //     name: 'US News',
    //     url: 'https://travel.usnews.com/',
    //     titleSelector: 'a.Anchor-byh49a-0 > h3',
    //     urlSelector: 'a.Anchor-byh49a-0',
    //     page: 'travel'
    // },
    {
        name: 'Conde Nast Traveler',
        url: 'https://www.cntraveler.com/',
        titleSelector: 'a.SummaryItemHedLink-chBZvf > div.SummaryItemHedBase-eapJVq ',
        urlSelector: 'a.SummaryItemHedLink-chBZvf', 
        page: 'travel'
    },
    {
        name: 'Afar',
        url: 'https://www.afar.com/',
        titleSelector: 'div.PagePromo-title > a',
        urlSelector: 'div.PagePromo-title > a', 
        page: 'travel'
    },
    {
        name: 'Time Out',
        url: 'https://www.timeout.com/travel',
        titleSelector: 'a[data-testid="tile-link_testID"] h3[data-testid="tile-title_testID"]',
        urlSelector: 'a[data-testid="tile-link_testID"]',
        page: 'travel'
    },

    // 403
    // {
    //     name: 'Travel Pulse',
    //     url: 'https://www.travelpulse.com/',
    //     titleSelector: 'div.hero-image-with-options div.position-absolute',
    //     urlSelector: 'div.hero-image-with-options > a',
    //     page: 'travel'
    // },

    {
        name: 'Lonely Planet',
        url: 'https://www.lonelyplanet.com/articles',
        titleSelector: 'a.card-link > span.text-headline-05',
        urlSelector: 'a.card-link',
        page: 'travel'
    },
    {
        name: "Fodor's",
        url: 'https://www.fodors.com/news',
        titleSelector: 'a.post-title',
        urlSelector: 'a.post-title',
        page: 'travel'
    },
    {
        name: 'SmarterTravel',
        url: 'https://www.smartertravel.com',
        titleSelector: 'a.highlight-article-card__title',
        urlSelector: 'a.highlight-article-card__title',
        page: 'travel'
    },
    {
        name: 'The Points Guy',
        url: 'https://thepointsguy.com',
        titleSelector: 'h2.tw-mt-2.tw-font-poppins.tw-text-base-semibold',
        urlSelector: "a:has(h2.tw-mt-2.tw-font-poppins.tw-text-base-semibold)",
        page: 'travel'
    },
    {
        name: 'One Mile at a Time',
        url: 'https://onemileatatime.com',
        titleSelector: 'span.h5.d-block.card-title > a',
        urlSelector: 'span.h5.d-block.card-title > a',
        page: 'travel'
    },
    {
        name: 'Thrillist Travel',
        url: 'https://www.thrillist.com/travel',
        titleSelector: "h2[data-testid='ucc-headline']",
        urlSelector: "a:has(h2[data-testid='ucc-headline'])",
        page: 'travel'
    },
    {
        name: 'Matador Network',
        url: 'https://matadornetwork.com',
        titleSelector: 'div.article-link-tile__content h2 > a',
        urlSelector: 'div.article-link-tile__content h2 > a',
        page: 'travel'
    },
    {
        name: 'Simple Flying',
        url: 'https://simpleflying.com',
        titleSelector: 'h3.display-card-title',
        urlSelector: 'h3.display-card-title > a',
        page: 'travel'
    },
    {
        name: 'Outside Online',
        url: 'https://www.outsideonline.com/adventure-travel/',
        titleSelector: 'h2.o-heading__secondary > a',
        urlSelector: 'h2.o-heading__secondary > a',
        page: 'travel'
    },
    {
        name: 'Travel Off Path',
        url: 'https://www.traveloffpath.com',
        titleSelector: 'h2.cb-post-title > a',
        urlSelector: 'h2.cb-post-title > a',
        page: 'travel'
    },
    {
        name: 'Rough Guides',
        url: 'https://www.roughguides.com',
        titleSelector: 'a.base-articles-slider__slide span.text-22',
        urlSelector: 'a.base-articles-slider__slide',
        page: 'travel'
    },
    {
        name: 'Travel Market Report',
        url: 'https://www.travelmarketreport.com',
        titleSelector: 'div.panel_txt_summary a.headlink_ts',
        urlSelector: 'div.panel_txt_summary a.headlink_ts',
        page: 'travel'
    },
    {
        name: 'International Traveller',
        url: 'https://www.internationaltraveller.com',
        titleSelector: 'h2.title-formatted',
        urlSelector: 'a:has(h2.title-formatted)',
        page: 'travel'
    },
    {
        name: 'Nomadic Matt',
        url: 'https://www.nomadicmatt.com/travel-blog/',
        titleSelector: 'h2.entry-title > a',
        urlSelector: 'h2.entry-title > a',
        page: 'travel'
    },
    {
        name: 'World Nomads',
        url: 'https://www.worldnomads.com/travel-safety/travel-tips',
        titleSelector: 'a.ContentCard .ContentCard-title',
        urlSelector: 'a.ContentCard',
        page: 'travel'
    },
    // NOTE: cards are travel deals, not editorial headlines - still passes scraper logic
    {
        name: 'Travelzoo',
        url: 'https://www.travelzoo.com',
        titleSelector: 'li.deal-module h3.deal-headline',
        urlSelector: 'li.deal-module a',
        page: 'travel'
    },
    {
        name: 'Business Insider Travel',
        url: 'https://www.businessinsider.com/travel',
        titleSelector: 'h3.tout-title > a.tout-title-link',
        urlSelector: 'h3.tout-title > a.tout-title-link',
        page: 'travel'
    },
    {
        name: 'Upgraded Points',
        url: 'https://upgradedpoints.com',
        titleSelector: 'a.postTitle',
        urlSelector: 'a.postTitle',
        page: 'travel'
    },
    {
        name: 'Travel Noire',
        url: 'https://travelnoire.com',
        titleSelector: 'a.article-link.title',
        urlSelector: 'a.article-link.title',
        page: 'travel'
    },
    {
        name: 'Robb Report Travel',
        url: 'https://robbreport.com/travel',
        titleSelector: 'h3.entry__heading > a',
        urlSelector: 'h3.entry__heading > a',
        page: 'travel'
    },

    /* END TRAVEL */

        {
       name: 'CNN Health',
        url: 'https://www.cnn.com/health',
        titleSelector: '.container_lead-plus-headlines-with-images__item span.container__headline-text',
        urlSelector: 'li.container__item > a', 
        page: 'health'
    },

    //error 403
    // {
    //    name: 'Healthline',
    //     url: 'https://www.healthline.com/',
    //     titleSelector: 'div.css-1el24i5 > a',
    //     urlSelector: 'div.css-1el24i5 > a', 
    //     page: 'health'
    // },
    // {
    //    name: 'Web MD',
    //     url: 'https://www.webmd.com/news/default.htm',
    //     titleSelector: 'section.news-toc-section span.description',
    //     urlSelector: 'section.news-toc-section a', 
    //     page: 'health'
    // },
    
    //error 403
    // {
    //    name: 'NIH.gov',
    //     url: 'https://www.nih.gov/news-events/news-releases',
    //     titleSelector: 'ul.thumbnail-teaser-list a.thumbnail-teaser__link',
    //     urlSelector: 'ul.thumbnail-teaser-list a.thumbnail-teaser__link', 
    //     page: 'health'
    // },
    {
       name: 'MedicineNet',
        url: 'https://www.medicinenet.com/',
        titleSelector: 'section.promo h3',
        urlSelector: 'section.promo a', 
        page: 'health'
    },
        {
       name: 'Everyday Health',
        url: 'https://www.everydayhealth.com/',
        titleSelector: 'article.homepage-hero__primary a',
        urlSelector: 'article.homepage-hero__primary a', 
        page: 'health'
    },
    // error 403
    // {
    //    name: 'Mayo Clinic',
    //     url: 'https://mcpress.mayoclinic.org/health-letter/',
    //     titleSelector: 'h3.card__title',
    //     urlSelector: 'div.card__content > a.card__link--title',
    //     page: 'health'
    // },
    {
       name: 'Medical News Today',
        url: 'https://www.medicalnewstoday.com/',
        titleSelector: 'a.css-vbjels',
        urlSelector: 'a.css-vbjels', 
        page: 'health'
    },
    //403
    // {
    //    name: 'Cleveland Clinic',
    //     url: 'https://newsroom.clevelandclinic.org/',
    //     titleSelector: 'h5.text-gray-900 > a',
    //     urlSelector: 'h5.text-gray-900 > a', 
    //     page: 'health'
    // },
    {
       name: 'Cleveland Clinic',
        url: 'https://newsroom.clevelandclinic.org/',
        titleSelector: 'h5.text-gray-900 > a',
        urlSelector: 'h5.text-gray-900 > a',
        page: 'health'
    },
    {
        name: 'Harvard Health',
        url: 'https://www.health.harvard.edu/',
        titleSelector: 'a.article-card h3',
        urlSelector: 'a.article-card',
        page: 'health'
    },
    {
        name: 'STAT News',
        url: 'https://www.statnews.com/',
        titleSelector: 'h3.heading > a',
        urlSelector: 'h3.heading > a',
        page: 'health'
    },
    {
        name: 'HealthDay',
        url: 'https://www.healthday.com/',
        titleSelector: 'a[aria-label="headline"] h3',
        urlSelector: 'a[aria-label="headline"]',
        page: 'health'
    },
    {
        name: 'Prevention',
        url: 'https://www.prevention.com/',
        titleSelector: 'h3.css-15kqq82 > a',
        urlSelector: 'h3.css-15kqq82 > a',
        page: 'health'
    },
    {
        name: 'NPR Health Shots',
        url: 'https://www.npr.org/sections/health-shots/',
        titleSelector: 'article.item.has-image h2.title',
        urlSelector: 'article.item.has-image h2.title > a',
        page: 'health'
    },
    {
        name: 'Psychology Today',
        url: 'https://www.psychologytoday.com/us',
        titleSelector: 'h2.teaser-lg__title > a',
        urlSelector: 'h2.teaser-lg__title > a',
        page: 'health'
    },
    {
        name: 'KFF Health News',
        url: 'https://kffhealthnews.org/',
        titleSelector: 'h2.wp-block-kff-shared-post-card__heading > a',
        urlSelector: 'h2.wp-block-kff-shared-post-card__heading > a',
        page: 'health'
    },
    {
        name: 'Fierce Healthcare',
        url: 'https://www.fiercehealthcare.com/',
        titleSelector: 'h3.element-title > a',
        urlSelector: 'h3.element-title > a',
        page: 'health'
    },
    {
        name: 'MedCity News',
        url: 'https://medcitynews.com/',
        titleSelector: 'h3.post-card__title > a',
        urlSelector: 'h3.post-card__title > a',
        page: 'health'
    },
    {
        name: 'Endpoints News',
        url: 'https://endpts.com/',
        titleSelector: 'h1.epn_headline > a',
        urlSelector: 'h1.epn_headline > a',
        page: 'health'
    },
    {
        name: 'Drugs.com News',
        url: 'https://www.drugs.com/news/',
        titleSelector: 'h2.ddc-media-title > a',
        urlSelector: 'h2.ddc-media-title > a',
        page: 'health'
    },
    {
        name: 'UCLA Health',
        url: 'https://www.uclahealth.org/news',
        titleSelector: 'h3.card__title > a',
        urlSelector: 'h3.card__title > a',
        page: 'health'
    },
    {
        name: 'ScienceDaily Health',
        url: 'https://www.sciencedaily.com/news/health_medicine/',
        titleSelector: 'div.latest-head > a',
        urlSelector: 'div.latest-head > a',
        page: 'health'
    },
    {
        name: 'Consumer Reports Health',
        url: 'https://www.consumerreports.org/health/',
        titleSelector: 'a.cda-cia__topic h3.cda-cia__topic-title-category',
        urlSelector: 'a.cda-cia__topic:has(h3.cda-cia__topic-title-category)',
        page: 'health'
    },
    {
        name: 'Men\'s Health',
        url: 'https://www.menshealth.com/',
        titleSelector: 'h3.css-15kqq82 > a',
        urlSelector: 'h3.css-15kqq82 > a',
        page: 'health'
    },
    {
        name: 'Women\'s Health',
        url: 'https://www.womenshealthmag.com/',
        titleSelector: 'h3.css-15kqq82 > a',
        urlSelector: 'h3.css-15kqq82 > a',
        page: 'health'
    },
    {
        name: 'Runner\'s World Health',
        url: 'https://www.runnersworld.com/health-injuries/',
        titleSelector: 'a[data-theme-key="custom-item"] h3',
        urlSelector: 'a[data-theme-key="custom-item"]',
        page: 'health'
    },
    {
        name: 'Self Health',
        url: 'https://www.self.com/health',
        titleSelector: 'a.SummaryItemHedLink-chBZvf > h3',
        urlSelector: 'a.SummaryItemHedLink-chBZvf',
        page: 'health'
    },
    {
        name: 'Healio',
        url: 'https://www.healio.com/',
        titleSelector: 'a.article-mug > h3.card-title',
        urlSelector: 'a.article-mug',
        page: 'health'
    },
    {
        name: 'Fierce Biotech',
        url: 'https://www.fiercebiotech.com/',
        titleSelector: 'h3.element-title > a',
        urlSelector: 'h3.element-title > a',
        page: 'health'
    },
    // End Health
    // Start Science

    //403
    // {
    //    name: 'Science.org',
    //     url: 'https://www.science.org/news/',
    //     titleSelector: 'h3.grid-hero-teaser > a',
    //     urlSelector: 'h3.grid-hero-teaser > a', 
    //     page: 'science'
    // },
        {
       name: 'Science News',
        url: 'https://www.sciencenews.org/',
        titleSelector: 'h3.featured-primary-three-column__title___l6a96 > a',
        urlSelector: 'h3.featured-primary-three-column__title___l6a96 > a', 
        page: 'science'
    },
    {
       name: 'Science News Explores',
        url: 'https://www.snexplores.org/',
        titleSelector: 'h3.featured-primary-three-column__title___l6a96',
        urlSelector: 'h3.featured-primary-three-column__title___l6a96 > a', 
        page: 'science'
    },
    //403
    // {
    //    name: 'Nature',
    //     url: 'https://www.nature.com/news',
    //     titleSelector: 'div.c-card__container h3.c-card__title' ,
    //     urlSelector: 'div.c-card__container a',
    //     page: 'science'
    // },

    {
        name: 'ScienceDaily',
        url: 'https://www.sciencedaily.com/',
        titleSelector: 'div.latest-head > a',
        urlSelector: 'div.latest-head > a',
        page: 'science'
    },
    {
        name: 'Live Science',
        url: 'https://www.livescience.com/',
        titleSelector: 'div.wdn-listv2-item-content-title',
        urlSelector: 'a.wdn-listv2-item-link',
        page: 'science'
    },
    {
        name: 'Popular Science',
        url: 'https://www.popsci.com/',
        titleSelector: 'h3.card-post-title',
        urlSelector: 'a.card-post-title-link',
        page: 'science'
    },
    {
        name: 'Space.com',
        url: 'https://www.space.com/',
        titleSelector: 'div.wdn-listv2-item-content-title',
        urlSelector: 'a.wdn-listv2-item-link',
        page: 'science'
    },
    {
        name: 'Astronomy Magazine',
        url: 'https://www.astronomy.com/',
        titleSelector: 'h3.card-title > a',
        urlSelector: 'h3.card-title > a',
        page: 'science'
    },
    {
        name: 'Discover Magazine',
        url: 'https://www.discovermagazine.com/',
        titleSelector: 'div.stacked-list-card h2 a',
        urlSelector: 'div.stacked-list-card h2 a',
        page: 'science'
    },
    {
        name: 'Ars Technica Science',
        url: 'https://arstechnica.com/science/',
        titleSelector: 'h2.font-serif > a',
        urlSelector: 'h2.font-serif > a',
        page: 'science'
    },
    {
        name: 'Quanta Magazine',
        url: 'https://www.quantamagazine.org/',
        titleSelector: "h3.card__title",
        urlSelector: "a[data-toggle-hover='card']",
        page: 'science'
    },
    {
        name: 'National Geographic Science',
        url: 'https://www.nationalgeographic.com/science',
        titleSelector: 'div.PromoTile__Title--mobile',
        urlSelector: 'a.PromoTile__Link',
        page: 'science'
    },
    {
        name: 'IFLScience',
        url: 'https://www.iflscience.com/',
        titleSelector: 'div.card-content--body--title',
        urlSelector: 'div.card-content--body--title > a',
        page: 'science'
    },
    {
        name: 'The Scientist',
        url: 'https://www.the-scientist.com/',
        titleSelector: 'h3.leading-tighter',
        urlSelector: 'a:has(> h3.leading-tighter)',
        page: 'science'
    },
    {
        name: 'Chemistry World',
        url: 'https://www.chemistryworld.com/',
        titleSelector: 'div.subSleeve h2 a',
        urlSelector: 'div.subSleeve h2 a',
        page: 'science'
    },
    {
        name: 'Physics World',
        url: 'https://physicsworld.com/',
        titleSelector: 'h3.article__title',
        urlSelector: 'h3.article__title > a',
        page: 'science'
    },
    {
        name: 'ScienceAlert',
        url: 'https://www.sciencealert.com/',
        titleSelector: 'div.entry-teaser a.text-h2',
        urlSelector: 'div.entry-teaser a.text-h2',
        page: 'science'
    },
    {
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/',
        titleSelector: "h3[class*='homepageStoryCard__hed']",
        urlSelector: "a:has(> h3[class*='homepageStoryCard__hed'])",
        page: 'science'
    },
    {
        name: 'Futurism',
        url: 'https://futurism.com/',
        titleSelector: 'h3.card-post-title',
        urlSelector: 'a.card-post-title-link',
        page: 'science'
    },
    {
        name: 'Big Think',
        url: 'https://bigthink.com/',
        titleSelector: 'a.card-title',
        urlSelector: 'a.card-title',
        page: 'science'
    },
    {
        name: 'NASA News',
        url: 'https://www.nasa.gov/news/',
        titleSelector: 'a.hds-content-card h3',
        urlSelector: 'a.hds-content-card',
        page: 'science'
    },
    {
        name: 'NOAA News',
        url: 'https://www.noaa.gov/news',
        titleSelector: 'div.content-wrapper div.title a',
        urlSelector: 'div.content-wrapper div.title a',
        page: 'science'
    },
    {
        name: 'Nature World News',
        url: 'https://www.natureworldnews.com/',
        titleSelector: 'li.clearfix h4',
        urlSelector: 'li.clearfix h4 > a',
        page: 'science'
    },
    {
        name: 'Interesting Engineering',
        url: 'https://interestingengineering.com/',
        titleSelector: "div[class*='t-line-clamp']",
        urlSelector: "a.t-block:has(div[class*='t-line-clamp'])",
        page: 'science'
    },

/*END SCIENCE*/
    // 520 - origin error, site down/unreachable (alternate paths /news/, /shows/ return 403)
    // {
    //     name: 'TV Insider',
    //     url: 'https://www.tvinsider.com/',
    //     titleSelector: 'div.text-bottom-left > h1',
    //     urlSelector: 'section#homepage-grid > a',
    //     page: 'tv'
    // },
    {
        name: 'TV Line',
        url: 'https://www.tvline.com/',
        titleSelector: 'div.article-description h3 a',
        urlSelector: 'div.article-description h3 a',
        page: 'tv'
    },
    // error 403
    // {
    //     name: 'Carter Matt',
    //     url: 'https://www.cartermatt.com/',
    //     titleSelector: 'h2.post-title > a',
    //     urlSelector: 'h2.post-title > a',
    //     page: 'tv'
    // },
    {
        name: 'TV Series Finale',
        url: 'https://tvseriesfinale.com/',
        titleSelector: 'h3 > a',
        urlSelector: 'h3 > a', 
        page: 'tv'
    },
    {
        name: 'Hollywood Reporter',
        url: 'https://www.hollywoodreporter.com/c/tv/tv-news/',
        titleSelector: 'h3#title-of-a-story > a.c-title__link',
        urlSelector: 'h3#title-of-a-story > a.c-title__link', 
        page: 'tv'
    },
    {
        name: 'Mashable',
        url: 'https://mashable.com/category/tv-shows',
        titleSelector: 'div.leading-normal > a.text-lg',
        urlSelector: 'div.leading-normal > a.text-lg', 
        page: 'tv'
    },
    {
        name: 'Screen Rant',
        url: 'https://screenrant.com/tv/',
        titleSelector: 'h3 a',
        urlSelector: 'h3 a',
        page: 'tv'
    },
        {
        name: 'Deadline',
        url: 'https://deadline.com/v/tv/',
        titleSelector: 'h3',
        urlSelector: 'a[href*="deadline.com"]',
        page: 'tv'
    },
    {
        name: 'Collider',
        url: 'https://collider.com/tv/',
        titleSelector: 'h5.display-card-title > a ',
        urlSelector: 'h5.display-card-title > a ', 
        page: 'tv'
    },
        {
        name: 'CBR',
        url: 'https://www.cbr.com/category/tv/',
        titleSelector: 'h3.display-card-title a',
        urlSelector: 'h3.display-card-title a',
        page: 'tv'
    },

    /* END TV */

    /* ABOVE ARE STILL IN TESTING*/

        /* START MOVIES */   
    // blocked - AWS WAF bot challenge (status 202, empty response body, no HTML to select against)
    // {
    //     name: 'IMDB',
    //     url: 'https://www.imdb.com/news/movie/?ref_=hm_nv_menu',
    //     titleSelector: 'a.sc-85efd06-2',
    //     urlSelector: 'a.sc-85efd06-2',
    //     page: 'movies'
    // },
    // error 403
    // {
    //     name: 'LetterBoxd',
    //     url: 'https://letterboxd.com/journal/',
    //     titleSelector: 'div.head h1.title',
    //     urlSelector: 'div.head a',
    //     page: 'movies'
    // },
    {
        name: 'Rotten Tomatoes',
        url: 'https://editorial.rottentomatoes.com/',
        titleSelector: 'main .news-title',
        urlSelector: 'main .news-link', 
        page: 'movies' 
    },
    {
        name: 'New York Times Movies',
        url: 'https://www.nytimes.com/section/movies',
        titleSelector: 'h3.e1hr934v2 ',
        urlSelector: 'h3.e1hr934v2 > a', 
        page: 'movies' 
    },
    {
        name: 'Indie Wire',
        url: 'https://www.indiewire.com/',
        titleSelector: 'div._text_y7yck_1 > a',
        urlSelector: 'div._text_y7yck_1 > a', 
        page: 'movies' 
    },
    {
        name: 'Screen Rant',
        url: 'https://screenrant.com/',
        titleSelector: 'h3.display-card-title > a',
        urlSelector: 'h3.display-card-title > a', 
        page: 'movies' 
    },
    {
        name: 'Slash Film',
        url: 'https://slashfilm.com/',
        titleSelector: 'div.article-description > h1',
        urlSelector: 'div.article-description a', 
        page: 'movies' 
    },
    {
        name: 'Deadline',
        url: 'https://deadline.com/v/film/',
        titleSelector: 'h3.c-title',
        urlSelector: 'h3.c-title > a', 
        page: 'movies' 
    },
    {
        name: 'Hollywood Reporter',
        url: 'https://www.hollywoodreporter.com/c/movies/',
        titleSelector: 'h3#title-of-a-story',
        urlSelector: 'h3#title-of-a-story > a', 
        page: 'movies' 
    },
    {
        name: 'Collider',
        url: 'https://collider.com/',
        titleSelector: '.w-display-card-content h3',
        urlSelector: '.w-display-card-content a', 
        page: 'movies' 
    },
    /* END MOVIES */   

    /* START VIDEO GAMES */
    {
        name: 'IGN',
        url: 'https://www.ign.com/news',
        titleSelector: 'section.main-content span.item-title',
        urlSelector: 'section.main-content a.item-body',
        page: 'videogames'
    },
    {
        name: 'kotaku',
        url: 'https://kotaku.com/games',
        titleSelector: 'div.grid h3',
        urlSelector: 'div.grid a', 
        page: 'videogames' 
    },
    {
        name: 'Polygon',
        url: 'https://www.polygon.com/',
        titleSelector: 'h3.display-card-title',
        urlSelector: 'h3.display-card-title > a', 
        page: 'videogames' 
    },
    {
        name: 'gamesradar+',
        url: 'https://www.gamesradar.com/',
        titleSelector: 'a.wdn-listv2-item-link div.wdn-listv2-item-content-title',
        urlSelector: 'a.wdn-listv2-item-link',
        page: 'videogames'
    },
    {
        name: 'Rock Paper Shotgun',
        url: 'https://www.rockpapershotgun.com/',
        titleSelector: 'section.spotlight a',
        urlSelector: 'section.spotlight a', 
        page: 'videogames' 
    },
    {
        name: 'Euro Gamer',
        url: 'https://www.eurogamer.net/',
        titleSelector: '.spotlight_and_latest a',
        urlSelector: '.spotlight_and_latest a', 
        page: 'videogames' 
    },
    {
        name: 'GamesIndustry.biz',
        url: 'https://www.gamesindustry.biz/',
        titleSelector: 'section.spotlight a',
        urlSelector: 'section.spotlight a', 
        page: 'videogames'
    }, 
    {
        name: 'GamePressure',
        url: 'https://www.gamepressure.com/',
        titleSelector: 'div.mp-hots-box h3',
        urlSelector: 'div.mp-hots-box a.link-abs', 
        page: 'videogames' 
    },
    {
        name: 'Game Rant',
        url: 'https://gamerant.com/',
        titleSelector: 'div.w-display-card-content h3',
        urlSelector: 'div.w-display-card-content a', 
        page: 'videogames' 
    },
    // disallowed by robots.txt (/category/ps5/ specifically)
    // {
    //     name: 'Playstation',
    //     url: 'https://blog.playstation.com/category/ps5/',
    //     titleSelector: 'h2.post-card__title',
    //     urlSelector: 'h2.post-card__title > a',
    //     page: 'videogames'
    // },
       // START SHOW BIZ
    


    // error 403
    // {
    //     name: 'JustJared',
    //     url: 'https://justjared.com',
    //     titleSelector: 'h1',
    //     urlSelector: 'h1 a',
    //     page: 'celebs'
    // },
{
        name: 'Buzzfeed',
        url: 'https://buzzfeed.com/celebrity',
        titleSelector: '.featured-card__body h2',
        urlSelector: '.featured-card__body a', 
        page: 'celebs' 
    }, 
    // error 403
    // {
    //     name: 'People',
    //     url: 'https://people.com/',
    //     titleSelector: '.card__title > span.card__title-text  ',
    //     urlSelector: '#four-post__content_1-0 > a',
    //     page: 'celebs'
    // },
    //     {
    //     name: 'EOnline',
    //     url: 'https://eonline.com/',
    //     titleSelector: '.list-row h3  ',
    //     urlSelector: '.list-row a', 
    //     page: 'celebs' 
    // }, 
        {
        name: 'US Magazine',
        url: 'https://usmagazine.com/',
        titleSelector: '.item-content > h3.item-title',
        urlSelector: '.module-top-headlines > a', 
        page: 'celebs' 
    }, 
            {
        name: 'Page Six',
        url: 'https://pagesix.com/',
        titleSelector: 'h2.story__headline',
        urlSelector: 'h2.story__headline > a', 
        page: 'celebs' 
    }, 

    {
        name: 'ET Online',
        url: 'https://etonline.com/',
        titleSelector: 'a h3',
        urlSelector: 'a[href*="/media/"]',
        page: 'celebs' 
    }, 
       {
        name: 'TMZ',
        url: 'https://tmz.com/',
        titleSelector: 'h2.article__header--headline-fragments > span',
        urlSelector: '.article__header > a', 
        page: 'celebs' 
    }, 
       {
        name: 'Variety',
        url: 'https://variety.com/',
        titleSelector: '.o-story__primary > h3#title-of-a-story',
        urlSelector: 'h3#title-of-a-story > a', 
        page: 'celebs' 
    }, 
           {
        name: 'Hollywood Reporter',
        url: 'https://hollywoodreporter.com/',
        titleSelector: '.lrv-u-margin-tb-auto > h3#title-of-a-story',
        urlSelector: 'h3#title-of-a-story > a', 
        page: 'celebs' 
    }, 
           {
        name: 'Vanity Fair',
        url: 'https://vanityfair.com/',
        titleSelector: 'a.summary-item__hed-link h3.summary-item__hed',
        urlSelector: 'a.summary-item__hed-link',
        page: 'celebs'
    },

    // error 403
    // {
    //     name: 'Entertainment Weekly',
    //     url: 'https://ew.com/',
    //     titleSelector: 'a#top__card--featured_1-0 span',
    //     urlSelector: 'a#top__card--featured_1-0',
    //     page: 'celebs'
    // },
    {
        name: 'Vulture',
        url: 'https://vulture.com/',
        titleSelector: 'a.lede-link > h2',
        urlSelector: 'a.lede-link', 
        page: 'celebs' 
    }, 
    /* END CELEBS */

    // TECH START
    {
        name: 'Tom\'s Guide',
        url: 'https://www.tomsguide.com/',
        titleSelector: 'a.wdn-listv2-item-link div.wdn-listv2-item-content-title',
        urlSelector: 'a.wdn-listv2-item-link',
        page: 'tech'
    },
    {
        name: 'Make Use Of',
        url: 'https://www.makeuseof.com/',
        titleSelector: 'h3.display-card-title',
        urlSelector: 'h3.display-card-title > a', 
        page: 'tech'  
    },
    {
        name: 'How-To Geek',
        url: 'https://www.howtogeek.com',
        titleSelector: 'h3.display-card-title',
        urlSelector: 'h3.display-card-title > a', 
        page: 'tech'  
    },
    {
        name: 'Digital Trends',
        url: 'https://www.digitaltrends.com',
        titleSelector: 'h3.b-mem-post__title',
        urlSelector: 'h3.b-mem-post__title > a', 
        page: 'tech'  
    },
    {
        name: 'PC Mag',
        url: 'https://www.pcmag.com',
        titleSelector: 'a#cover-story h1',
        urlSelector: 'a#cover-story', 
        page: 'tech'  
    },
        {
        name: 'Tom\'s Hardware',
        url: 'https://www.tomshardware.com',
        titleSelector: 'a.article-link span.article-name',
        urlSelector: 'a.article-link', 
        page: 'tech'  
    },
    {
        name: 'Mashable',
        url: 'https://www.mashable.com',
        titleSelector: '.accent-vertical-primary-300 span.leading-7',
        urlSelector: 'div.accent-vertical-primary-300 > a', 
        page: 'tech'
    },
    {
        name: 'CNET',
        url: 'https://www.cnet.com',
        titleSelector: 'h3.grid-entry__title',
        urlSelector: 'h3.grid-entry__title > a',
        page: 'tech'
    },

    // {
    //     name: 'Venture Beat',
    //     url: 'https://venturebeat.com',
    //     titleSelector: 'h2',
    //     urlSelector: 'h2 > a', 
    //     page: 'tech'
    // },
    {
        name: 'Wired',
        url: 'https://www.wired.com',
        titleSelector: 'h3.HeadlineWrapper-dWPqsu',
        urlSelector: 'h3.HeadlineWrapper-dWPqsu > a',
        page: 'tech'
    },
    {
        name: 'Engadget',
        url: 'https://www.engadget.com',
        titleSelector: 'h3 a',
        urlSelector: 'h3 a',
        page: 'tech'
    },
    {
        name: 'The Verge',
        url: 'https://www.theverge.com',
        titleSelector: 'a._7uluu50',
        urlSelector: 'a._7uluu50',
        page: 'tech'
    },
    {
        name: 'Tech Crunch',
        url: 'https://www.techcrunch.com',
        titleSelector: 'h3.loop-card__title',
        urlSelector: 'h3.loop-card__title > a', 
        page: 'tech'
    },
    {
        name: 'Tech Radar',
        url: 'https://www.techradar.com',
        titleSelector: 'a.wdn-listv2-item-link div.wdn-listv2-item-content-title',
        urlSelector: 'a.wdn-listv2-item-link',
        page: 'tech'
    },
//TECH - END

// START SPORTS

    // {
    //     name: 'Barstool Sports',
    //     url: 'https://www.barstoolsports.com/',
    //     titleSelector: '.col-span-full a',
    //     urlSelector: '.col-span-full .LinesEllipsis', 
    //     page: 'sports' 
    // }, 

    


        {
        name: 'SB Nation',
        url: 'https://www.sbnation.com',
        titleSelector: 'a._1c435ji0',
        urlSelector: 'a._1c435ji0',
        page: 'sports'
    },
    {
        name: 'Sporting News',
        url: 'https://www.sportingnews.com/us',
        titleSelector: 'a.order-1 > h3',
        urlSelector: 'a.order-1', 
        page: 'sports' 
    }, 
    {
        name: 'NFL',
        url: 'https://www.nfl.com/',
        titleSelector: 'a[href*="/news/"] h3',
        urlSelector: 'a[href*="/news/"]',
        page: 'sports' 
    }, 
    {
        name: 'NHL',
        url: 'https://www.nhl.com/',
        titleSelector: '.nhl-c-hero__title',
        urlSelector: '.nhl-c-hero', 
        page: 'sports' 
    }, 
    // 202 - AWS WAF bot challenge, empty response body, not fixable via selectors
    // {
    //     name: 'ESPN',
    //     url: 'https://espn.com/',
    //     titleSelector: 'a[href*="/story/"]',
    //     urlSelector: 'a[href*="/story/"]',
    //     page: 'sports'
    // },
    {
        name: 'Sports Illustrated',
        url: 'https://si.com/',
        titleSelector: '.gallery-column.order-1 h3',
        urlSelector: '.gallery-column.order-1 a', 
        page: 'sports' 
    }, 
        {
        name: 'CBS Sports',
        url: 'https://www.cbssports.com/',
        titleSelector: 'a[href*="/news/"] h2',
        urlSelector: 'a[href*="/news/"]',
        page: 'sports' 
    }, 
    {
        name: 'Yahoo Sports',
        url: 'https://sports.yahoo.com/',
        titleSelector: 'a[href*="/article/"] h3',
        urlSelector: 'a[href*="/article/"]:has(h3)',
        page: 'sports'
    },
        {
        name: 'Deadspin',
        url: 'https://deadspin.com',
        titleSelector: '.block > h3',
        urlSelector: '.block a', 
        page: 'sports' 
    }, 
    {
        name: 'NBC Sports',
        url: 'https://www.nbcsports.com/',
        titleSelector: '.HubHero-main .PagePromo-title',
        urlSelector: '.HubHero-main a', 
        page: 'sports' 
    }, 
    {
        name: 'Fox Sports',
        url: 'https://www.foxsports.com/',
        titleSelector: '.vue-glide__track span.inline',
        urlSelector: '.vue-glide__track a', 
        page: 'sports' 
    }, 
    {
        name: 'The Score',
        url: 'https://www.thescore.com/',
        titleSelector: 'a[href*="/news/"]',
        urlSelector: 'a[href*="/news/"]',
        page: 'sports'
    },

        {
        name: 'MLB',
        url: 'https://www.mlb.com/',
        titleSelector: '.AnchorElement-sc-5g3tf0-0 > h2',
        urlSelector: '.AnchorElement-sc-5g3tf0-0 ', 
        page: 'sports' 
    }, 
    /* END SPORTS */    
//POLITICS
    {
        name: 'ABC Politics',
        url: 'https://www.abcnews.go.com/Politics',
        titleSelector: 'a[href*="/Politics/"] h2',
        urlSelector: 'a[href*="/Politics/"]:has(h2)',
        page: 'politics'
    },
    {
        name: 'NBC Politics',
        url: 'https://www.nbcnews.com/politics',
        titleSelector: 'h2.founders-cond',
        urlSelector: 'h2.founders-cond > a', 
        page: 'politics'
    },
    {
        name: 'Newsweek',
        url: 'https://www.newsweek.com/politics',
        titleSelector: 'a h3',
        urlSelector: 'a:has(h3)',
        page: 'politics'
    },
    {
        name: 'Washington Examiner',
        url: 'https://www.washingtonexaminer.com/',
        titleSelector: 'h3.title-main',
        urlSelector: '.content > a:even', 
        page: 'politics'
    },
    // error 403
    // {
    //     name: 'PolitiFact',
    //     url: 'https://www.politifact.com',
    //     titleSelector: '.m-statement__quote > a',
    //     urlSelector: '.m-statement__quote > a',
    //     page: 'politics'
    // },
    {
        name: 'CNN Politics',
        url: 'https://www.cnn.com/politics/',
        titleSelector: '.container__headline > .container__headline-text',
        urlSelector: '.container_lead-plus-headlines__item > .container_lead-plus-headlines__link', 
        page: 'politics'
    },
    {
        name: 'Breitbart',
        url: 'https://www.breitbart.com',
        titleSelector: 'h2 > a',
        urlSelector: 'h2 > a', 
        page: 'politics'
    },
    {
        name: 'Epoch Times',
        url: 'https://www.theepochtimes.com',
        titleSelector: 'h3.et-headline-main_heading-6',
        urlSelector: 'div.gap-x-6  a.block  ', 
        page: 'politics'
    },
    {
        name: 'Daily Kos',
        url: 'https://www.dailykos.com/',
        titleSelector: 'h3 a',
        urlSelector: 'h3 a',
        page: 'politics'
    },
    {
        name: 'Mother Jones',
        url: 'https://www.motherjones.com/',
        titleSelector: 'h1.hed',
        urlSelector: 'div.cover-text > a', 
        page: 'politics'
    },
    {
        name: 'Vox',
        url: 'https://www.vox.com/politics',
        titleSelector: 'a.fxw44b0',
        urlSelector: 'a.fxw44b0',
        page: 'politics'
    },
    {
        name: 'The Atlantic',
        url: 'https://www.theatlantic.com/politics/',
        titleSelector: '.CollectionArticleCard_hed__mPXAv > a',
        urlSelector: '.CollectionArticleCard_hed__mPXAv > a', 
        page: 'politics' 
    },
    {
        name: 'Daily Beast',
        url: 'https://www.thedailybeast.com/',
        titleSelector: '.card1__headline_box > a',
        urlSelector: '.card1__headline_box > a', 
        page: 'politics' 
    },
    {
        name: 'HuffPost',
        url: 'https://huffpost.com/',
        titleSelector: '.splash__headline > a',
        urlSelector: '.splash__headline > a', 
        page: 'politics' 
    },    
//END POLITICS
/* START FRONT PAGE */

    // consistently times out (ECONNABORTED, retried twice)
    // {
    //     name: 'US News',
    //     url: 'https://www.usnews.com',
    //     titleSelector: 'a.css-16ato06',
    //     urlSelector: 'a.css-16ato06',
    //     page: 'home'
    // },
    {
        name: 'AP News',
        url: ' https://www.apnews.com',
        titleSelector: 'h2', 
        urlSelector: 'h2 > a', 
        page: 'home'
    },
    {
        name: 'Daily Mail',
        url: ' https://www.dailymail.co.uk/ushome/',
        titleSelector: 'h2.linkro-darkred', 
        urlSelector: 'h2.linkro-darkred > a', 
        page: 'home'
    },
    {
        name: 'The Guardian',
        url: 'https://www.theguardian.com/us',
        titleSelector: 'h3.card-headline',
        urlSelector: "a[data-link-name*='card']",
        page: 'home'
    },
     {
        name: 'Time',
        url: 'https://www.time.com',
        titleSelector: 'h3.font-editorial', 
        urlSelector: 'h3.font-editorial a', 
        page: 'home'
    },

    {
        name: 'LA Times',
        url: 'https://www.latimes.com',
        titleSelector: 'h1.promo-title', 
        urlSelector: 'h1.promo-title > a', 
        page: 'home'
    },
    {
        name: 'CNN',
        url: 'https://www.cnn.com',
        titleSelector: '.container__title h2', 
        urlSelector: '.container__title a', 
        page: 'home'
    },
    {
        name: 'BBC',
        url: 'https://www.bbc.com',
        titleSelector: "[data-testid='card-headline']",
        urlSelector: "a[data-testid='external-anchor']",
        page: 'home',
    },
    {
        name: 'New York Times',
        url: 'https://www.nytimes.com',
        titleSelector: 'p.indicate-hover',
        urlSelector: 'a.tpl-lbl',
        page: 'home'
    },
    {
        name: 'CBS News',
        url: 'https://www.cbsnews.com', 
        titleSelector: 'h4.item__hed',
        urlSelector: 'article:first a.item__anchor', 
        page: 'home'
    },
    {
        name: 'ABC News',
        url: 'https://www.abcnews.go.com',
        titleSelector: 'a.zZygg > h2',
        urlSelector: 'div.sdeif > a.zZygg', 
        page: 'home'
    },
    {
        name: 'NBC News',
        url: 'https://www.nbcnews.com',
        titleSelector: '.headline-large > h2',
        urlSelector: 'h2.multistoryline__headline > a', 
        page: 'home'
    },
    {
        name: 'Fox News',
        url: 'https://www.foxnews.com',
        titleSelector: '.title',
        urlSelector: '.title a', 
        page: 'home'
    },
    {
        name: 'NY Post',
        url: 'https://www.nypost.com',
        titleSelector: 'h2.story__headline > a',
        urlSelector: 'h2.story__headline > a', 
        page: 'home'
    },
    // error 403
    // {
    //     name: 'People',
    //     url: 'https://www.people.com',
    //     titleSelector: 'span.card__title-text',
    //     urlSelector: 'a.primary-block__topStory',
    //     page: 'home'
    // },
    {
        name: 'NPR',
        url: 'https://www.npr.org',
        titleSelector: 'h3.title',
        urlSelector: '.story-text > a', 
        page: 'home'
    },
    //END Front PAge
    
    //START WORLD
    // 403 - TRY ON RAILWAY
    // {
    //     name: 'Mainichi.jp',
    //     url: 'https://mainichi.jp/english/',
    //     titleSelector: 'p.midashi',
    //     urlSelector: 'p.midashi > a',
    //     page: 'world'
    // },
    {
        name: 'Asahi',
        url: 'https://www.asahi.com/ajw/',
        titleSelector: '.EnTopNewsR p',
        urlSelector: '.EnTopNewsR a', 
        page: 'world' 
    },  
    {
        name: 'Xinhua',
        url: 'https://english.news.cn/',
        titleSelector: '.headnews-left a',
        urlSelector: '.headnews-left a', 
        page: 'world' 
    },  
    {
        name: 'Aljazeera',
        url: 'https://www.aljazeera.com/',
        titleSelector: 'h3',
        urlSelector: 'h3 > a', 
        page: 'world' 
    },   
    {
        name: 'Jerusalem Post',
        url: 'https://www.jpost.com/',
        titleSelector: '.main-article-left-side-container h3.article-title-h3',
        urlSelector: '.main-article-left-side-container > a.main-article-link', 
        page: 'world' 
    },   
    {
        name: 'Japan Times',
        url: 'https://www.japantimes.co.jp/',
        titleSelector: '.article-title > a',
        urlSelector: '.article-title > a', 
        page: 'world' 
    },   
    {
        name: 'Moscow Times',
        url: 'https://www.themoscowtimes.com/',
        titleSelector: 'h3.article-excerpt-primary__title > span',
        urlSelector: '.article-excerpt-primary > .article-excerpt-primary__link ', 
        page: 'world' 
    },   
    {
        name: 'South China Morning Post',
        url: 'https://www.scmp.com/',
        titleSelector: 'a h2',
        urlSelector: 'a[href*="/article/"]',
        page: 'world' 
    },   
    {
        name: 'Hindustan Times',
        url: 'https://www.hindustantimes.com/india-news',
        titleSelector: '.bigCart > h2',
        urlSelector: '.bigCart > h2 > a',
        page: 'world'
    },
    // 402 - paywalled/blocked
    // {
    //     name: 'Le Monde',
    //     url: 'https://www.lemonde.fr/en/france/',
    //     titleSelector: '.teaser h3',
    //     urlSelector: '.teaser > a ',
    //     page: 'world'
    // },
    {
        name: 'Rio Times',
        url: 'https://www.riotimesonline.com/',
        titleSelector: 'a h3',
        urlSelector: 'a[href*="riotimesonline.com"]',
        page: 'world' 
    },    
    {
        name: 'Republicca',
        url: 'https://www.repubblica.it/',
        titleSelector: '.entry__title',
        urlSelector: '.entry__title > a ', 
        page: 'world' 
    },       
    {
        name: 'El Pais',
        url: 'https://english.elpais.com/spain/',
        titleSelector: 'h2.c_t',
        urlSelector: 'h2.c_t > a', 
        page: 'world' 
    }, // END WORLD

//FINANCE - START
    {
        name: 'CNN Business',
        url: 'https://cnn.com/business/',
        titleSelector: 'span.container__headline-text',
        urlSelector: 'a.container__link',
        page: 'finance'
    },
    {
        name: 'StockTitan',
        url: 'https://www.stocktitan.net/news/',
        titleSelector: 'a.feed-link',
        urlSelector: 'a.feed-link',
        page: 'finance'
    },
    {
        name: 'Kiplinger',
        url: 'https://kiplinger.com/',
        titleSelector: '#homepage-carousel .wdn-listv2-item-content-title',
        urlSelector: '#homepage-carousel a.wdn-listv2-item-link',
        page: 'finance'
    },
    //     {
    //     name: 'Zero Hedge',
    //     url: 'https://www.zerohedge.com.com/',
    //     titleSelector: 'h2.Article_title___TC6d',
    //     urlSelector: 'h2.Article_title___TC6d > a', 
    //     page: 'finance'
    // },
    {
        name: 'Insider Monkey',
        url: 'https://www.insidermonkey.com/',
        titleSelector: 'h1.post-title',
        urlSelector: 'h1.post-title> a', 
        page: 'finance'
    },
    {
        name: 'Forbes',
        url: 'https://www.forbes.com/business/',
        titleSelector: 'h2._1-gEWhFG',
        urlSelector: 'a.zEzPL6aA', 
        page: 'finance'
    },
    // error 403
    // {
    //     name: 'Investopedia',
    //     url: 'https://www.investopedia.com',
    //     titleSelector: 'div#card__title_1-0',
    //     urlSelector: 'a#home-hero-primary__item_1-0',
    //     page: 'finance'
    // },
    {
        name: 'NASDAQ',
        url: 'https://www.nasdaq.com/newsroom/',
        titleSelector: "h3[slot='title']",
        urlSelector: "a[slot='cta']",
        page: 'finance'
    },
    // error 403
    // {
    //     name: 'The Balance Money',
    //     url: 'https://www.thebalancemoney.com/',
    //     titleSelector: 'a#mntl-document-card--featured_1-0 .card__title-text',
    //     urlSelector: 'a#mntl-document-card--featured_1-0',
    //     page: 'finance'
    // },
    // error 403
    // {
    //     name: 'Benzinga',
    //     url: 'https://www.benzinga.com/',
    //     titleSelector: '.gap-2 h3',
    //     urlSelector: '.gap-2 > a',
    //     page: 'finance'
    // },
    {
        name: 'CNBC',
        url: 'https://www.cnbc.com/',
        titleSelector: 'h2.FeaturedCard-packagedCardTitle > a',
        urlSelector: 'h2.FeaturedCard-packagedCardTitle > a', 
        page: 'finance'
    },
    {
        name: 'The Fool',
        url: 'https://www.fool.com/',
        titleSelector: 'div.absolute > h3.text-lg',
        urlSelector: 'article.relative > a', 
        page: 'finance'
    },
    // disallowed by robots.txt (entire site)
    // {
    //     name: 'Investor\'s Bursiness Daily',
    //     url: 'https://www.investors.com/',
    //     titleSelector: '.article-title > a > div',
    //     urlSelector: '.article-title > a',
    //     page: 'finance'
    // },
    {
        name: 'Investors Place',
        url: 'https://investorplace.com/',
        titleSelector: '.headline-content > .headline-a',
        urlSelector: '.headline-a > a', 
        page: 'finance'
    },
    {
        name: 'Seeking Alpha',
        url: 'https://seekingalpha.com/market-news',
        titleSelector: 'h3.text-share-text',
        urlSelector: 'h3.text-share-text a',
        page: 'finance'
    },
    {
        name: 'Zacks',
        url: 'https://zacks.com',
        titleSelector: 'section#top_stories h1',
        urlSelector: 'section#top_stories a', 
        page: 'finance'
    },    
//END FINANCE   

]