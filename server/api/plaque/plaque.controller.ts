'use strict';

import * as _ from 'lodash';
import * as repositoryFactory from '../../components/memoryStore';

var repo = repositoryFactory.default('./data/gb_20151004.json');
repo.connect()

exports.search = function(req, res) {
    repo
    .search(req.params.searchTerm)
    .then(function(results) {
        res.json(results);
    });
};

exports.get = function(req, res) {
    repo
    .list()
    .then(function(results) {
        res.json(results);
    });
};

exports.getMulti = function(req, res) {
    repo
    .getByIdList(req.params.idArray)
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
    .tags()
    .then(function(results) {
        res.json(results);
    });
};
