import {Component, OnInit, OnDestroy} from '@angular/core';
import * as D3 from 'd3';
import {Subscription} from 'rxjs/Subscription';

import {PlaqueService} from '../shared';

const cloud: any = require('d3-cloud');

@Component({
  moduleId: 'app/tags/',
  selector: 'sg-tags',
  template: require('./tags.component.html'),
  styles: [require('./tags.component.scss')]
})
export class TagsComponent implements OnInit,
    OnDestroy {
  private data: any;
  private layout: any;
  private subscription: Subscription;

  selectedYear: any;
  years: any;
  description: string;

  constructor(private plaqueService: PlaqueService) {}

  ngOnInit() {
    this.subscription = this.plaqueService.tags().subscribe((data) => {
      this.data = data;
      this.years = data.map(function(y) { return y.key; }).sort().map(function(d) {
        return {key: d, selected: false};
      });
      this.showYear(this.years[this.years.length - 1]);
    });
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }

  yearDescription(year) {
    switch (year) {
      case '1900':
        return 'It\'s the turn of the last century, essayists, painters ' +
                'and poets are being born and dying';
      case '1910':
        return '1910 - 1920, erections are prevalent';
      case '1920':
        return 'The roaring twenties were mainly characterised by the veneration of bridges';
      case '1930':
        return 'John and George seem to be popular names';
      case '1940':
        return 'The 1940s, and a great conflict is commemorated';
      case '1950':
        return 'Poets, novelists, and statesmen die - while Bristol get\'s a mention';
      case '1960':
        return 'Writers take top spot in this decade, along with the names of former kings';
      case '1970':
        return 'The 70s, a close run between architects and painters.';
      case '1980':
        return 'Manchester was the place to be in the 80s';
      case '1990':
        return 'The words \'school\', \'world\' and \'pioneer\' all feature for the first time';
      case '2000':
        return 'A century is celebrated, and the renaissance of Leeds begins';
      case '2010':
        return 'Since 2010 we have been very proud of our railway system';
    }
  }

  showYear(year) {
    this.selectedYear = year;
    this.description = this.yearDescription(year.key);
    let selected = this.data.filter(function(d) { return d.key === year.key; })[0];

    var tags =
        selected.cloud.map(function(d) { return {id: d.word, text: d.word, count: d.count}; });

    this.makeCloud(tags);

    this.layout.start();
  }

  makeCloud(tags) {
    var max = D3.max(tags, function(t: any) { return t.count; });
    let scale = D3.scale.linear().domain([0, max]).range([10, 100]);

    this.layout = cloud()
                      .size([1000, 500])
                      .words(tags)
                      .padding(5)
                      .rotate(function() { return Math.random() > 0.5 ? 90 : 0; })
                      .font('Roboto')
                      .fontSize(function(d) { return Math.floor(scale(d.count)); })
                      .on('end', this.draw);
  }

  draw(words) {
    let fill = D3.scale.category20();

    let data =
        D3.select('#d3group').selectAll('text').data(words, function(w: any) { return w.id; });

    data.transition().duration(1e3).style('font-size', function(d: any) {
                                     return d.size + 'px';
                                   }).style('fill', function(d, i) {
                                       return fill(i.toString());
                                     }).attr('transform', function(d: any) {
      return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
    });

    data.enter()
        .append('text')
        .style('font-size', function(d: any) { return d.size + 'px'; })
        .style('font-family', 'Roboto')
        .style('fill', function(d, i) { return fill(i.toString()); })
        .style('opacity', '0')
        .attr('text-anchor', 'middle')
        .attr(
            'transform',
            function(d: any) {
              return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
            })
        .text(function(d: any) { return d.text; })
        .transition()
        .duration(0.5e3)
        .style('opacity', '1');

    data.exit().transition().duration(0.5e3).style('opacity', '0').remove();
  }
}
