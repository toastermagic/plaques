import {EventEmitter, Input, Output, Component, OnInit, OnChanges } from '@angular/core';
import {HighlightPipe} from '../shared';
import {MdIcon} from 'ng2-material';

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
    constructor() {}

    ngOnInit() { }

    ngOnChanges(changes) {
        // not now, but nearly now
        setTimeout(() => {
            this.flickitise();
        }, 0);
    }

    close() {
        this.onClose.emit(null);
    }

    flickitise() {
        this.flickity = new Flickity('.gallery', {
            lazyLoad: 5,
            contain: true,
            useSetGallerySize: false
        });
    }
}
