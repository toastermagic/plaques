/// <reference path="../../../typings/main/index.d.ts"/>

'use strict';
import * as _ from 'lodash';
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

function keyDescription(key) {
    switch (key) {
        case '1900':
            return 'It\'s the turn of the last century, essayists, painters ' +
                'and poets are being born and dying';
        case '1910':
            return '1910 - 1920, erections are prevalent';
        case '1920':
            return 'The roaring twenties were mainly characterised by the veneration of bridges';
        case '1930':
            return 'John and George seem to be popular names';
        case '1940':
            return 'The 1940s, and a great conflict is commemorated';
        case '1950':
            return 'Poets, novelists, and statesmen die - while Bristol get\'s a mention';
        case '1960':
            return 'Writers take top spot in this decade, along with the names of former kings';
        case '1970':
            return 'The 70s: architects, painters, and men named John.';
        case '1980':
            return 'Manchester was a very popular place to be in the 80s';
        case '1990':
            return 'The words \'school\', \'world\' and \'pioneer\' all feature for the first time';
        case '2000':
            return 'A century is celebrated, and the renaissance of Leeds begins';
        case '2010':
            return 'The most common words on plaques of each decade';
    }
}

export default (path) => {
    var ready = false;
    var plaques = [];

    return {
        connect: function () {
            if (ready) {
                return;
            }
            ready = true;
            console.log('memory store initialising', path);

            fs.readFile(path, function (err, data) {
                console.log('err', err);
                if (err) { throw err; }
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
                    || p.erected_at.startsWith('18')) {
                    return;
                }

                p.erected_at_decade = p.erected_at.substring(0, 3) + '0';
                return p.inscription && p.erected_at;
            });

            var clouds = cloud.cloudThis(tagPlaques, 'id', 'erected_at_decade', 'inscription', {
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
                    'site',
                ],
                descriptions: keyDescription
            });

            return Promise.resolve(clouds);
        },
        getById: function (plaqueId) {
            var found = _.find(plaques, { 'id': +plaqueId });
            return Promise.resolve(found);
        },
        list: function () {

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
        search: function (searchTerm) {

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
                if (searchTerm === '' || rowMatch(terms, candidate.SearchKey)) {
                    rowCount++;
                    results.push(candidate);
                }
            }

            return Promise.resolve(results);
        },
        stream: function (searchTerm, startCallback, rowCallback, endCallback) {
            if (searchTerm === null) {
                return;
            }

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

                if (searchTerm === '' || rowMatch(terms, candidate.SearchKey)) {
                    rowCount++;
                    rowCallback(candidate);
                }
            }

            console.log('done total', rowCount, 'of', plaques.length);
            if (endCallback !== undefined) {
                endCallback({ rowCount: rowCount, total: results.length });
            }
        }
    };
};
