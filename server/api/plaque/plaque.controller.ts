'use strict';

import * as _ from 'underscore';
import * as repositoryFactory from '../../components/memoryStore';
import * as twitter from '../../components/twitter-watch';
import * as request from 'request';

var repo = repositoryFactory.default('./data/');
repo.connect();

exports.search = function (req, res) {
    repo
        .search(req.params.searchTerm)
        .then(function (results) {
            res.json(results);
        });
};

exports.get = function (req, res) {
    repo
        .list()
        .then(function (results) {
            res.json(results);
        });
};

exports.getMulti = function (req, res) {
    repo
        .getByIdList(req.params.idArray)
        .then(function (results) {
            res.json(results);
        });
};

exports.show = function (req, res) {
    repo
        .getById(req.params.plaqueId)
        .then(function (results) {
            res.json(results);
        });
};

exports.tags = function (req, res) {
    // res.sendFile('/plaques/data/cloud.json');
    repo
        .tags()
        .then(function (results) {
            res.json(results);
        });
};

exports.tweets = function (req, res) {
    let location = JSON.parse(req.query.location);

    twitter.default()
        .nearbyTweets(req.query.subject,
        location.latitude,
        location.longitude)
        .then((tweets) => {
            if (tweets && tweets.statuses && tweets.statuses.length) {
                let tweetIds = _(tweets.statuses).map((tweet: any) => tweet.id_str);
                res.json(tweetIds);
            }
        });
};
