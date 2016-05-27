/// <reference path="../typings/main/index.d.ts"/>

import appServer from './webpack-server';
import apiServer from './api-server';

const PORT = process.env.PORT || 5000;
const PROD = process.env.NODE_ENV === 'production';

if (PROD) {
  apiServer(PORT);
} else {
  apiServer(PORT - 1);
  appServer(PORT);
}
