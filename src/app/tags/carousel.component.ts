import {ViewChild, EventEmitter, Input, Output, Component, OnInit, OnChanges } from '@angular/core';
import {HighlightPipe} from '../shared';
import {MdIcon} from 'ng2-material';
import {PlaqueService} from '../shared';

import '../../../node_modules/flickity/dist/flickity.css';

var flick = require('flickity');
var twitterWidgetsLoader = require('twitter-widgets');

@Component({
    moduleId: '/app/tags/',
    selector: 'sg-carousel',
    template: require('./carousel.component.html'),
    styles: [require('./carousel.component.scss')],
    pipes: [HighlightPipe],
    directives: [MdIcon]
})
export class CarouselComponent implements OnInit, OnChanges {
    @Input()
    hand: any;

    @Input()
    word: any;

    @Output()
    onClose = new EventEmitter<void>();

    @Output()
    onSelected = new EventEmitter<any>();

    @Output()
    onShowMap = new EventEmitter<void>();

    flickity: Flickity;
    twitter: Twitter = twitterWidgetsLoader;

    galleryOpen = false;
    currentPlaque: any;

    @ViewChild('tweet')
    embeddedTweet: any;

    constructor(private ps: PlaqueService) { }

    ngOnInit() { }

    ngOnChanges(changes) {
        // not now, but nearly now
        setTimeout(() => {
            this.flickitise();
        }, 0);
    }

    showMap() {
        this.onShowMap.emit(null);
        setTimeout(() => {
            this.flickity.resize();
        }, 500);
    }

    close() {
        this.galleryOpen = false;
        setTimeout(() => {
            this.onClose.emit(null);
        }, 250);
    }

    flickitise = () => {
        this.flickity = new flick('.gallery', {
            initialIndex: 0,
            lazyLoad: 5,
            contain: false,
            useSetGallerySize: false
        });

        let tweetElement = this.embeddedTweet;

        this.flickity.on('cellSelect', () => {
            let index = this.flickity.selectedIndex;
            let plaque = this.hand[index];
            if (!this.currentPlaque || this.currentPlaque.id !== plaque.id) {
                this.currentPlaque = plaque;

                this.onSelected.emit(plaque);

                if (!plaque.subject) {
                    return;
                }

                this.ps
                    .tweets(plaque.subject, plaque.coords)
                    // .map((tweet) => {
                    //     if (!tweet[0] || !tweet[0].body) {
                    //         return;
                    //     }

                    //     let obj = JSON.parse(tweet[0].body);

                    //     return obj;
                    // })
                    .subscribe((tweet) => {
                        if (!tweet) {
                            return;
                        }

                        console.log('tweet', tweet[0]);
                        // this.tweet = tweet;
                        twitterWidgetsLoader.load(function (twttr) {
                            twttr.widgets.createTweet(tweet[0],
                            document.getElementById('tweet' + index));
                            // tweetElement.nativeElement);
                        });
                    });
            }
        });

        setTimeout(() => {
            this.galleryOpen = true;
        }, 0);
    }
}
