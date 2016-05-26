import {Component, OnInit, OnDestroy} from '@angular/core';
import {PlaqueService} from '../shared';
import {Subscription} from 'rxjs';

import * as D3 from 'd3';
const cloud: any = require('d3-cloud');

@Component({
  moduleId: 'app/tags/',
  selector: 'app-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['tags.component.css']
})
export class TagsComponent implements OnInit {

  private data: any;
  private layout: any;
  private subscription: Subscription;

  selectedYear: any;
  years: any;

  constructor(private plaqueService: PlaqueService) {
  }

  ngOnInit() {
    this.subscription = this.plaqueService
      .tags()
      .subscribe((data) => {
        this.data = data;
        this.years = data.map(function (y) {
          return y.key;
        })
        .sort()
        .reverse()
        .map(function (d) {
          return {
            key: d,
            selected: false
          }
        });
        this.showYear(this.years[0]);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showYear(year) {
    this.selectedYear = year;
    let selected = this.data.filter(function (d) { return d.key === year.key; })[0];

    var tags = selected.cloud.map(function (d) {
      return { id: d.word, text: d.word, count: d.count };
    });

    this.makeCloud(tags);

    this.layout.start();
  }

  makeCloud(tags) {

    var max = D3.max(tags, function (t: any) { return t.count; });
    let scale = D3.scale.linear().domain([0, max]).range([10, 100]);

    this.layout = cloud()
      .size([1000, 500])
      .words(tags)
      .padding(5)
      .rotate(function () { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function (d) { return Math.floor(scale(d.count)); })
      .on('end', this.draw)
  }

  draw(words) {
    let fill = D3.scale.category20();

    let data = D3.select("#d3group")
      .selectAll("text")
      .data(words, function (w: any) { return w.id; });

    data
      .transition()
      .duration(1e3)
      .style("font-size", function (d: any) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function (d, i) { return fill(i.toString()); })
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })

    data
      .enter()
      .append("text")
      .style("font-size", function (d: any) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function (d, i) { return fill(i.toString()); })
      .style("opacity", "0")
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d: any) { return d.text; })
      .transition()
      .duration(0.5e3)
      .style("opacity", "1");

    data
      .exit()
      .transition()
      .duration(0.5e3)
      .style("opacity", "0")
      .remove();
  }
}
