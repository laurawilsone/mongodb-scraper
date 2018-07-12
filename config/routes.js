var scrape = require("../scripts/scrape");
var Article = require("../models/Article");
var Note = require("../models/Note");
var articlesController = require("../controllers/articles");
var notesController = require("../controllers/notes");

module.exports = function(router) {

    router.get("/", function(req, res) {
        Article.find({saved: false}, function(error, found) {
            if (error) {
                console.log(error);
            } else if (found.length === 0) {
                res.render("empty")
            } else {

                var hbsObject = {
                    articles: found
                };
                res.render("index", hbsObject);
            }
        });
    });

    // scrapes the articles
    router.get("/api/fetch", function(req, res) {
        articlesController.fetch(function(err, docs) {
            if (!docs || docs.insertCount === 0) {
                res.json({message: "No new articles today. Check back tomorrow!"});

            } else {
                res.json({message: "Added " + docs.insertedCount + " new articles!"});
            }
        });
    });

// retrieves the saved articles
router.get("/saved", function(req, res) {
    articlesController.get({saved: true}, function(data) {
        var hbsObject = {
            articles: data
        };
        res.render("saved", hbsObject);
    });
});


router.patch("/api/articles", function(req, res) {
    articlesController.update(req.body, function(err, data) {
        res.json(data);
    });
});

// retrieve the notes attached to saved articles 
router.get('/notes/:id', function (req, res) {
    // Query to find the matching id to the passed 
    Article.findOne({_id: req.params.id})
    .populate("note") // Populates notes associated with it
    .exec(function (error, doc) {
        if (error) console.log(error);
        // Otherwise send the doc to the browser as a json
        else {
            res.json(doc);
        }
    });
});

// Add a note to a saved article
router.post('/notes/:id', function (req, res) {
    // create a new note with req.body
    var newNote = new Note(req.body);
    // save newNote to db
    newNote.save(function (err, doc) {
        // Log errors
        if (err) console.log(err);
        // find and update the note
        Article.findOneAndUpdate(
            {_iod: req.params.id},
            {$push: {note: doc._id}},
            {new: true},
            function(err, newdoc) {
                if (err) console,log(err);
                res,send(newdoc);
        
        });
    });
});

router.get('/deleteNote/:id', function(req, res) {
    Note.remove({"_id": req.params.id}, function(err, newdoc) {
        if(err) console.log(err);
        res.redirect('/saved'); //redirectto reload the page
    });
});


};