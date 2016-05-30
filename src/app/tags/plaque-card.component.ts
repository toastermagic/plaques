import {Input, Component, OnInit} from '@angular/core';
import {MdCard} from '@angular2-material/card';

@Component({
    moduleId: 'app/tags/',
    selector: 'sg-plaque-card',
    templateUrl: 'plaque-card.component.html',
    directives: [MdCard]
})
export class PlaqueCardComponent implements OnInit {
    @Input()
    plaque: any;

    @Input()
    position: number;

    posX: number;
    posY: number;
    visible: boolean = false;
    coords: any;
    public cardStyle: any;

    private gutter: number;
    private cardGap: number;
    private cardWidth: number;
    private cardHeight: number;
    private xOffset: number;

    constructor() {
    }

    ngOnInit() {
        this.cardWidth = (window.innerWidth / 6);
        this.cardHeight = this.cardWidth * 1.5;
        this.cardGap = 15;
        this.gutter = (window.innerWidth - (3 * this.cardWidth) - (2 * this.cardGap)) / 2;
        this.xOffset = window.innerWidth / 2;

        let jauntyAngle = (this.position - 2) * 8 + (Math.random() * 4 - 2);

        this.cardStyle = {
          position: 'absolute',
          left:
            this.gutter + (this.position - 1) * (this.cardWidth + this.cardGap) + 'px',
          width: this.cardWidth + 'px',
          top: this.position == 2 ? '0px' : '15px',
          height: this.cardHeight + 'px',
          'rotation-point': '50% 80%',
          'transform': 'rotate(' + jauntyAngle + 'deg)'
        };

        // this.drawPlaque(this.plaque, this.position);
    }

    // get getCardStyle() {
    //     return {
    //       left: this.gutter + (this.position - 1) *
    // (this.cardWidth + this.cardGap) - this.xOffset,
    //       top: 100,
    //       width: this.cardWidth,
    //       height: this.cardHeight
    //     };
    // }

    drawPlaque(plaque, pos) {

        // let card = D3.select('#d3group')
        //     .append('g')
        //     .attr('transform', 'translate(' + coords.x + ',' + coords.y + ')'
        //             + ' rotate(' + (Math.random() * 10 - 5) + ')');

        // card
        //     .append('rect')
        //     .attr({
        //         'rx': 15, 'ry': 15,
        //         'width': coords.width, 'height': coords.height
        //     })
        //     .attr('fill', '#fffffa')
        //     .attr('stroke', 'lightgray')
        //     .attr('stroke-width', '2');

        // card
        //     .append('image')
        //     .attr({
        //         'xlink:href': plaque.thumbnail_url,
        //         'x': (this.cardWidth - 120) / 2,
        //         'y': this.cardGap,
        //         'width': '120px',
        //         'height': '120px'
        //     });

        // card
        //     .append('text')
        //     .attr('text-anchor', 'middle')
        //     .attr('x', this.cardWidth / 2)
        //     .attr('y', 120 + this.cardGap * 3)
        //     .text(plaque.title);

        // card.append('foreignObject')
        //     .attr('width', this.cardWidth - this.cardGap)
        //     .attr('height', '200px')
        //     .attr('y', 220 + this.cardGap * 2)
        //     .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
        //     .append('p')
        //     .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        //     .text(plaque.title);

        // // card.append('g')
        // //     .attr('requiredFeatures', 'http://www.w3.org/Graphics/SVG/feature/1.2/#TextFlow')
        // //     .append('textArea')
        // //     .attr('width', this.cardWidth - this.cardGap)
        // //     .attr('height', 'auto')
        // //     .attr('x', this.cardWidth / 2)
        // //     .attr('y', 320 + this.cardGap * 2)
        // //     .text(plaque.title)
        // //     .attr('xmlns', 'http://www.w3.org/1999/xhtml');

        // // let svgSwitch = card.append('switch');

        // // svgSwitch.append('foreignObject')
        // //     .attr('width', this.cardWidth - this.cardGap)
        // //     .attr('height', '200px')
        // //     .attr('requiredFeatures', 'http://www.w3.org/TR/SVG11/feature#Extensibility')
        // //     .append('p')
        // //     .text(plaque.title)
        // //     .attr('xmlns', 'http://www.w3.org/1999/xhtml');

        // // svgSwitch.append('text')
        // //     .text(plaque.title);
    }
}
