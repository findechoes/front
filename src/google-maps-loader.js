import GoogleMapsLoader from 'google-maps';

let map;
let infoWindow;

export class GoogleMaps {
  constructor(elem, options) {
    GoogleMapsLoader.KEY = 'AIzaSyBqVDCRlASB7unQpQcfHf9_xr6-P95vT0E';
    GoogleMapsLoader.LIBRARIES = ['places'];
    GoogleMapsLoader.load(google => {
      console.log('Google Maps has loaded');
    });
  }

  initMap(elem, mapOpts, srchOpts) {
    GoogleMapsLoader.onLoad(google => {
      console.log('initPlaces');

      map = new google.maps.Map(elem, mapOpts);
      infoWindow = new google.maps.InfoWindow();

      let service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: mapOpts.center,
        radius: srchOpts.radius,
        types: srchOpts.types,
      }, callback);
    });
  }

}

function callback(results, status) {
  console.log('callback');
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0, len = results.length; i < len; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  console.log('createMaker');
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });

  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}
