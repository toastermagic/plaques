import {Input, Component, OnInit, OnChanges } from '@angular/core';

@Component({
    moduleId: '/app/tags/',
    selector: 'sg-carousel',
    templateUrl: 'carousel.component.html',
    styleUrls : ['carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnChanges {
    @Input()
    hand: any;

    flickity: Flickity;
    constructor() {}

    ngOnInit() { }

    ngOnChanges() {
        // not now, but nearly now
        setTimeout(() => {
            this.flickitise();
        }, 0);
    }

    flickitise() {
        this.flickity = new Flickity('.gallery', {
            lazyLoad: 5,
            contain: true,
            useSetGallerySize: false
        });
    }
}
