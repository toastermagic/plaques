import * as _ from 'underscore';

module.exports = {
    topWordList: function (objectList, options) {
        let topN = options.topN || 50;

        var tags = analyseAll(objectList);
        let words = _(Object.keys(tags))
            .map((w) => {
                return {
                    word: w,
                    plaqueCount: tags[w]
                };
            });

        let sorted = _.sortBy(words, (w) => w.plaqueCount * -1);
        let topList = _.first(sorted, topN).map((w) => w.word);

        return topList;
    },

    cloudThis: function (objectList, idProp, keyProp, textProp, options) {
        let exclude = options.exclude || [];
        let topN = options.topN || 50;
        let minCount = options.minCount || 1;
        let descFinder = options.descriptions || function () { return null; };

        var plaqueLists = _.groupBy(objectList, (o) => {
            return o[keyProp];
        });

        let toplist = _.map(Object.keys(plaqueLists), function (key) {
            var tags = analyseArray(plaqueLists[key]);
            let words = _(Object.keys(tags))
                .filter((w) => exclude.indexOf(w) === -1)
                .map((w) => {
                    return {
                        word: w,
                        plaques: _.uniq(tags[w], (t) => t.id)
                    };
                })
                .filter((w) => w.plaques.length > minCount);

            let sorted = _.sortBy(words, (w) => w.plaques.length * -1);
            let top10 = _.first(sorted, topN);

            return {
                key: key,
                words: top10,
                description: descFinder(key)
            };
        });

        return toplist;
    }
};

function analyseArray(plaques) {
    let freqMap = {};

    plaques.forEach((p) => {
        var wordsplit = p.inscription.toLowerCase().replace(/[.,0-9\-\(\)]/g, '').split(/\s/);
        wordsplit.forEach((w) => {
            if (w.length > 2) {
                if (!freqMap[w]) {
                    freqMap[w] = [getPlaque(p)];
                } else {
                    freqMap[w].push(getPlaque(p));
                }
            }
        });
    });

    return freqMap;
}

function getPlaque(plaque) {
    return {
        id: plaque.id,
        url: plaque.main_photo,
        inscription: plaque.inscription,
        title: plaque.title,
        coords: {
            latitude: plaque.latitude,
            longitude: plaque.longitude
        }
    };
}

function analyseAll(plaques) {
    let freqMap = {};

    plaques.forEach((p) => {
        var wordsplit = p.inscription.toLowerCase().replace(/[.,0-9\-\(\)]/g, '').split(/\s/);
        wordsplit.forEach((w) => {
            if (w.length > 2) {
                if (!freqMap[w]) {
                    freqMap[w] = 1;
                } else {
                    freqMap[w]++;
                }
            }
        });
    });

    return freqMap;
}
