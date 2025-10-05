module.exports = [

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
        titleSelector: '.BzSXM .kmmiMl',
        urlSelector: '.wMcOc a.sc-8a623a54-0.hMvGwj', 
        page: 'home',
    },
    {
        name: 'The New York Times',
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
    //END HOME PAG
    //POLITICS
    //
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
        titleSelector: 'div.side-article-title span',
        urlSelector: 'div.side-article-title a', 
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
        name: 'The Daily Beast',
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
    {
        name: 'Newsweek',
        url: 'https://www.newsweek.com/',
        titleSelector: '.featured-article-title > a',
        urlSelector: '.featured-article-title > a', 
        page: 'politics' 
    },    
    //END POLITICS
    //FINANCE
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
        name: 'Investors.com',
        url: 'https://www.investors.com/',
        titleSelector: '.article-title > a > div',
        urlSelector: '.article-title > a', 
        page: 'finance'
    },


    
    

    //END FINANCE
];

