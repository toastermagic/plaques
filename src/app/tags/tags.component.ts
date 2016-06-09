import {ChangeDetectorRef,
  ViewEncapsulation,
  Component,
  OnInit,
  OnDestroy} from '@angular/core';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';
import * as D3 from 'd3';
import * as _ from 'lodash';
import {MATERIAL_DIRECTIVES} from 'ng2-material';
// import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {HighlightPipe, PlaqueService} from '../shared';
import {CarouselComponent} from './carousel.component';

const cloud: any = require('d3-cloud');

@Component({
  moduleId: 'app/tags/',
  selector: 'sg-tags',
  template: require('./tags.component.html'),
  styles: [require('./tags.component.scss')],
  pipes: [HighlightPipe],
  directives: [MATERIAL_DIRECTIVES, MD_SIDENAV_DIRECTIVES, CarouselComponent],
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements OnInit, OnDestroy {
  private data: any;
  private subscription: Subscription;

  hand: any = [];
  word: string;

  onDeal: Subject<any> = new Subject<any>();
  onWordCloud = new Subject<any>();

  handTop: string = '0px';

  selectedYear: any;
  years: any;
  description: string;

  constructor(
    private plaqueService: PlaqueService,
    private cdr: ChangeDetectorRef) {

    window.onresize = () => {
      this.onResize(() => {
        this.handTop = (window.innerHeight / 6) + 'px';
        this.showYear(this.selectedYear);
      });
    };

    this.handTop = (window.innerHeight / 6) + 'px';
  }

  ngOnInit() {
    this.subscription = this.plaqueService.tags().subscribe((data) => {
      this.data = data;
      this.years = _.sortBy(data, 'key');
      this.showYear(this.years[this.years.length - 1]);
    });

    this
      .onWordCloud
      .subscribe((words) => {
        this.write(words);
      });
  }

  onWordClick = (word) => {
    this
      .scram(word)
      .subscribe((result) => {
        this.hand = word.plaques;
        this.word = word.id;
      });
  }

  showYear = (year) => {
    this.selectedYear = year;

    this.makeCloud(year);
  }

  makeCloud = (year?) => {
    year = year || this.selectedYear;

    let tags = year.words.map((d) => {
      return { id: d.word, plaques: d.plaques };
    });
    var max = D3.max(tags, (t: any) => t.plaques.length);
    var maxFont = (window.innerWidth / 1600) * 100;
    let scale = D3.scale.linear().domain([0, max]).range([10, maxFont]);

    cloud()
      .size([window.innerWidth, window.innerHeight - 80])
      .words(tags)
      .padding(window.innerWidth / 150)
      .rotate(() => Math.random() > 0.5 ? 90 : 0)
      .font('Roboto')
      .fontSize((d) => Math.floor(scale(d.plaques.length)))
      .on('end', (words) => {
        this.onWordCloud.next(words);
      }).start();
  }

  carouselClose() {
    this.hand = [];
    this.word = '';

    this.makeCloud(this.selectedYear);
  }

  scram = (exceptWord) => {
    let words = D3
      .select('#d3div')
      .selectAll('div');

    let finishedA = new Subject<boolean>();
    let finishedB = new Subject<boolean>();

    let workToDoA: boolean;
    let workToDoB: boolean;

    finishedA.startWith(false);
    let wordsA = words
      .filter((d) => exceptWord.id != d.id);

    if (wordsA.length > 0) {
      workToDoA = true;

      wordsA
        .transition()
        .duration(250)
        .delay((a, b) => b * 50)
        .style('opacity', '0')
        // .remove()
        .call(this.endAll, () => {
          finishedA.next(true);
          finishedA.complete();
        });
    }

    finishedB.startWith(false);
    let wordsB = words
      .filter((d) => exceptWord.id === d.id);

    if (wordsB.length > 0) {
      workToDoB = true;

      wordsB
        .transition()
        .delay(500)
        .duration(750)
        .each('start', (a, b) => {
          D3.select('#' + a.id)
            .style('transform', (d) => 'translate(-50%, -87%) rotate(0deg)');
        })
        .style('font-size', (d) => (window.innerWidth / 1600) * 90 + 'px')
        .style('left', (d) => ((window.innerWidth) / 2) + 'px')
        .style('top', (d) => ((window.innerHeight) / 8) + 'px')
        .call(this.endAll, () => {
          setTimeout(() => {
            finishedB.next(true);
            finishedB.complete();
          }, 750);
        });
    }

    if (!workToDoA) {
      finishedA.complete();
    }

    if (!workToDoB) {
      finishedB.complete();
    }

    return finishedA.combineLatest(finishedB);
  }

  write = (words) => {
    let fill = D3.scale.category20();
    let data =
      D3.select('#d3div').selectAll('div').data(words, (w: any) => w.id);

    data
      .on('click', (clickedWord) => { this.onWordClick(clickedWord); })
      // .transition()
      // .duration(() => 500 + Math.random() * 500)
      // .delay((a, b) => b * 20)
      .each((a, b) => {
        setTimeout(() => {
          D3
            .select('#' + a.id)
            .style('transform', (d) => 'translate(-50%, -87%) rotate(' + d.rotate + 'deg)')
            .style('font-size', (d) => d.size + 'px')
            .style('color', () => fill(b.toString()))
            .style('opacity', '1')
            .style('left', (d) => d.x + ((window.innerWidth) / 2) + 'px')
            .style('top', (d) => d.y - 20 + ((window.innerHeight) / 2) + 'px');
        }, b * 50);
      });

    data
      .enter()
      .append('div')
      .attr('id', (d) => d.id)
      .classed('tagWord', true)
      .on('click', (clickedWord) => { this.onWordClick(clickedWord); })
      .style('font-family', 'Roboto')
      .style('font-size', (d) => d.size + 'px')
      .style('color', (d, i) => fill(i.toString()))
      .style('left', (d) => d.x + ((window.innerWidth) / 2) + 'px')
      .style('top', (d) => d.y - 20 + ((window.innerHeight) / 2) + 'px')
      .style('transform', (d) => 'translate(-50%, -87%) rotate(' + d.rotate + 'deg)')
      .text((d) => d.id)
      .style('opacity', '0')
      .transition()
      .delay((a, b) => b * 50)
      .duration(0.5e3)
      .style('opacity', '1');

    data
      .exit()
      .transition()
      .delay((a, b) => b * 50)
      .duration(500)
      .style({ 'opacity': 0 })
      .remove();
  }

  endAll = (transition, callback) => {
    if (transition.size() === 0) {
      callback();
    }
    var n = 0;
    transition
      .each(function () {
        ++n;
      })
      .each('end', function () {
        if (!--n) {
          callback.apply(this, arguments);
        }
      });
  }

  onResize = (c, t?) => {
    onresize = function () {
      clearTimeout(t);
      t = setTimeout(c, 100);
    };
    return c;
  };

  ngOnDestroy = () => {
    this.subscription.unsubscribe();
  }
}

