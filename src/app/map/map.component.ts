import { Input, Component, OnInit } from '@angular/core';
import { SebmGoogleMap, SebmGoogleMapMarker } from 'angular2-google-maps/core';

@Component({
    moduleId: 'app/map/',
    selector: 'sg-map',
    template: require('./map.component.html'),
    styles: [require('./map.component.scss')],
    directives: [SebmGoogleMap, SebmGoogleMapMarker]
})
export class MapComponent implements OnInit {

    @Input()
    latitude: number;

    @Input()
    longitude: number;

    constructor() {
    }

    ngOnInit() {
        // let marker = new SebmGoogleMapMarker(this.mm);
        // marker.latitude = this.latitude;
        // marker.longitude = this.longitude;
        // this.mm.addMarker(marker);
    }
}
