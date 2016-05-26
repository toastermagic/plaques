import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HomeComponent, environment } from './app/';
import { HTTP_PROVIDERS } from '@angular/http';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS} from 'ng2-material';
import {PlaqueService} from './app/shared';

if (environment.production) {
  enableProdMode();
}

bootstrap(HomeComponent, [PlaqueService, HTTP_PROVIDERS, MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS]);

