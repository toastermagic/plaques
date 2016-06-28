var Twitter = require('node-tweet-stream'),
    t = new Twitter({
        consumer_key: '0BtxpLJ1RlTtp1XL9LduRNezd',
        consumer_secret: 'vjPJYDofLsmOmYw6izgFhgRThMtiwv15Hu1DDbqYJDoV491e7l',
        token: '17777662-IPtB8f69aLlJd0iFYZaWatM16uMOOXm6gdDRAJfbw',
        token_secret: '7ZhnZTgPD1naCgSmfrnfEaTHRrgIsEnJd4JlfeCUjERGo'
    });

var TwitterApi = require('twitter'),
    tApi = new TwitterApi({
        consumer_key: '0BtxpLJ1RlTtp1XL9LduRNezd',
        consumer_secret: 'vjPJYDofLsmOmYw6izgFhgRThMtiwv15Hu1DDbqYJDoV491e7l',
        access_token_key: '17777662-IPtB8f69aLlJd0iFYZaWatM16uMOOXm6gdDRAJfbw',
        access_token_secret: '7ZhnZTgPD1naCgSmfrnfEaTHRrgIsEnJd4JlfeCUjERGo'
    });

var NodeCache = require('node-cache');
var myCache = new NodeCache({
    stdTTL: 120,
    checkperiod: 0
});
var io;
var sys = require('sys'),
    events = require('events');

var tweetQueue = [];

emitTweet();
// emitFollowing();

function TwitterWatcher() {
    if (!(this instanceof TwitterWatcher)) {
        return new TwitterWatcher();
    }

    events.EventEmitter.call(this);
}

sys.inherits(TwitterWatcher, events.EventEmitter);

function getClosest(lat, long, callback) {
    tApi.get('/trends/closest', {
        lat: lat,
        long: long
    },
        function (err, data) {
            if (err) {
                console.log(err)
                if (err.code != 88) {
                    throw err;
                } else {
                    callback(null);
                }
            }

            callback(data);
        });
}

function getTrends(woeid, callback) {
    console.log('trend request for', woeid)

    var cacheKey = 'trend_' + woeid;
    var cachedTrends = myCache.get(cacheKey);

    if (!cachedTrends[cacheKey]) {
        console.log('refreshing cache trends');

        tApi.get('/trends/place', {
            id: woeid
        }, function (err, data) {
            if (err) {
                console.log(err);
                throw err;
            }

            myCache.set(cacheKey, data[0]);

            callback(data[0].trends)
        });
    } else {
        console.log('returning trends from cache')
        callback(cachedTrends[cacheKey].trends);
    }
}

function nearbyTweets(subject, lat, long) {
    var p = new Promise<any>((res, rej) => {
        tApi.get('/search/tweets', {
            q: subject,
            geocode: lat + ',' + long + ',1km'
        }, (err, data) => {
            if (err) {
                console.log(err);
                rej(err);
            }

            res(data);
        });
    });

    return p;
}

function track(item) {
    // if (!playerState[socketId])
    //     return;

    // if (playerState[socketId].tracking) {
    //     twitterWatch.untrack(playerState[socketId].tracking);
    // }

    // playerState[socketId].tracking = item;
    // playerState.score = 0;

    t.track(item);

    // return playerState;
}

function reset() {
    t.untrack(t.tracking());
}

function untrack(item) {
    t.untrack(item);
}

// function newPlayer(socketId, name) {
//     playerState[socketId] = {
//         socketId: socketId,
//         name: name
//     };
// }

function emitFollowing() {
    console.log('tracking', t.tracking());

    setTimeout(function () {
        emitFollowing();
    }, 10000);
}

function emitTweet() {
    if (tweetQueue.length > 0) {
        var tweet = tweetQueue.pop();

        io.sockets.emit('tweet', tweet);
        console.log(tweet.text);
        setTimeout(function () {
            io.sockets.emit('tweetExpire', tweet.id);
        }, 5000);
    }

    setTimeout(function () {
        emitTweet();
    }, 1000);
}

t.on('tweet', function (tweet) {
    if (tweetQueue.length > 20) {
        return;
    }
    tweetQueue.push(tweet);
});

t.on('limit', function (data) {
    console.log('limit', new Date(), data);
});

t.on('warning', function (data) {
    console.log('warning', new Date(), data);
});

t.on('delete', function (data) {
    console.log('delete', new Date(), data);
});

t.on('scrub_geo', function (data) {
    console.log('scrub_geo', new Date(), data);
});

t.on('status_withheld', function (data) {
    console.log('status_withheld', new Date(), data);
});

t.on('user_withheld', function (data) {
    console.log('user_withheld', new Date(), data);
});

t.on('disconnect', function (data) {
    console.log('disconnect', new Date(), data);
});

t.on('reconnect', function (data) {
    console.log('reconnect', new Date(), data);
});

// module.exports = function (socketIo) {
//     io = socketIo;
//     return {
//         track: track,
//         untrack: untrack,
//         getTrends: getTrends,
//         nearbyTweets: nearbyTweets,
//         reset: reset,
//         getClosest: getClosest
//     }
// }

export default () => {
    return {
        track: track,
        untrack: untrack,
        getTrends: getTrends,
        nearbyTweets: nearbyTweets,
        reset: reset,
        getClosest: getClosest
    };
};
