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
			return  {
				'dateCompleted': dateCompleted,
				'description': description,
				'cost': cost
			}
		},
		'polygon': function(id, path) {
			return {
				'id': id,
				'path': path,
				visible: true,
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
			}
		}
	};

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	var app = angular.module('numetric.services', []);

	app.factory('pavement-service', function() {
		var service = {};

		service.getSegments = function() {
			return [
				Generate.polygon(1, [
					{latitude: 40.6362, longitude: -111.9051},
					{latitude: 40.6350, longitude: -111.9053},
					{latitude: 40.6350, longitude: -111.9051},
					{latitude: 40.6362, longitude: -111.9049}
				]),
				Generate.polygon(2, [
					{longitude: -111.904711, latitude: 40.636175},
					{longitude: -111.904941, latitude: 40.634937},
					{longitude: -111.904796, latitude: 40.634917},
					{longitude: -111.904566, latitude: 40.636167}
				]),
				Generate.polygon(3, [
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
				]),
				Generate.polygon(4, [
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
				])
			];
		};

		service.getTreatments = function(segmentID) {
			return [
				Generate.treatment(new Date(2006, 6, 11), "Microsurface", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2007, 8, 15), "Bonded Wearing Course", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2008, 3, 4), "Chip Seal", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2009, 9, 1), "SMA", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2010, 5, 28), "Open Graded Surface Course", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2011, 2, 31), "SMA", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2012, 4, 21), "Microsurface", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2013, 6, 26), "Chip Seal", getRandomInt(1000000, 10000000)),
				Generate.treatment(new Date(2014, 7, 8), "Bonded Wearing Course", getRandomInt(1000000, 10000000)),
			];
		};

		service.getAverageConditionHistory = function(segmentID) {
			return {
				'keys': ['2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
				'values': _.shuffle([60, 67, 88, 38, 64, 55, 41])
			}
		};

		service.getAADT = function(segmentID) {
			return {
				'keys': ['2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
				'values': _.shuffle([140000, 150000, 155000, 150000, 147000, 155000, 148000])
			};
		};

		return service;
	});

})();