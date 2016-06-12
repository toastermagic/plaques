/// <reference path="../typings/browser/index.d.ts" />

declare var API_URL_PREFIX: string;
declare var GMAPS_API_KEY: string;

interface GlobalEnvironment {
  API_URL_PREFIX;
  GMAPS_API_KEY;
}

interface Global extends GlobalEnvironment {}