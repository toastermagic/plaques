import { Component, OnInit } from '@angular/core';
import {PlaqueService} from '../shared';
import * as d3 from 'd3';
declare var cloud: any;

@Component({
  moduleId: 'app/tags',
  selector: 'app-tags',
  templateUrl: 'tags.component.html',
  styleUrls: ['tags.component.css']
})
export class TagsComponent implements OnInit {

  private data: any;
  tags: any;
  years: any;
  private fill = d3.scale.category20();

  constructor(private plaqueService: PlaqueService) {
  }

  ngOnInit() {
    this.plaqueService
      .tags()
      .subscribe((data) => {
        this.data = data;
        this.years = data.map(function (d) { return d.key }).sort();
      });
  }

  showYear(year) {
    let selected = this.data.filter(function (d) { return d.key === year; })[0];
    this.tags = selected.cloud;
  }

  makeCloud() {
    this.layout.start();
  }

  layout = cloud()
    .size([500, 500])
    .words([
      "Hello", "world", "normally", "you", "want", "more", "words",
      "than", "this"].map(function (d) {
        return { text: d, size: 10 + Math.random() * 90, test: "haha" };
      }))
    .padding(5)
    .rotate(function () { return ~~(Math.random() * 2) * 90; })
    .font("Impact")
    .fontSize(function (d) { return d.size; })
    .on("end", this.draw);

  draw(words) {
    d3.select("body").append("svg")
      .attr("width", this.layout.size()[0])
      .attr("height", this.layout.size()[1])
      .append("g")
      .attr("transform", "translate(" + this.layout.size()[0] / 2 + "," + this.layout.size()[1] / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function (d: any) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function (d, i) { return this.fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d: any) { return d.text; });
  }
}
