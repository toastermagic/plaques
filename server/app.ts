/// <reference path="../typings/main/index.d.ts"/>

import appServer from './webpack-server';
import apiServer from './api-server';
import * as _ from 'underscore';

const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';

var server;

if (PROD) {
  server = apiServer(PORT);
} else {
  server = apiServer(PORT - 1);
  appServer(PORT);
}

// var io = require('socket.io').listen(server);
// var twitterWatch = require('./components/twitter-watch')(io);

// twitterWatch.track('plaque');
// twitterWatch.nearbyTweets().then((tweets) => {
//   if (tweets.statuses.length === 0) {
//     console.log('no tweets found');
//     return;
//   }

//   _(tweets.statuses).each((t) => {
//     console.log(t.text);
//   });
// });
