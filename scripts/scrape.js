var request = require("request");
var cheerio = require("cheerio");

var scrape = function(callback) {

    var articlesArr = [];

    request("https://www.nytimes.com/", function(error, response, html) {

      var $ = cheerio.load(html);

      $('h2.story-heading').each(function(i, element) {

        var result = {};

        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");

        if (result.title !== "" && result.link !== "") {
            articlesArr.push(resut);
        }
      });
      callback(articlesArr);
    });
};

module.exports = scrape;