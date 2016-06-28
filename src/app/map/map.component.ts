import { Input, OnChanges, Component, OnInit } from '@angular/core';
import { ANGULAR2_GOOGLE_MAPS_DIRECTIVES } from 'angular2-google-maps/core';

@Component({
    moduleId: 'app/map/',
    selector: 'sg-map',
    template: require('./map.component.html'),
    styles: [require('./map.component.scss')],
    directives: [ANGULAR2_GOOGLE_MAPS_DIRECTIVES]
})
export class MapComponent implements OnInit, OnChanges {

    marker = {
        latitude: 0,
        longitude: 0
    };

    @Input()
    latitude: number;

    @Input()
    longitude: number;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(change) {
        if (change.longitude && change.longitude.currentValue) {
            console.log('long', change.longitude);
            this.marker.longitude = +change.longitude.currentValue;
        }
        if (change.latitude && change.latitude.currentValue) {
            this.marker.latitude = +change.latitude.currentValue;
        }
    }
}
