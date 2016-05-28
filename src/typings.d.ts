/// <reference path="../typings/browser/index.d.ts" />

declare var API_URL_PREFIX: string;

interface GlobalEnvironment {
    API_URL_PREFIX;
}

interface Global extends GlobalEnvironment {}