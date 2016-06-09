import {Component} from '@angular/core';
import {Route, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdIcon} from 'ng2-material';

import {PlaquesComponent} from './plaques';
import {TagsComponent} from './tags';

import '../../node_modules/ng2-material/ng2-material.css';

@Component({
  moduleId: 'app/',
  selector: 'sg-plaques',
  template: require('./home.component.html'),
  styles: [ require('./home.component.scss') ],
  directives: [MdIcon, MdToolbar, ROUTER_DIRECTIVES, TagsComponent]
})
@Routes([
  new Route({path: '/home', component: PlaquesComponent}),
  new Route({path: '/tags', component: TagsComponent}),
])
export class HomeComponent {
  constructor() { }
}
