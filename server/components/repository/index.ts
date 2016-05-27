'use strict';

var config = require('../../config/environment');
var repositoryFactory;
if (config.datastore.type === "memoryStore")
{
    console.log('using memory store')
    repositoryFactory = require('../memoryStore');   
} else {
    console.log('using sql repository')
    repositoryFactory = require('../sqlStore');   
}

var config = require('../../config/environment');
var repo = repositoryFactory(config.datastore.config);
repo.connect();

module.exports = {
    getById: repo.getById,
    list: repo.list,
    tags: repo.tags,
    stream: repo.stream,
    search: repo.search
}