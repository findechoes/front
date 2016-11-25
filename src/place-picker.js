import { GoogleMaps } from './google-maps-loader';

export class PlacePicker {

  static inject() { return [Element, GoogleMaps] };

  constructor(elem, googleMaps) {
    console.log('In constructor');
    this.elem = elem;
    this.maps = googleMaps;
  }

  attached() {
    // This loads the Google Maps API asynchronously.
    console.log('attached');
    let mapContainer = document.getElementById('place-picker-map');
    let tokyo = {lat: 35.68944, lng: 139.69167};
    let mapOpts = {
      center: tokyo,
      zoom: 16
    };
    let srchOpts = {
      radius: 500,
      types: ['store']
    };

    console.log(this.maps);
    let map = this.maps.initMap(mapContainer, mapOpts, srchOpts);
  }
}

//    this.mapsApi.then(maps => {
//      console.log(maps);
//      // Now that it's loaded, add a map to our HTML
//      let mapContainer = this.elem.getElementById('place-picker-map');
//      let map = new maps.Map(mapContainer, {
//        center: {lat: -33.86888, lng: 151.2195},
//        zoom: 13
//      });
