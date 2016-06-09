import {EventEmitter, Input, Output, Component, OnInit, OnChanges } from '@angular/core';
import {HighlightPipe} from '../shared';
import {MdIcon} from 'ng2-material';

import '../../../node_modules/flickity/dist/flickity.css';
var flick = require('flickity');

@Component({
    moduleId: '/app/tags/',
    selector: 'sg-carousel',
    template: require('./carousel.component.html'),
    styles : [require('./carousel.component.scss')],
    pipes: [HighlightPipe],
    directives: [ MdIcon ]
})
export class CarouselComponent implements OnInit, OnChanges {
    @Input()
    hand: any;

    @Input()
    word: any;

    @Output()
    onClose = new EventEmitter<void>();

    flickity: Flickity;
    galleryOpen = false;

    constructor() {}

    ngOnInit() { }

    ngOnChanges(changes) {
        // not now, but nearly now
        setTimeout(() => {
            this.flickitise();
        }, 0);
    }

    close() {
        this.galleryOpen = false;
        setTimeout(() => {
            this.onClose.emit(null);
        }, 250);
    }

    flickitise() {
        this.flickity = new flick('.gallery', {
            initialIndex: this.hand.length > 1 ? 1 : 0,
            lazyLoad: 5,
            contain: true,
            useSetGallerySize: false
        });

        setTimeout(() => {
            this.galleryOpen = true;
        }, 0);
    }
}
