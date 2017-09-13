var express = require('express');

var routes = function (Pushpin) {

    var pushpinRouter = express.Router();

    pushpinRouter.route('/')
        .post(function (req, res) {
            var pushpin = new Pushpin(req.body);

            pushpin.save();
            res.status(201).send(pushpin);
        })
        .get(function (req, res) {
            var query = {};
            if (req.query.genre) {
                query.genre = req.query.genre;
            }
            Pushpin.find(query, function (err, pushpins) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(pushpins);
                }
            })
        });

    pushpinRouter.use('/:pushpinId', function (req, res, next) {
        Pushpin.findById(req.params.pushpinId, function (err, pushpin) {
            if (err) {
                res.status(500).send(err);
            } else if (pushpin) { 
                req.pushpin = pushpin;
                next(); 
            } else {
                res.statusCode(404).send('no pushpin found');
            }
        });
    });

    pushpinRouter.route('/:pushpinId')
        .get(function (req, res) {
            res.json(req.pushpin);
        })
        .put(function (req, res) {
            req.pushpin.title = req.body.title;
            req.pushpin.lat = req.body.lat;
            req.pushpin.lon = req.body.lon;
            req.pushpin.description = req.body.description;
            req.pushpin.author = req.body.author;
            req.pushpin.asset = req.body.asset;
            req.pushpin.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.pushpin);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                req.pushpin[p] = req.body[p];
            }

            req.pushpin.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(req.pushpin);
                }
            });
        })
        .delete(function (req, res) {
            req.pushpin.remove(function (err) {
                if (err) {
                    res.statucCode(500).send(err);
                } else {
                    res.status(204).send("removed");
                }
            });

        });

    return pushpinRouter
};

module.exports = routes; 