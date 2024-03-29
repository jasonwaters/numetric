(function() {
	"use strict";

	window.NM = {
		FILL_COLOR_DEFAULT: '#aeaeae',
		FILL_OPACITY_DEFAULT: 0.6,
		STROKE_COLOR_DEFAULT: '#666666',
		STROKE_WEIGHT_DEFAULT: 1,
		FILL_COLOR_SELECTED: "#abbffe",
		FILL_OPACITY_SELECTED: 0.8,
		STROKE_COLOR_SELECTED: "#5f7acf",
		STROKE_WEIGHT_SELECTED: 1
	};


	var Generate = {
		'treatment': function(dateCompleted, description, cost) {
			var id = Math.floor((Math.random()* 900000) + 10000);

			return  {
				'id': id,
				'dateCompleted': dateCompleted,
				'description': description,
				'cost': cost
			};
		},
		'polygon': function(id, specs, path) {
			return {
				'id': id,
				'path': path,
				visible: true,
				'specs': specs,
				stroke: {
					color: NM.STROKE_COLOR_DEFAULT,
					weight: NM.STROKE_WEIGHT_DEFAULT
				},
				fill: {
					color: NM.FILL_COLOR_DEFAULT,
					opacity: NM.FILL_OPACITY_DEFAULT
				},
				isSelected: function() {
					return this.fill.color == NM.FILL_COLOR_SELECTED;
				}
			};
		},
		'specs': function(route, milepost, type, pClass) {
			return {
				'route': route,
				'milepost': milepost,
				'type': type,
				'class': pClass
			};
		},
		'marker': function(data) {
			var source = data._source;
			return {
				id: data._id,
				coords: {
					latitude: source.GeoPointLocation.lat,
					longitude:source.GeoPointLocation.lon
				},
				icon: '/img/icon_signs.png',
				raw: source
			};
		},
		'barrier': function(data) {
			var source = data._source;
			return {
				id: data._id,
				path: [{
					latitude: parseFloat(source.GeoPointStartLocation.lat),
					longitude: parseFloat(source.GeoPointStartLocation.lon)
				},{
					latitude: parseFloat(source.GeoPointEndLocation.lat),
					longitude: parseFloat(source.GeoPointEndLocation.lon)
				}],
				stroke: {
					color: '#FFA500',
					weight: 2,
					opacity: 1
				}
			};
		}
	};

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var app = angular.module('numetric.services', ['elasticsearch']);

	app.factory('search-service', function (esFactory, $q) {
		var service = {},
			MAX_RECORDS=100;

		var es = esFactory({
			host: 'udot.teratek.co:9200'
		});

		service.getBarriers = function(bounds, filterText) {
			var deferred = $q.defer(),
				searchMap = {
					"query":
					{
						"bool":{
							"must": [
								{
									"match": {
										_type:"barrier_data"
									}
								}
							]
						}
					},
					"filter": {
						"geo_bounding_box" : {
							"GeoPointStartLocation" : {
								"top_right" : {
									"lat" : bounds.northeast.latitude,
									"lon" : bounds.northeast.longitude
								},
								"bottom_left": {
									"lat" : bounds.southwest.latitude,
									"lon" : bounds.southwest.longitude
								}
							},
							"GeoPointEndLocation" : {
								"top_right" : {
									"lat" : bounds.northeast.latitude,
									"lon" : bounds.northeast.longitude
								},
								"bottom_left": {
									"lat" : bounds.southwest.latitude,
									"lon" : bounds.southwest.longitude
								}
							}
						}
					}
				};

			if(filterText.length > 0) {
				searchMap.query.bool.must.push({
					"multi_match": {
						"query":    filterText,
						"fields": [ "BarrierType", "Region", "Side_of_Road", "Station", "UDOTClass", "RouteName"],
						"type": 'most_fields'
					}
				});
			}

			es.search({
				index: 'udot',
				size: MAX_RECORDS,
				body: searchMap
			}).then(function (response) {
				var barriers = [];

				_.forEach(response.hits.hits, function(hit) {
					barriers.push(Generate.barrier(hit));
				});

				deferred.resolve(barriers);
			});

			return deferred.promise;
		};

		service.getSigns = function(bounds, filterText) {
			var deferred = $q.defer(),
				searchMap = {
					"query":
					{
						"bool": {
							"must": [{
								"match": {
									'_type':"sign_data"
								}
							}]
						}
					},
					"filter": {
						"geo_bounding_box" : {
							"GeoPointLocation" : {
								"top_right" : {
									"lat" : bounds.northeast.latitude,
									"lon" : bounds.northeast.longitude
								},
								"bottom_left": {
									"lat" : bounds.southwest.latitude,
									"lon" : bounds.southwest.longitude
								}
							}
						}
					}
				};

			if(filterText.length > 0) {
				searchMap.query.bool.must.push({
					"multi_match": {
						"query":    filterText,
						"fields": [ "SignOrientation", "Legend", "Station", "Condition", "Region", "Side", "MUTCD", "MUTCDFull" ],
						"type": 'most_fields'
					}
				});
			}

			es.search({
				index: 'udot',
				size: MAX_RECORDS,
				body: searchMap
			}).then(function (response) {
				var signs = [];

				_.forEach(response.hits.hits, function(hit) {
					signs.push(Generate.marker(hit));
				});

				deferred.resolve(signs);
			});

			return deferred.promise;
		};

		return service;
	});


	app.factory('pavement-service', function() {
		var service = {};

		var treatments = {
			1: [ // I-15 Left South section
				Generate.treatment(new Date(2007, 5, 28), "Open Graded Surface Course", 12200000),
				Generate.treatment(new Date(2010, 2, 31), "SMA", 7300000),
				Generate.treatment(new Date(2012, 4, 21), "Microsurface", 6400000)
			],
			2: [ // I-15 Right South Section
				Generate.treatment(new Date(2008, 3, 4), "Chip Seal", 2900000),
				Generate.treatment(new Date(2009, 6, 11), "Microsurface", 5100000),
				Generate.treatment(new Date(2010, 7, 8), "Bonded Wearing Course", 11300000),
				Generate.treatment(new Date(2012, 2, 3), "SMA", 7900000)
			],
			3: [ //I-215 Section
				Generate.treatment(new Date(2008, 5, 28), "Bonded Wearing Course", 12200000),
				Generate.treatment(new Date(2011, 2, 31), "Chip Seal", 7300000),
				Generate.treatment(new Date(2012, 4, 21), "Microsurface", 6400000)
			],
			4: [ //I-15 North Section
				Generate.treatment(new Date(2007, 8, 15), "Bonded Wearing Course", 8800000),
				Generate.treatment(new Date(2009, 9, 1), "SMA", 8100000),
				Generate.treatment(new Date(2013, 6, 26), "Chip Seal", 5600000)
			]
		};

		var avgConditionValues = {
			1: [65, 92, 84, 65, 85, 70, 91], // I-15 Left South section
			2: [55, 80, 90, 60, 95, 72, 80], // I-15 Right South Section
			3: [68, 60, 87, 73, 59, 70, 85], //I-215 Section
			4: [75, 92, 80, 85, 70, 62, 85] //I-15 North Section
		};

		var AADTvalues = {
			1: _.shuffle([140000, 150000, 155000, 150000, 147000, 155000, 148000]),
			2: _.shuffle([140000, 150000, 155000, 150000, 147000, 155000, 148000]),
			3: _.shuffle([140000, 150000, 155000, 150000, 147000, 155000, 148000]),
			4: _.shuffle([140000, 150000, 155000, 150000, 147000, 155000, 148000])
		};

		service.getSegments = function() {
			return [
				// I-15 Left South section
				Generate.polygon(1,
					Generate.specs("0015N", "295-297", "Concrete", "Interstate"),
					[
						{latitude: 40.6362, longitude: -111.9051},
						{latitude: 40.6350, longitude: -111.9053},
						{latitude: 40.6350, longitude: -111.9051},
						{latitude: 40.6362, longitude: -111.9049}
					]
				),
				// I-15 Right South Section
				Generate.polygon(2,
					Generate.specs("0015P", "295-297", "Concrete", "Interstate"),
					[
						{longitude: -111.904711, latitude: 40.636175},
						{longitude: -111.904941, latitude: 40.634937},
						{longitude: -111.904796, latitude: 40.634917},
						{longitude: -111.904566, latitude: 40.636167}
					]
				),
				//I-215 Section
				Generate.polygon(3,
					Generate.specs("0215P", "8-12", "Asphalt", "Interstate"),
					[
						{longitude: -111.904786, latitude: 40.634795},
						{longitude: -111.903117, latitude: 40.634701},
						{longitude: -111.902468, latitude: 40.634705},
						{longitude: -111.901889, latitude: 40.634750},
						{longitude: -111.901288, latitude: 40.634799},
						{longitude: -111.900569, latitude: 40.634840},
						{longitude: -111.899791, latitude: 40.634888},
						{longitude: -111.899083, latitude: 40.634880},
						{longitude: -111.898541, latitude: 40.634831},
						{longitude: -111.898541, latitude: 40.634945},
						{longitude: -111.899030, latitude: 40.634982},
						{longitude: -111.899464, latitude: 40.634990},
						{longitude: -111.899845, latitude: 40.634982},
						{longitude: -111.900188, latitude: 40.634994},
						{longitude: -111.900623, latitude: 40.634954},
						{longitude: -111.900966, latitude: 40.634941},
						{longitude: -111.901368, latitude: 40.634905},
						{longitude: -111.901733, latitude: 40.634884},
						{longitude: -111.902162, latitude: 40.634852},
						{longitude: -111.902688, latitude: 40.634815},
						{longitude: -111.903171, latitude: 40.634831},
						{longitude: -111.903675, latitude: 40.634827},
						{longitude: -111.904163, latitude: 40.634868},
						{longitude: -111.904678, latitude: 40.634901},
						{longitude: -111.904799, latitude: 40.634913}
					]
				),
				//I-15 North Section
				Generate.polygon(4,
					Generate.specs("0015P", "298-302", "Asphalt", "Interstate"),
					[
						{longitude: -111.904700, latitude: 40.636305},
						{longitude: -111.904517, latitude: 40.636875},
						{longitude: -111.904249, latitude: 40.637559},
						{longitude: -111.903874, latitude: 40.638495},
						{longitude: -111.903584, latitude: 40.639228},
						{longitude: -111.903434, latitude: 40.639187},
						{longitude: -111.903670, latitude: 40.638617},
						{longitude: -111.903841, latitude: 40.638121},
						{longitude: -111.904099, latitude: 40.637510},
						{longitude: -111.904314, latitude: 40.636973},
						{longitude: -111.904432, latitude: 40.636623},
						{longitude: -111.904528, latitude: 40.636297}
					]
				)
			];
		};

		service.getTreatments = function(segmentID) {
			return treatments[segmentID];
		};

		service.getAverageConditionHistory = function(segmentID) {
			return {
				'keys': ['2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
				'values': avgConditionValues[segmentID]
			};
		};

		service.getAADT = function(segmentID) {
			return {
				'keys': ['2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
				'values': AADTvalues[segmentID]
			};
		};

		return service;
	});

})();