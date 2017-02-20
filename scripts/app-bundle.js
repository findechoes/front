define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Find Echoes';
      config.map([{ route: '', moduleId: 'place-picker' }, { route: 'spot/:id', moduleId: 'spot-detail', name: 'spot' }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('google-maps-loader',['exports', 'google-maps'], function (exports, _googleMaps) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GoogleMaps = undefined;

  var _googleMaps2 = _interopRequireDefault(_googleMaps);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var map = void 0;
  var infoWindow = void 0;

  var GoogleMaps = exports.GoogleMaps = function () {
    function GoogleMaps(elem, options) {
      _classCallCheck(this, GoogleMaps);

      _googleMaps2.default.KEY = 'AIzaSyBqVDCRlASB7unQpQcfHf9_xr6-P95vT0E';
      _googleMaps2.default.LIBRARIES = ['places'];
      _googleMaps2.default.load(function (google) {
        console.log('Google Maps has loaded');
      });
    }

    GoogleMaps.prototype.initMap = function initMap(div, input, mapOpts, srchOpts, location) {
      var _this = this;

      _googleMaps2.default.onLoad(function (google) {
        console.log('initPlaces');

        _this.location = location;
        console.log(_this.location);
        map = new google.maps.Map(div, mapOpts);
        infoWindow = new google.maps.InfoWindow();

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: mapOpts.center,
          radius: srchOpts.radius,
          types: srchOpts.types
        }, callback);

        var autocomplete = new google.maps.places.Autocomplete(input);
        console.log(map.controls);
        console.log(google.maps.ControlPosition.TOP_LEFT);
        console.log(map.controls[google.maps.ControlPosition.TOP_LEFT]);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        autocomplete.bindTo('bounds', map);

        var marker = new google.maps.Marker({
          map: map,
          anchorPoint: new google.maps.Point(0, -29)
        });

        updateMarker(marker, _this.location);

        autocomplete.addListener('place_changed', function () {
          marker.setVisible(false);
          var place = autocomplete.getPlace();
          if (place.geometry) {
            _this.location.name = place.name;
            _this.location.lat = place.geometry.location.lat();
            _this.location.lng = place.geometry.location.lng();
            updateMarker(marker, _this.location);
          }
        });
      });
    };

    return GoogleMaps;
  }();

  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0, len = results.length; i < len; i++) {
        createMarker(results[i]);
      }
    }
  }

  function createMarker(place) {
    var _this2 = this;

    console.log('createMaker');
    console.log(place);
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: placeLoc
    });

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent(place.name);
      infoWindow.open(map, _this2);
    });
  }

  function updateMarker(marker, loc) {
    console.log('updateMarker');
    console.log(marker);
    console.log(loc);
    var position = new google.maps.LatLng(loc.lat, loc.lng);
    map.setCenter(position);
    marker.setPosition(position);
    marker.setVisible(true);
  }
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('place-picker',['exports', './google-maps-loader'], function (exports, _googleMapsLoader) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PlacePicker = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var PlacePicker = exports.PlacePicker = function () {
    PlacePicker.inject = function inject() {
      return [Element, _googleMapsLoader.GoogleMaps];
    };

    function PlacePicker(elem, googleMaps) {
      _classCallCheck(this, PlacePicker);

      console.log('In constructor');
      this.elem = elem;
      this.maps = googleMaps;
    }

    PlacePicker.prototype.attached = function attached() {
      console.log('attached');
      var mapContainer = document.getElementById('place-picker-map');
      var input = document.getElementById('input-autocomplete');
      var tokyo = { lat: 35.68944, lng: 139.69167 };
      var mapOpts = {
        center: tokyo,
        zoom: 16
      };
      var srchOpts = {
        radius: 500,
        types: ['store']
      };

      console.log(tokyo);
      this.maps.initMap(mapContainer, input, mapOpts, srchOpts, tokyo);
    };

    return PlacePicker;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!style.css', ['module'], function(module) { module.exports = "html {\n  height: 100%;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  height: 100%;\n  margin: 0;\n  padding: 70px 0 0 0;\n}\n\na:focus {\n  outline: none;\n}\n\n\n.container {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n\n#place-picker-map {\n  height: 100%;\n}\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./style.css\"></require>\n  <!--<require from=\"./spot-list\"></require>-->\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Find Echoes</span>\n      </a>\n    </div>\n  </nav>\n\n  <div class=\"container\">\n      <!--      <spot-list class=\"col-md-4\"></spot-list>-->\n      <!--<router-view class=\"col-md-8\"></router-view>-->\n      <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!place-picker.html', ['module'], function(module) { module.exports = "<template>\n    <input id=\"input-autocomplete\" value.bind=\"location.name\">\n    <div id=\"place-picker-map\"></div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map