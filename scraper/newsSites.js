module.exports = [
    // START SHOW BIZ
    

{
    name: 'EOnline',
    url: 'https://eonline.com',
    titleSelector: '.hero h4.caption__text',
    urlSelector: '.hero a', 
    page: 'celebs' 
},  
{
        name: 'JustJared',
        url: 'https://justjared.com',
        titleSelector: 'h1',
        urlSelector: 'h1 a', 
        page: 'celebs' 
},     
{
        name: 'Buzzfeed',
        url: 'https://buzzfeed.com/celebrity',
        titleSelector: '.featured-card__body h2',
        urlSelector: '.featured-card__body a', 
        page: 'celebs' 
    }, 
    {
        name: 'People',
        url: 'https://people.com/',
        titleSelector: '.card__title > span.card__title-text  ',
        urlSelector: '#four-post__content_1-0 > a', 
        page: 'celebs' 
    }, 
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
        titleSelector: 'a.hero__tile-1 span',
        urlSelector: '.hero > a.hero__tile-1', 
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
        titleSelector: '.SummaryItemContent-edliEQ h3',
        urlSelector: '.SummaryItemContent-edliEQ > a', 
        page: 'celebs' 
    }, 

    {
        name: 'Entertainment Weekly',
        url: 'https://ew.com/',
        titleSelector: 'a#top__card--featured_1-0 span',
        urlSelector: 'a#top__card--featured_1-0', 
        page: 'celebs' 
    }, 
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
        titleSelector: 'figcaption > span.article-name',
        urlSelector: 'div#Item1 > a', 
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
        titleSelector: 'span.c-storiesNeonMeta_hedContent',
        urlSelector: 'a.c-storiesNeonHighlightsLead_link', 
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
        titleSelector: 'h3.HeadlineWrapper-eXjTYk ',
        urlSelector: 'h3.HeadlineWrapper-eXjTYk > a', 
        page: 'tech'
    },
    {
        name: 'Engadget',
        url: 'https://www.engadget.com',
        titleSelector: 'h4',
        urlSelector: 'h4 > a', 
        page: 'tech'
    },
    {
        name: 'The Verge',
        url: 'https://www.theverge.com',
        titleSelector: 'div._1xwtict9',
        urlSelector: '._1xwtict9 > a', 
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
        titleSelector: 'h2.wdn-listv2-item-content-title',
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
        titleSelector: 'a._1ngvuhm0',
        urlSelector: 'a._1ngvuhm0', 
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
        titleSelector: 'h3.body-3',
        urlSelector: '.grid a', 
        page: 'sports' 
    }, 
    {
        name: 'NHL',
        url: 'https://www.nhl.com/',
        titleSelector: '.nhl-c-hero__title',
        urlSelector: '.nhl-c-hero', 
        page: 'sports' 
    }, 
    {
        name: 'ESPN',
        url: 'https://espn.com/',
        titleSelector: '.contentItem__content h2',
        urlSelector: '.contentItem__content > a', 
        page: 'sports' 
    }, 
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
        titleSelector: '.TopCovers-item h1',
        urlSelector: '.TopCovers-item > a', 
        page: 'sports' 
    }, 
    {
        name: 'Yahoo Sports',
        url: 'https://sports.yahoo.com/',
        titleSelector: '._ys_1tsdzxx h3',
        urlSelector: '._ys_1eou1w1 > a', 
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
        titleSelector: '.isImageCard > .jsx-403783000',
        urlSelector: '.jsx-1435942676 a', 
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
        titleSelector: '.atAoU h2',
        urlSelector: '.atAoU a',
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
        titleSelector: 'a.NewsweekLink_link__BTn_o > span',
        urlSelector: 'a.NewsweekLink_link__BTn_o', 
        page: 'politics'
    },
    {
        name: 'Washington Examiner',
        url: 'https://www.washingtonexaminer.com/',
        titleSelector: 'h3.title-main',
        urlSelector: '.content > a:even', 
        page: 'politics'
    },
    {
        name: 'PolitiFact',
        url: 'https://www.politifact.com',
        titleSelector: '.m-statement__quote > a',
        urlSelector: '.m-statement__quote > a', 
        page: 'politics'
    },
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
        titleSelector: 'h3.top-news__primary_news__story__inner__heading',
        urlSelector: 'a.top-news__primary_news__story__inner', 
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
        titleSelector: '.xkp0cg9 a',
        urlSelector: '.xkp0cg9 a', 
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

    {
        name: 'US News',
        url: ' https://www.usnews.com',
        titleSelector: 'a.css-16ato06', 
        urlSelector: 'a.css-16ato06', 
        page: 'home'
    },
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
        titleSelector: 'h3.dcr-1a010mf', 
        urlSelector: 'a.dcr-2yd10d', 
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
        titleSelector: '.hDVIYu h2',
        urlSelector: '.hDVIYu a', 
        page: 'home',
    },
    {
        name: 'New York Times',
        url: 'https://www.nytimes.com',
        titleSelector: 'p.indicate-hover.css-1ixq7yl',
        urlSelector: 'a.tpl-lbl.css-5mgoji', 
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
    {
        name: 'People',
        url: 'https://www.people.com',
        titleSelector: 'span.card__title-text',
        urlSelector: 'a.primary-block__topStory', 
        page: 'home'
    },
    {
        name: 'NPR',
        url: 'https://www.npr.org',
        titleSelector: 'h3.title',
        urlSelector: '.story-text > a', 
        page: 'home'
    },
    //END Front PAge
    
    //START WORLD
    {
        //403 - TRY ON RAILWAY
        // name: 'Mainichi.jp',
        // url: 'https://mainichi.jp/english/',
        // titleSelector: 'p.midashi',
        // urlSelector: 'p.midashi > a', 
        // page: 'world' 
    },  
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
        titleSelector: 'h2.css-1xdhyk6 > span',
        urlSelector: 'div.css-1sxg93g > a ', 
        page: 'world' 
    },   
    {
        name: 'Hindustan Times',
        url: 'https://www.hindustantimes.com/india-news',
        titleSelector: '.bigCart > h2',
        urlSelector: '.bigCart > a ', 
        page: 'world' 
    },  
    {
        name: 'Le Monde',
        url: 'https://www.lemonde.fr/en/france/',
        titleSelector: '.teaser h3',
        urlSelector: '.teaser > a ', 
        page: 'world' 
    },  
    {
        name: 'Rio Times',
        url: 'https://www.riotimesonline.com/',
        titleSelector: '.td-module-meta-info > h3',
        urlSelector: 'h3.entry-title > a ', 
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
        titleSelector: 'div.container_lead-plus-headlines-with-images__headline > span.container__headline-text',
        urlSelector: 'a.container_lead-plus-headlines-with-images__link', 
        page: 'finance'
    },
    {
        name: 'Investor Hub',
        url: 'https://investorhub.com/insights/',
        titleSelector: 'div._f3b63657-highlight h3',
        urlSelector: 'div._f3b63657-highlight > a', 
        page: 'finance'
    },
    {
        name: 'Kiplinger',
        url: 'https://kiplinger.com/',
        titleSelector: '#homepage-carousel h2',
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
    {
        name: 'Investopedia',
        url: 'https://www.investopedia.com',
        titleSelector: 'div#card__title_1-0',
        urlSelector: 'a#home-hero-primary__item_1-0', 
        page: 'finance'
    },
    {
        name: 'NASDAQ',
        url: 'https://www.nasdaq.com/newsroom/',
        titleSelector: 'article a.jupiter22-c-section-heading__headline',
        urlSelector: 'article a.jupiter22-c-section-heading__headline', 
        page: 'finance'
    },
    {
        name: 'The Balance Money',
        url: 'https://www.thebalancemoney.com/',
        titleSelector: 'a#mntl-document-card--featured_1-0 .card__title-text',
        urlSelector: 'a#mntl-document-card--featured_1-0', 
        page: 'finance'
    },
    {
        name: 'Benzinga',
        url: 'https://www.benzinga.com/',
        titleSelector: '.gap-2 h3',
        urlSelector: '.gap-2 > a', 
        page: 'finance'
    },
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
    {
        name: 'Investor\'s Bursiness Daily',
        url: 'https://www.investors.com/',
        titleSelector: '.article-title > a > div',
        urlSelector: '.article-title > a', 
        page: 'finance'
    },
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
        titleSelector: 'section.jMI0l h3',
        urlSelector: 'section.jMI0l a', 
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


];

