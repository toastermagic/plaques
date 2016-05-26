import {OnInit, Component } from '@angular/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdIcon} from 'ng2-material';
import {PlaquesComponent} from './plaques';
import {TagsComponent} from './tags';
import {Route, Routes, ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: 'app',
  selector: 'plaques-app',
  templateUrl: 'app/home.component.html',
  styleUrls: ['home.component.css'],
  directives: [MdIcon, MdToolbar, ROUTER_DIRECTIVES, TagsComponent]
})
// @Routes([
//   new Route({path:'/home', component: PlaquesComponent}),
//   new Route({path:'/tags', component: TagsComponent}),
// ])
export class HomeComponent {
  constructor() {
    console.log('home constructed');
  }
}
