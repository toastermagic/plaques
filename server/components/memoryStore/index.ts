/// <reference path="../../../typings/main/index.d.ts"/>

'use strict';
import * as _ from 'underscore';
var fs = require('fs');
var cloud = require('../cloud');
var parse = require('csv-parse');
var plaques = [];

function fileExists(filePath) {
    var p = new Promise((res, rej) => {
        try {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    res(false);
                    return;
                }

                if (stats.isFile()) {
                    res(true);
                } else {
                    res(false);
                }
            });
        } catch (err) {
            res(false);
        }
    });

    return p;
}

export default (path) => {
    var ready = false;
    var excludeList = [];

    function keyDescription(key) {
        switch (key) {
            case '1900':
                return 'It\'s the turn of the last century';
            case '1910':
                return '1910 - 1920, tablets and erections are prevalent';
            case '1920':
                return 'The roaring twenties were mainly characterised ' +
                        'by the veneration of bridges';
            case '1930':
                return 'John and George seem to be popular names';
            case '1940':
                return 'The 1940s, and a great conflict is commemorated';
            case '1950':
                return 'Poets, novelists, and statesmen die - while Bristol get\'s a mention';
            case '1960':
                return 'Writers take top spot in this decade';
            case '1970':
                return 'The 70s: architects, painters and novelists.';
            case '1980':
                return 'Manchester was a very popular place to be in the 80s';
            case '1990':
                return 'The words \'school\', \'world\' and \'pioneer\' all feature' +
                        'for the first time';
            case '2000':
                return 'A century is celebrated, and the renaissance of Leeds begins';
            case '2010':
                return 'The most common words on plaques of each decade';
        }
    }

    function rowMatch(terms, row) {
        var isMatch = true;
        for (var index = 0; index < terms.length; index++) {
            isMatch = isMatch && row.indexOf(terms[index]) > -1;
        }
        return isMatch;
    }

    function getSearchKey(obj) {
        return (obj.inscription).toLowerCase();
    }

    function readParsedFile(filepath) {
        var p = new Promise<any>((res, rej) => {
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    plaques = JSON.parse(data);
                    res(plaques);
                }
            });
        });

        return p;
    }

    function generateExcludeList() {
        fileExists(path + 'topWords.json')
            .then((found) => {
                if (found) {
                    fs.readFile(path + 'topWords.json', (err, data) => {
                        if (err) {
                            console.log('could not read exclude list');
                            return;
                        }
                        excludeList = JSON.parse(data);
                        console.log('read existing topwordslist', data.length, 'entries');
                    });
                } else {
                    console.log('generating top words list');
                    excludeList = cloud.topWordList(plaques, { topN: 50 });
                    fs.writeFile(path + 'topWords.json', JSON.stringify(excludeList), (err) => {
                        if (!err) {
                            console.log('written topwordslist');
                        } else {
                            console.log('could not write topwordslist');
                        }
                    });
                }
            });
    }

    return {
        connect: function () {
            if (ready) {
                return;
            }
            ready = true;
            console.log('memory store initialising', path);

            fileExists(path + 'plaques.parsed.json')
                .then((found) => {
                    if (found) {
                        console.log('found pre-parsed data');
                        readParsedFile(path + 'plaques.parsed.json')
                            .then((data) => {
                                plaques = data;
                                console.log('data read:', plaques.length, 'plaques');

                                generateExcludeList();
                            });
                    } else {
                        var parser = parse({ delimiter: ',' }, function (err, data) {
                            var cols = data[0];
                            for (var index = 1; index < data.length; index++) {
                                var newPlaque: any = _.object(cols, data[index]);
                                if (newPlaque.main_photo) {
                                    newPlaque.search_key = getSearchKey(newPlaque);
                                    plaques.push(newPlaque);
                                }
                            }

                            generateExcludeList();

                            fs.writeFile(path + 'plaques.parsed.json',
                                JSON.stringify(plaques), (writeErr) => {
                                    if (!err) {
                                        console.log('parsed file written ok');
                                    } else {
                                        console.log('failed to write parsed file', writeErr);
                                    }
                                });
                        });

                        fs.createReadStream(path + 'open-plaques-all-2016-05-22.csv').pipe(parser);
                    }
                });
        },
        tags: function () {
            var tagPlaques = _.filter(plaques, function (p) {
                if (!p.erected
                    || p.erected.startsWith('16')
                    || p.erected.startsWith('17')
                    || p.erected.startsWith('18')) {
                    return;
                }

                p.erected_decade = p.erected.substring(0, 3) + '0';
                return p.inscription && p.erected;
            });

            var clouds = cloud.cloudThis(
                tagPlaques,
                'id',
                'erected_decade',
                'inscription',
                {
                    topN: 15,
                    minCount: 1,
                    exclude: excludeList,
                    descriptions: keyDescription
                });

            return Promise.resolve(clouds);
        },
        getById: function (plaqueId) {
            var found = _.find(plaques, { 'id': plaqueId });
            return Promise.resolve(found);
        },
        getByIdList: function (list) {
            console.log(list);
            return Promise.resolve();
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
                if (searchTerm === '' || rowMatch(terms, candidate.search_key)) {
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
