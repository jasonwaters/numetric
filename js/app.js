(function() {
	"use strict";

	var app = angular.module('numetric', ['numetric.services', 'google-maps'.ns()]);

	app.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
		GoogleMapApi.configure({
			key: 'AIzaSyALf5-sdlvQTvrN827e_FPKrV66JkKV5tY',
			v: '3.17',
			libraries: 'weather,geometry,visualization'
		});
	}]);

	app.filter('bigmoney', function() {
		return function(value) {
			return numeral(value).format('($0.0 a)')
		};
	});




	app.controller('numetric-main', ['$scope', 'GoogleMapApi'.ns(), 'pavement-service', function ($scope, GoogleMapApi, pavementService) {

		var setSelected = function(model) {
			_.forEach($scope.polygons, function(polygon) {
				polygon.fill.color = NM.FILL_COLOR_DEFAULT;
				polygon.fill.opacity = NM.FILL_OPACITY_DEFAULT;
				polygon.stroke.color = NM.STROKE_COLOR_DEFAULT;
				polygon.stroke.weight = NM.STROKE_WEIGHT_DEFAULT;
			});

			model.fill.color = NM.FILL_COLOR_SELECTED;
			model.fill.opacity = NM.FILL_OPACITY_SELECTED;
			model.stroke.color = NM.STROKE_COLOR_SELECTED;
			model.stroke.weight = NM.STROKE_WEIGHT_SELECTED;

			$scope.selected = _.find($scope.polygons, function(polygon) {
				return polygon.isSelected();
			});

			$scope.treatments = pavementService.getTreatments($scope.selected.id);
			$scope.averageCondition = pavementService.getAverageConditionHistory($scope.selected.id);
			$scope.AADT = pavementService.getAADT($scope.selected.id);

			renderAverageConditionLineChart();
			renderAverageConditionBarChart();
			renderAADTLineChart();
		};

		$scope.polygonEvents = {
			'click': function(polygon, eventName, model, args) {
				setSelected(model);
			}
		};

		$scope.map = {
			center: {
				latitude: 40.6357,
				longitude: -111.9047
			},
			zoom: 16,
			options: {
				panControl: false,
				streetViewControl: false,
				zoomControl: false
			}
		};


		GoogleMapApi.then(function(maps) {
			$scope.map.options.mapTypeId = maps.MapTypeId.HYBRID;
		});


		$scope.selected = null;
		$scope.charts = {};
		$scope.treatments = [];
		$scope.polygons = pavementService.getSegments();
		setSelected($scope.polygons[0]);

		function renderAverageConditionLineChart() {
			$scope.charts['averageConditionLine'] = c3.generate({
				bindto: '#chart-average-condition-line',
				size: {
					height: 230
				},
				data: {
					x: 'x',
					columns: [
						['x'].concat($scope.averageCondition.keys),
						['Condition'].concat($scope.averageCondition.values)
					],
					type: 'area'
				},
				color: {
					pattern: ['#8f8f8f', '#f2f2f2']
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y'
						}
					}
				},
				legend: {
					show: false
				}
			});
		};

		function renderAverageConditionBarChart() {
			$scope.charts['averageConditionBar'] = c3.generate({
				bindto: '#chart-average-condition-bar',
				size: {
					height: 230
				},
				data: {
					x : 'x',
					columns: [
						['x'].concat($scope.averageCondition.keys),
						['Condition'].concat($scope.averageCondition.values)
					],
					type: 'bar'
				},
				groups: [
					['Condition']
				],
				color: {
					pattern: ['#666666', '#f2f2f2']
				},
				bar: {
					width: {
						ratio: 0.5 // this makes bar width 50% of length between ticks
					}
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y'
						}
					}
				},
				legend: {
					show: false
				}
			});
		};

		function renderAADTLineChart() {
			$scope.charts['AADT'] = c3.generate({
				bindto: '#chart-AADT-line',
				size: {
					height: 230
				},
				data: {
					x: 'x',
					columns: [
						['x'].concat($scope.AADT.keys),
						['Traffic'].concat($scope.AADT.values)
					],
					type: 'area'
				},
				color: {
					pattern: ['#8f8f8f', '#f2f2f2']
				},

				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y'
						}
					}
				},
				legend: {
					show: false
				}
			});
		};
	}]);
})();

