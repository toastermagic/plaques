'use strict';

var _ = require('lodash');
var fs = require('fs');
var cloud = require('../cloud');

function rowMatch(terms, row) {
    var isMatch = true;
    for (var index = 0; index < terms.length; index++) {
        isMatch = isMatch && row.indexOf(terms[index]) > -1;
    }
    return isMatch;
}

function getSearchKey(obj) {
    return (obj.address + obj.area.name + obj.inscription + obj.title).toLowerCase();
}

var MemoryStoreFactory = function (config) {
    var _ready = false;
    var plaques = [];

    return {
        connect: function () {
            if (_ready) {
                return;
            }
            _ready = true;
            console.log('memory store initialising', config.path);

            fs.readFile(config.path, function (err, data) {
                console.log('err', err);
                if (err) throw err;
                console.log('data read', data.length, 'bytes');
                var temp = JSON.parse(data);
                console.log('data parsed', Object.keys(temp).length);

                for (var key in temp) {
                    if (temp.hasOwnProperty(key)) {
                        if (temp[key].thumbnail_url) {
                            temp[key].SearchKey = getSearchKey(temp[key]);
                            plaques.unshift(temp[key]);
                        }
                    }
                }

                console.log('plaques in list', plaques.length);
            });
        },
        tags: function () {
            var tagPlaques = _.filter(plaques, function (p) {
                if (!p.erected_at 
                    || p.erected_at.startsWith('16')
                    || p.erected_at.startsWith('17')
                    || p.erected_at.startsWith('18'))
                    return;

                p.erected_at = p.erected_at.substring(0, 3) + '0';
                return p.inscription && p.erected_at;
            });

            var clouds = cloud.cloudThis(tagPlaques, "erected_at", "inscription", {
                topN: 15,
                minCount: 1,
                exclude: [
                    'plaque',
                    'the',
                    'that',
                    'first',
                    'and',
                    'for',
                    'here',
                    'was',
                    'his',
                    'from',
                    'were',
                    'this',
                    'with',
                    'who',
                    'lived',
                    'through',
                    'their',
                    'these',
                    'which',
                    'site'
                    
                ]
            });
            
            return Promise.resolve(clouds);
        },
        getById: function (plaqueId) {
            var found = _.find(plaques, { 'id': +plaqueId });
            return Promise.resolve(found);
        },
        list: function() {

            var results = [];
            var rowCount = 0;

            //  this is bad, it's only here because I know for a fact we only have 10k entitities, 
            //  and they are not that complex.
            //  TODO: optimize if this becomes a problem
            var candidates = _.map(plaques, function (p) { return p; });

            while (rowCount < 50 && candidates.length > 0) {
                var index = Math.floor(Math.random() * candidates.length);
                var candidate = candidates.splice(index, 1)[0];
                rowCount++;
                results.push(candidate);
            }
            
            return Promise.resolve(results);
        },
        search: function(searchTerm) {

            var results = [];
            var rowCount = 0;
            searchTerm = searchTerm.toLowerCase();
            var terms = searchTerm.split(' ');

            //  this is bad, it's only here because I know for a fact we only have 10k entitities, 
            //  and they are not that complex.
            //  TODO: optimize if this becomes a problem
            var candidates = _.map(plaques, function (p) { return p; });

            while (rowCount < 50 && candidates.length > 0) {
                var index = Math.floor(Math.random() * candidates.length);
                var candidate = candidates.splice(index, 1)[0];
                if (searchTerm === "" || rowMatch(terms, candidate.SearchKey)) {
                    rowCount++;
                    results.push(candidate);
                }
            }
            
            return Promise.resolve(results);
        },
        stream: function (searchTerm, startCallback, rowCallback, endCallback) {
            if (searchTerm === null)
                return;

            startCallback();

            var rowCount = 0;
            searchTerm = searchTerm.toLowerCase();
            var terms = searchTerm.split(' ');

            var results = [];

            //  this is bad, it's only here because I know for a fact we only have 10k entitities, 
            //  and they are not that complex.
            //  TODO: optimize if this becomes a problem
            var candidates = _.map(plaques, function (p) { return p; });

            while (rowCount < 50 && candidates.length > 0) {
                var index = Math.floor(Math.random() * candidates.length);

                var candidate = candidates.splice(index, 1)[0];

                if (searchTerm === "" || rowMatch(terms, candidate.SearchKey)) {
                    rowCount++;
                    rowCallback(candidate);
                }
            }

            console.log('done total', rowCount, 'of', plaques.length);
            if (endCallback !== undefined) {
                endCallback({ rowCount: rowCount, total: results.length });
            }
        }
    }
}

module.exports = MemoryStoreFactory;


            // average characters by year
            // var wordLists = {};
            // _.reduce(Object.keys(results), function(avLength, year) {
            //     var count = 0;

            //     _(results[year]).forEach(function(inscription) {
            //         count += inscription.length;
            //     });

            //     avLength[year] = count / results[year].length;

            //     return words;
            // }, wordLists);

