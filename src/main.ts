import {provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS} from '@angular/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';

import {HomeComponent} from './app/';
import {PlaqueService} from './app/shared';

import {ANGULAR2_GOOGLE_MAPS_PROVIDERS,
        LazyMapsAPILoaderConfig,
        LazyMapsAPILoader,
        MapsAPILoader} from 'angular2-google-maps/core';

let config = new LazyMapsAPILoaderConfig();
config.apiKey = GMAPS_API_KEY;
config.libraries = ['places'];
let loader = new LazyMapsAPILoader(config);

bootstrap(
    HomeComponent,
    [PlaqueService,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    MATERIAL_DIRECTIVES,
    MATERIAL_PROVIDERS,
    provide(MapsAPILoader, {useValue: loader})]);
