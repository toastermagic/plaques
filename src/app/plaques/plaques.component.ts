import {Component, OnInit} from '@angular/core';
import {Dir} from '@angular2-material/core/rtl/dir';
import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {PlaqueService} from '../shared';

@Component({
  moduleId: 'app/plaques/',
  selector: 'sg-plaques',
  template: require('./plaques.component.html'),
  styles: [require('./plaques.component.scss')],
  directives: [MD_GRID_LIST_DIRECTIVES, MD_INPUT_DIRECTIVES],
  providers: [Dir]
})
export class PlaquesComponent implements OnInit {
  plaques: any;
  searchTerm: string;

  constructor(private plaqueService: PlaqueService) { console.log('plaques constructed'); }

  ngOnInit() {
    this.plaqueService.listPlaques().subscribe((tags) => { this.plaques = tags; });
  }

  search() {
    this.plaqueService.getPlaques(this.searchTerm).subscribe((tags) => { this.plaques = tags; });
  }
}
