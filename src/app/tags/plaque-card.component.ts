import {Input, Component, OnInit} from '@angular/core';
import * as D3 from 'd3';

@Component({
    moduleId: 'app/tags/',
    selector: 'sg-plaque-card',
    templateUrl: 'plaque-card.component.html' })
export class PlaqueCardComponent implements OnInit {
    @Input()
    plaque: any;
    posX: number;
    posY: number;
    visible: boolean = false;

    private gutter: number;
    private cardGap: number;
    private cardWidth: number;
    private cardHeight: number;
    private xOffset: number;

    constructor() {
        console.log('card constructed');
    }

    ngOnInit() {
        console.log('card initialised');

        this.cardWidth = (window.innerWidth / 6);
        this.cardHeight = this.cardWidth * 1.5;
        this.cardGap = 15;
        this.gutter = (window.innerWidth - (3 * this.cardWidth) - (2 * this.cardGap)) / 2;
        this.xOffset = window.innerWidth / 2;

        this.drawPlaque(this.plaque, 1);
        this.drawPlaque(this.plaque, 2);
        this.drawPlaque(this.plaque, 3);
    }

    drawPlaque(plaque, pos) {
        if (plaque) {
            let g = D3.select('#d3group');

            let coords = {
                x: this.gutter + (pos - 1) * (this.cardWidth + this.cardGap) - this.xOffset,
                y: -100,
                width: this.cardWidth,
                height: this.cardHeight
            };

            g.append('rect')
                .attr({
                    'x': coords.x, 'y': coords.y,
                    'width': coords.width, 'height': coords.height
                })
                .attr('fill', 'none')
                .attr('stroke', 'yellow')
                .attr('stroke-width', '2');
        }
    }
}
