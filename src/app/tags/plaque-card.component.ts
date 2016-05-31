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

    visible: boolean = false;

    constructor() {
    }

    ngOnInit() {
    }

    cardStyle = (index) => {
        let cardWidth = (window.innerWidth / 5);
        let cardGap = 15;

        let gutter = (window.innerWidth -
            (this.hand.length * cardWidth) - (2 * cardGap)) / 2;

        return {
          position: 'absolute',
          left:
            gutter + (index) * (cardWidth + cardGap) + 'px',
          width: cardWidth + 'px',
        };
    }
}
