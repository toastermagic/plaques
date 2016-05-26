'use strict';

var _ = require('lodash');
var repo = require('../../components/repository');

exports.search = function(req, res) {
    repo
    .search(req.params.searchTerm)
    .then(function(results) {
        res.json(results);
    });
};

exports.get = function(req, res) {
    repo
    .list(50)
    .then(function(results) {
        res.json(results);
    });
};

exports.show = function(req, res) {
    repo
    .getById(req.params.plaqueId)
    .then(function(results) {
        res.json(results);
    });
};

exports.tags = function(req, res) {
    repo
    .tags(1234, 5678)
    .then(function(results) {
        res.json(results);
    });
};
