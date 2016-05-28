import {ChangeDetectorRef, ViewChild, ViewEncapsulation,
  Component, OnInit, OnDestroy} from '@angular/core';
import * as D3 from 'd3';
import {Subscription} from 'rxjs/Subscription';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import {MdButton} from '@angular2-material/button/button';
import {HighlightPipe, PlaqueService} from '../shared';
import {MdIcon} from 'ng2-material';
import * as _ from 'lodash';

const cloud: any = require('d3-cloud');

@Component({
  moduleId: 'app/tags/',
  selector: 'sg-tags',
  template: require('./tags.component.html'),
  styles: [require('./tags.component.scss')],
  pipes: [HighlightPipe],
  directives: [MD_SIDENAV_DIRECTIVES, MdIcon, MdButton],
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements OnInit, OnDestroy {
  private data: any;
  private layout: any;
  private subscription: Subscription;

  @ViewChild('sidebar') sidebar;

  selectedYear: any;
  selectedWord: string;
  years: any;
  description: string;
  plaque: any;
  canvasWidth: number = 100;
  canvasHeight: number = 50;
  barOpen: boolean = false;

  constructor(
    private plaqueService: PlaqueService,
    private cdr: ChangeDetectorRef) {

    window.onresize = () => {
      this.onResize(() => {
        this.setPanelSize();
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
    console.log('panel size', window.innerWidth, window.innerHeight);
    this.canvasHeight = window.innerHeight - 80;
    this.canvasWidth = window.innerWidth - (this.barOpen ? 300 : 0);
    this.cdr.detectChanges();
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
      this.sidebar.open();
    } else {
      this.sidebar.close();
    }
    this.setPanelSize();
  }

  showRandomPlaque(word, year) {
    this.selectedWord = word;
    let list = year.cloud.filter(function (d) { return d.word === word; })[0];
    let randIndex = Math.floor(Math.random() * list.plaques.length);
    let pickId = list.plaques[randIndex];

    this.plaqueService.getPlaque(pickId).subscribe((plaque) => {
      this.plaque = plaque;
    });
  }

  showYear(year) {
    console.log(year);
    this.selectedYear = year;
    this.makeCloud(year);
    this.showRandomPlaque(year.cloud[0].word, year);

    this.layout.start();
  }

  makeCloud(year) {
    let tags = year.cloud.map(function (d) {
      return { id: d.word, text: d.word, count: d.count };
    });
    var max = D3.max(tags, function (t: any) { return t.count; });
    let scale = D3.scale.linear().domain([0, max]).range([20, 150]);

    this.layout = cloud()
      .size([this.canvasWidth, this.canvasHeight])
      .words(tags)
      .padding(15)
      .rotate(function () { return Math.random() > 0.5 ? 90 : 0; })
      .font('Roboto')
      .fontSize(function (d) { return Math.floor(scale(d.count)); })
      .on('end', (words) => this.draw(words, year));
  }

  draw(words, year) {
    let fill = D3.scale.category20();
    let data =
      D3.select('#d3group').selectAll('text').data(words, function (w: any) { return w.id; });

    data.transition().duration(1e3).style('font-size', function (d: any) {
      return d.size + 'px';
    }).style('fill', function (d, i) {
      return fill(i.toString());
    }).attr('transform', function (d: any) {
      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
    });

    data.enter()
      .append('text')
      .style('font-size', function (d: any) { return d.size + 'px'; })
      .style('font-family', 'Roboto')
      .style('cursor', 'pointer')
      .style('fill', function (d, i) { return fill(i.toString()); })
      .style('opacity', '0')
      .attr('text-anchor', 'middle')
      .attr(
      'transform',
      function (d: any) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      })
      .text(function (d: any) { return d.text; })
      .on('click', (clickedWord) => { this.showRandomPlaque(clickedWord.id, year); })
      .transition()
      .duration(0.5e3)
      .style('opacity', '1');

    data.exit().transition().duration(0.5e3).style('opacity', '0').remove();
  }
}
