(function() {
	"use strict";

	var mapStyle = [
		{
			"stylers": [
				{
					"hue": "#dbeff3"
				},
				{
					"saturation": 250
				}
			]
		},
		{
			"featureType": "road",
			"elementType": "geometry",
			"stylers": [
				{
					"lightness": 100
				},
				{
					"visibility": "simplified"
				}
			]
		}
	];


	var app = angular.module('numetric', ['numetric.services', 'numetric.filters', 'numetric.directives', 'numetric.controllers', 'google-maps'.ns(), 'ngRoute']);

	app.config(['GoogleMapApiProvider'.ns(), '$routeProvider', function (GoogleMapApi, $routeProvider) {
		GoogleMapApi.configure({
			key: 'AIzaSyALf5-sdlvQTvrN827e_FPKrV66JkKV5tY',
			v: '3.17',
			libraries: 'weather,geometry,visualization'
		});


		$routeProvider.
			when('/dashboard', {
				templateUrl: 'partials/dashboard-view.html',
				controller: 'numetric-main',
			}).
			when('/map', {
				templateUrl: 'partials/map-view.html',
				controller: 'numetric-map',
			}).
			otherwise({
				redirectTo: '/dashboard'
			});

	}]);


})();

