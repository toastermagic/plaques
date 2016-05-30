import {Input, Component, OnInit} from '@angular/core';
import {MdCard} from '@angular2-material/card';

@Component({
    moduleId: 'app/tags/',
    selector: 'sg-plaque-card',
    template: require('./plaque-card.component.html'),
    styles: [require('./plaque-card.component.scss')],
    directives: [MdCard]
})
export class PlaqueCardComponent implements OnInit {
    @Input()
    hand: any;

    @Input()
    position: number;

    posX: number;
    posY: number;
    visible: boolean = false;
    coords: any;

    private cardGap: number;
    private cardWidth: number;

    constructor() {
    }

    ngOnInit() {
        this.cardWidth = (window.innerWidth / 5);
        this.cardGap = 15;
    }

    cardStyle = (index) => {
        let gutter = (window.innerWidth -
            (this.hand.length * this.cardWidth) - (2 * this.cardGap)) / 2;

        return {
          position: 'absolute',
          left:
            gutter + (index) * (this.cardWidth + this.cardGap) + 'px',
          width: this.cardWidth + 'px',
        };
    }
}
