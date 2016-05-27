import {enableProdMode} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS} from '@angular/router';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';

import {HomeComponent, environment} from './app/';
import {PlaqueService} from './app/shared';

if (environment.production) {
  enableProdMode();
}

bootstrap(
    HomeComponent,
    [PlaqueService, ROUTER_PROVIDERS, HTTP_PROVIDERS, MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS]);
