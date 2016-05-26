import { Component, OnInit } from '@angular/core';
import {MD_GRID_LIST_DIRECTIVES} from '@angular2-material/grid-list';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {Dir} from '@angular2-material/core/rtl/dir';
import {PlaqueService} from '../shared';

@Component({
  moduleId: module.id,
  selector: 'app-plaques',
  templateUrl: 'plaques.component.html',
  styleUrls: ['plaques.component.css'],
  directives: [MD_GRID_LIST_DIRECTIVES, MD_INPUT_DIRECTIVES],
  providers: [Dir]
})
export class PlaquesComponent implements OnInit {
  plaques: any;
  searchTerm: string;

  constructor(private plaqueService: PlaqueService) {
    console.log('constructed');
  }

  ngOnInit() {
    this.plaqueService
      .listPlaques()
      .subscribe((tags) => { this.plaques = tags; });
  }
  
  search() {
    this.plaqueService
      .getPlaques(this.searchTerm)
      .subscribe((tags) => { this.plaques = tags; });
  }
}
