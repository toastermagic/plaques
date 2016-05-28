var _ = require('lodash');

module.exports = {
    cloudThis: function (objectList, idProp, keyProp, textProp, options) {
        let exclude = options.exclude || [];
        let topN = options.topN || 50;
        let minCount = options.minCount || 1;

        // text by key
        var results = _.reduce(objectList, function (clouds, obj) {
            var objKey = obj[keyProp];

            var existing = _.filter(clouds, { 'key': objKey })[0];

            if (existing) {
                makeCloud(obj[textProp], obj[idProp], existing.cloud);
            } else {
                var newCloud = makeCloud(obj[textProp], obj[idProp]);

                clouds.push({
                    key: objKey,
                    cloud: newCloud
                });
            }

            return clouds;
        }, []);

        _(results).forEach(function (r) {
            r.cloud = _(Object.keys(r.cloud))
                .filter(function(w) { return exclude.indexOf(w) ===-1; })
                .filter(function(w) { return r.cloud[w].length > minCount; })
                .sortBy(function (w) { return r.cloud[w].length * -1; })
                .map(function(w) {
                    return {word: w, count: r.cloud[w].length, plaques: r.cloud[w]}; })
                .take(topN)
                .value();
        });

        return results;
    }
};

function makeCloud(text, id, existing?) {
    var freqMap = existing || {};

    var wordsplit = text.toLowerCase().replace(/[.,0-9\-\(\)]/g, '').split(/\s/);
    wordsplit.forEach(function (w) {
        if (w.length > 2) {
            addWord(freqMap, w, id);
        }
    });

    return freqMap;
}

function addWord(collection, word, id) {
    if (!collection[word]) {
        collection[word] = [id];
    } else {
        collection[word].push(id);
    }
}
