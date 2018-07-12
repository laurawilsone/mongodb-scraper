const express = require("express");
const router = express.Router();
const db = require("../models");
const request = require("request"); //Makes http calls
const cheerio = require("cheerio");


router.get("/scrape", (req, res) => {
    console.log("scrape ran")

// GET route for scraper
request("http://www.nytimes.com/", (error, response, body) => {
    if (!error && response.statusCode === 200) {
        // load to cheerio
        const $ = cheerio.load(body);
        let count = 0;
        // grab article
        $('article').each(function (i, element) {
            // save an empty result object
            let count = i;
            let result = {};

            result.title = $(element)
             .children('.story-heading')
             .children('a')
             .text().trim();
            result.link = $(element)
             .children('.story-heading')
             .children('a')
             .attr("href");
            result.summary = $(element)
             .children('.summary')
             .text().trim()
             || $(element)
                .children('ul')
                .text().trim()
                || 'No byline available'

            if (result.title && result.link && result.summary) {
                db.Article.create(result)
                    .then(function (dbArticle) {
                        count++;
                    })
                    .catch(function (err) {
                        return resizeBy.json(err);
                    });
            };
        });

        res.redirect('/')
    }
        else if (error || response.statusCode != 200){
            res.send("Error: Unable to obtain new articles")
        }
    });

});
