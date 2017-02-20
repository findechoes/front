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

  initMap(div, input, mapOpts, srchOpts, location) {
    GoogleMapsLoader.onLoad(google => {
      console.log('initPlaces');

      this.location = location;
      console.log(this.location);
      map = new google.maps.Map(div, mapOpts);
      infoWindow = new google.maps.InfoWindow();

      let service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: mapOpts.center,
        radius: srchOpts.radius,
        types: srchOpts.types,
      }, callback);

      // convert our input field into a place autocomplete field
      let autocomplete = new google.maps.places.Autocomplete(input);
      console.log(map.controls);
      console.log(google.maps.ControlPosition.TOP_LEFT);
      console.log(map.controls[google.maps.ControlPosition.TOP_LEFT]);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      autocomplete.bindTo('bounds', map);

      // create a marker that show where the selected place is
      let marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      // ensure that the current location is shown properly
      updateMarker(marker, this.location);

      // update the location and its marker every time a new place is selected
      autocomplete.addListener('place_changed', () => {
        marker.setVisible(false);
        let place = autocomplete.getPlace();
        if (place.geometry) {
          this.location.name = place.name;
          this.location.lat = place.geometry.location.lat();
          this.location.lng = place.geometry.location.lng();
          updateMarker(marker, this.location);
        }
      });
    });
  }

}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0, len = results.length; i < len; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  console.log('createMaker');
  console.log(place);
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

// move the marker and the map viewport
function updateMarker(marker, loc) {
  console.log('updateMarker');
  console.log(marker);
  console.log(loc);
  let position = new google.maps.LatLng(loc.lat, loc.lng);
  map.setCenter(position);
  marker.setPosition(position);
  marker.setVisible(true);
}
