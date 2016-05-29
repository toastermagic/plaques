import {ChangeDetectorRef,
   ViewChild,
   ViewEncapsulation,
   Component,
   OnInit,
   OnDestroy} from '@angular/core';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import * as D3 from 'd3';
import * as _ from 'lodash';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {Subscription} from 'rxjs/Subscription';

import {HighlightPipe, PlaqueService} from '../shared';

import {PlaqueCardComponent} from './plaque-card.component';

const cloud: any = require('d3-cloud');

@Component({
  moduleId: 'app/tags/',
  selector: 'sg-tags',
  template: require('./tags.component.html'),
  styles: [require('./tags.component.scss')],
  pipes: [HighlightPipe],
  directives: [MATERIAL_DIRECTIVES, MD_SIDENAV_DIRECTIVES, PlaqueCardComponent],
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements OnInit, OnDestroy {
  private data: any;
  private layout: any;
  private subscription: Subscription;

  @ViewChild('sidebar') sidebar;
  @ViewChild(PlaqueCardComponent) plaqueCard: PlaqueCardComponent;

  cardLeft: number;
  cardTop: number;
  cardVisible: boolean;

  selectedYear: any;
  selectedWord: string;
  years: any;
  description: string;
  plaque: any;
  canvasWidth: number = 100;
  canvasHeight: number = 50;
  barOpen: boolean;

  constructor(
    private plaqueService: PlaqueService,
    private cdr: ChangeDetectorRef) {

    window.onresize = () => {
      this.onResize(() => {
        this.setPanelSize();
        this.showYear(this.selectedYear);
      });
    };
  }

  onResize = (c, t?) => {
    onresize = function () {
      clearTimeout(t);
      t = setTimeout(c, 100);
    };
    return c;
  };

  ngOnInit() {
    this.subscription = this.plaqueService.tags().subscribe((data) => {
      this.data = data;
      this.years = _.sortBy(data, 'key');
      this.showYear(this.years[this.years.length - 1]);
    });

    this.setPanelSize();
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }

  setPanelSize() {
    this.canvasHeight = window.innerHeight - 80;
    this.canvasWidth = window.innerWidth - (this.barOpen ? 350 : 0);
  }

  highlit(text) {
    text = text.replace(
      new RegExp('(' + this.selectedWord + ')', 'gi'),
      '<span class="myHighlight">$1</span>');
    return text;
  }

  toggleSidebar() {
    this.barOpen = !this.barOpen;
    if (this.barOpen) {
      this.sidebar.open(); // .then(this.showYear(this.selectedYear));
    } else {
      this.sidebar.close(); // .then(this.showYear(this.selectedYear));
    }
    setTimeout(() => {
      this.setPanelSize();
      this.showYear(this.selectedYear);
    }, 500);
  }

  onWordClick(word, year) {
    console.log('event', event);
    this.selectedWord = word.text;
    let list = year.cloud.filter(function (d) { return d.word === word.text; })[0];
    let randIndex = Math.floor(Math.random() * list.plaques.length);
    let pickId = list.plaques[randIndex];

    this.plaqueService.getPlaque(pickId).subscribe((plaque) => {
      this.plaque = plaque;
      this.cardVisible = true;
    });

    this.scram(word);
  }

  showYear(year) {
    this.selectedYear = year;
    this.makeCloud(year);
    this.plaque = null;

    this.layout.start();
  }

  makeCloud(year?) {
    year = year || this.selectedYear;

    let tags = year.cloud.map(function (d) {
      return { id: d.word, text: d.word, count: d.count };
    });
    var max = D3.max(tags, function (t: any) { return t.count; });
    var maxFont = (window.innerWidth / 1600) * 120;
    let scale = D3.scale.linear().domain([0, max]).range([10, maxFont]);

    this.layout = cloud()
      .size([this.canvasWidth, this.canvasHeight])
      .words(tags)
      .padding(10)
      .rotate(function () { return Math.random() > 0.5 ? 90 : 0; })
      .font('Roboto')
      .fontSize(function (d) { return Math.floor(scale(d.count)); })
      .on('end', (words) => this.draw(words, year));
  }

  scram(exceptWord) {
    let words = D3
      .select('#d3group')
      .selectAll('text');

    words
      .filter(function (d) { return exceptWord.id != d.id; })
      .transition()
      .duration(250)
      .delay(function (a, b) { return b * 50; })
      .style('opacity', '0')
      .remove();

    words
      .filter(function (d) { return exceptWord.id === d.id; })
      .transition()
      .delay(500)
      .duration(750)
      .attr(
      'transform',
      function (d: any) {
        return 'translate(0, -150)rotate(0)';
      })
      .style('font-size', function (d: any) {
        return (window.innerWidth / 1600) * 120 + 'px';
      });
  }

  draw(words, year) {
    let fill = D3.scale.category20();
    let data =
      D3.select('#d3group').selectAll('text').data(words, function (w: any) { return w.id; });

    data
      .on('click', (clickedWord) => { this.onWordClick(clickedWord, year); })
      .transition()
      .duration(1e3)
      .delay(function (a, b) { return b * 12; })
      .style('font-size', function (d: any) {
        return d.size + 'px';
      }).style('fill', function (d, i) {
        return fill(i.toString());
      }).attr('transform', function (d: any) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      });

    data
      .enter()
      .append('text')
      .style('font-size', function (d: any) { return d.size + 'px'; })
      .style('font-family', 'Roboto')
      .style('cursor', 'pointer')
      .style('fill', function (d, i) { return fill(i.toString()); })
      .style('opacity', '0')
      .attr('text-anchor', 'middle')
      .attr('transform', function (d: any) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      })
      .text(function (d: any) { return d.text; })
      .on('click', (clickedWord) => {
        this.onWordClick(clickedWord, year);
      })
      .transition()
      .delay(function (a, b) { return b * 50; })
      .duration(0.5e3)
      .style('opacity', '1');

    data
      .exit()
      .transition()
      .delay(function (a, b) { return b * 20; })
      .duration(0.5e3)
      .style('opacity', '0')
      .remove();
  }

  highlight(word) {
    let coords = word.rotate == 0 ?
      {
        x: word.x + word.x0,
        y: word.y + word.y0,
        width: word.x1 - word.x0,
        height: word.y1
      } :
      {
        x: word.x - word.padding,
        y: word.y + word.y0 - word.padding,
        width: word.x1,
        height: word.y1 - word.y0
      };

    D3
      .select('#d3group')
      .append('rect')
      .attr('id', 'highlightRect')
      .attr({
        'x': coords.x, 'y': coords.y,
        'width': coords.width, 'height': coords.height
      })
      .attr('fill', 'none')
      .attr('stroke', 'yellow')
      .attr('stroke-width', '2')
      .attr('class', 'hvr-pulse-grow');
  }
}
