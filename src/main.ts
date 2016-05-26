import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HomeComponent, environment } from './app/';
import { HTTP_PROVIDERS } from '@angular/http';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';
import {PlaqueService} from './app/shared';
import {ROUTER_PROVIDERS} from '@angular/router';

if (environment.production) {
  enableProdMode();
}

bootstrap(HomeComponent, [PlaqueService, ROUTER_PROVIDERS, HTTP_PROVIDERS, MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS]);

