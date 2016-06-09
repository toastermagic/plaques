import {Input, ElementRef, Component, OnInit} from '@angular/core';
import {MdCard} from '@angular2-material/card';
// import {Flickity} from 'flickity';

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

    flickity: Flickity;
    visible: boolean = false;

    private elRef: ElementRef;

    constructor(el: ElementRef) {
        this.elRef = el;
    }

    ngOnInit() {
        this.flickity = new Flickity('.carousel', {
            lazyLoad: true,
            imagesLoaded: true,
            contain: true,
            freeScroll: true
        });
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
