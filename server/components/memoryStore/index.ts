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

    function parseFile(filePath) {
        var p = new Promise<any>((res, rej) => {
            console.log('parsing csv file', filePath);
            var plaqueList = [];
            var parser = parse({ delimiter: ',' }, (err, data) => {
                if (err) {
                    rej(err);
                    return;
                }

                var cols = data[0];
                for (var index = 1; index < data.length; index++) {
                    var newPlaque: any = _.object(cols, data[index]);

                    if (!newPlaque.main_photo
                        || !newPlaque.erected
                        || newPlaque.erected.startsWith('16')
                        || newPlaque.erected.startsWith('17')
                        || newPlaque.erected.startsWith('18')) {
                        continue;
                    }

                    newPlaque.search_key = getSearchKey(newPlaque);
                    newPlaque.erected_decade = newPlaque.erected.substring(0, 3) + '0';
                    plaqueList.push(newPlaque);
                };

                res(plaqueList);
            });

            fs.createReadStream(filePath).pipe(parser);
        });

        return p;
    }

    function readParsedFile(filepath) {
        var p = new Promise<any>((res, rej) => {
            console.log('reading json file', filepath);
            fs.readFile(filepath, (err, data) => {
                if (err) {
                    rej(err);
                } else {
                    let plaqueArray: any[] = JSON.parse(data);
                    res(plaqueArray);
                }
            });
        });

        return p;
    }

    function writeJson(filePath, data) {
        var p = new Promise((res, rej) => {
            console.log('writing json file', filePath);
            fs.writeFile(filePath, JSON.stringify(data), (writeErr) => {
                if (!writeErr) {
                    console.log('parsed file written ok');
                    res();
                } else {
                    console.log('failed to write parsed file', writeErr);
                    rej(writeErr);
                }
            });
        });

        return p;
    }

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
                    var promise = found
                        ? readParsedFile(path + 'plaques.parsed.json')
                        : parseFile(path + 'open-plaques-United-Kingdom-2016-05-22.csv');

                    promise
                        .then((data) => {
                            plaques = data;
                            console.log('plaques ready:', plaques.length, 'plaques');

                            if (!found) {
                                // we've read & processed it, now save it for next time
                                return writeJson(path + 'plaques.parsed.json', data);
                            } else {
                                return Promise.resolve();
                            }
                        })
                        .then((data) => {
                            generateExcludeList();
                        });
                });
        },
        tags: function () {
            var clouds = cloud.cloudThis(
                plaques,
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
