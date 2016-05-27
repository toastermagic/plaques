import {Component} from '@angular/core';
import {Route, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdIcon} from 'ng2-material';

import {PlaquesComponent} from './plaques';
import {TagsComponent} from './tags';

@Component({
  moduleId: 'app/',
  selector: 'sg-plaques',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss'],
  directives: [MdIcon, MdToolbar, ROUTER_DIRECTIVES, TagsComponent]
})
@Routes([
  new Route({path: '/home', component: PlaquesComponent}),
  new Route({path: '/tags', component: TagsComponent}),
])
export class HomeComponent {
  constructor() { console.log('home constructed'); }
}
