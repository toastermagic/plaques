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
  private subscription: Subscription;

  hand: any = [];

  onDeal: Subject<any> = new Subject<any>();
  onWordCloud = new Subject<any>();

  handTop: string = '0px';

  selectedYear: any;
  years: any;
  description: string;
  private showIndex: number;
  private selectedWord: any;

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

    this.onDeal.subscribe((list) => {
      this.deal(list);
    });
  }

  //  undeal hand, then reshow tag cloud
  goBack = () => {
    this
      .undealHand()
      .subscribe(() => { }, () => { }, () => {
        this.showYear(this.selectedYear);
      });
  }

  showMore = () => {
    this
      .undealCard()
      .subscribe(() => {
        this
          .plaqueService
          .getPlaque(this.selectedWord.plaques[this.showIndex])
          .subscribe((card) => {
            this.hand.push({
              plaque: card,
              position: this.hand.length + 1,
              visible: true
            });
            this.showIndex++;
          });
      });
  }

  undealCard = () => {
    let p = new Subject<boolean>();

    if (!this.hand || this.hand.length === 0) {
      p.next(false);
    } else {
      setTimeout(() => {
        this.hand.shift();
        // this.hand.splice(0, 1);
        p.next(true);
      }, 500 * this.hand.length);

      this.hand[0].visible = false;
    }

    return p;
  }

  onWordClick = (word) => {
    this.selectedWord = word;

    let available = _.clone(word.plaques);
    let requests = [];

    this.showIndex = 0;

    while (available.length > 0 && requests.length < 3) {
      let next = available.pop();
      let obs = this.plaqueService.getPlaque(next);
      requests.push(obs);
      this.showIndex++;
    }

    this
      .scram(word)
      .combineLatest(requests)
      .subscribe(
      (result) => {
        // result will have 'scram' at index 0, so remove it
        result.splice(0, 1);
        this.onDeal.next(result);
      },
      (err) => {
        console.log(err);
      });
  }

  deal = (cards) => {
    for (var index = 0; index < cards.length; index++) {
      let card = {
        plaque: cards[index],
        position: index + 1,
        visible: true
      };

      setTimeout(() => {
        this.hand.push(card);
      }, 500 * index);
    };
  }

  showYear = (year) => {
    this.selectedYear = year;

    this.makeCloud(year);
    // this.undealHand()
    //   .subscribe(() => { }, () => { }, () => { this.layout.start(); });
  }

  undealHand = () => {
    let p = new Subject<boolean>();

    if (!this.hand || this.hand.length === 0) {
      p.complete();
    } else {
      setTimeout(() => {
        this.hand = [];
        p.complete();
      }, 500 * this.hand.length);

      for (var index = 0; index < this.hand.length; index++) {
        let c = this.hand[index];

        setTimeout(() => {
          c.visible = false;
        }, 500 * index);
      }
    }

    return p;
  }

  makeCloud = (year?) => {
    year = year || this.selectedYear;

    let tags = year.cloud.map((d) => {
      return { id: d.word, plaques: d.plaques, text: d.word, count: d.count };
    });
    var max = D3.max(tags, (t: any) => t.count);
    var maxFont = (window.innerWidth / 1600) * 120;
    let scale = D3.scale.linear().domain([0, max]).range([10, maxFont]);

    cloud()
      .size([window.innerWidth, window.innerHeight - 80])
      .words(tags)
      .padding(window.innerWidth / 100)
      .rotate(() => Math.random() > 0.5 ? 90 : 0)
      .font('Roboto')
      .fontSize((d) => Math.floor(scale(d.count)))
      .on('end', (words) => {
        this.onWordCloud.next(words);
      }).start();
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
        .remove()
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
          finishedB.next(true);
          finishedB.complete();
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
      .transition()
      .delay((a, b) => b * 20)
      .duration(() => 500 + Math.random() * 500)
      .each('start', (a, b) => {
        D3
          .select('#' + a.id)
          .style('transform', (d) => 'translate(-50%, -87%) rotate(' + d.rotate + 'deg)');
      })
      .style('font-size', (d) => d.size + 'px')
      .style('color', (d, i) => fill(i.toString()))
      .style('left', (d) => d.x + ((window.innerWidth) / 2) + 'px')
      .style('top', (d) => d.y - 20 + ((window.innerHeight) / 2) + 'px');

    data
      .enter()
      .append('div')
      .attr('id', (d) => d.text)
      .classed('tagWord', true)
      .on('click', (clickedWord) => { this.onWordClick(clickedWord); })
      .style('font-family', 'Roboto')
      .style('font-size', (d) => d.size + 'px')
      .style('color', (d, i) => fill(i.toString()))
      .style('left', (d) => d.x + ((window.innerWidth) / 2) + 'px')
      .style('top', (d) => d.y - 20 + ((window.innerHeight) / 2) + 'px')
      .style('transform', (d) => 'translate(-50%, -87%) rotate(' + d.rotate + 'deg)')
      .text((d) => d.text)
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

