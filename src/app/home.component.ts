import {OnInit, Component } from '@angular/core';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdIcon} from 'ng2-material';
import {PlaquesComponent} from './plaques';

@Component({
  moduleId: module.id,
  selector: 'plaques-app',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [MdIcon, MdToolbar, PlaquesComponent]
})
export class HomeComponent {
  
}
