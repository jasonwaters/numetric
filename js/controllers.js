(function() {
	"use strict";

	var app = angular.module('numetric.controllers', []);

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

			var treatmentLines = [];

			_.forEach($scope.treatments, function(treatment) {
				treatmentLines.push({
					'value': moment(treatment.dateCompleted).startOf('year').format('YYYY-MM-DD'),
					'text': treatment.id
				});
			});

			$scope.charts.averageConditionLine = c3.generate({
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
					pattern: ['#1daed7']
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
				},
				grid: {
					x: {
						lines: treatmentLines
					}
				}
			});
		}

		function renderAverageConditionBarChart() {
			var treatmentLines = [];

			_.forEach($scope.treatments, function(treatment) {
				treatmentLines.push({
					'value': moment(treatment.dateCompleted).startOf('year').format('YYYY-MM-DD'),
					'text': treatment.id
				});
			});

			$scope.charts.averageConditionBar = c3.generate({
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
					pattern: ['#43c1df', '#8e837e']
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
				grid: {
					focus: {
						show: false
					},
					x: {
						lines: treatmentLines
					}
				},
				legend: {
					show: false
				}
			});
		}

		function renderAADTLineChart() {
			$scope.charts.AADT = c3.generate({
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
					pattern: ['#1daed7']
				},

				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y'
						}
					},
					y: {
						tick: {
							format: function(y) {
								return numeral(y).format('0a');
							}
						}
					}
				},
				legend: {
					show: false
				}
			});
		}
	}]);

	app.controller('numetric-map', ['$scope', '$timeout', 'GoogleMapApi'.ns(), 'Logger'.ns(), 'search-service', function($scope, $timeout, GoogleMapApi, Logger, searchService) {
		//Logger.doLog = true;
		$scope.showBarriers = true;
		$scope.showSigns = true;
		$scope.showMileposts = false;

		$scope.barriers = [];
		$scope.signs = [];
		$scope.mileposts = [];
		$scope.filterText = '';

		$scope.map = {
			center: {
				latitude: 40.6357,
				longitude: -111.9047
			},
			zoom: 16,
			bounds: {},
			options: {
				panControl: false,
				streetViewControl: true,
				zoomControl: true
			}
		};

		var fetchBarriers = _.debounce(function() {
			if(!$scope.showBarriers || !$scope.map.bounds.hasOwnProperty('northeast')) {
				return;
			}

			searchService.getBarriers($scope.map.bounds, $scope.filterText).then(function(response) {
				$scope.barriers = response;
			});
		}, 1000);

		var fetchSigns = _.debounce(function() {
			if(!$scope.showSigns || !$scope.map.bounds.hasOwnProperty('northeast')) {
				return;
			}
			searchService.getSigns($scope.map.bounds, $scope.filterText).then(function(response) {
				$scope.signs = response;
			});
		}, 1000);

		function fetchData() {
			fetchSigns();
			fetchBarriers();
		}

		GoogleMapApi.then(function(maps) {
			$scope.map.options.mapTypeId = maps.MapTypeId.HYBRID;

			$scope.$watch('showBarriers', function(newValue, oldValue) {
				if(newValue) {
					fetchBarriers();
				}else {
					$scope.barriers = [];
				}
			});

			$scope.$watch('showSigns', function(newValue, oldValue) {
				if(newValue) {
					fetchSigns();
				}else {
					$scope.signs = [];
				}
			});

			$scope.$watch('filterText', _.debounce(function(newValue, oldValue) {
				fetchData();
			}, 1000));

			//watch map.bounds, fetch new data when bounds changes.
			$scope.$watch(function() {return $scope.map.bounds;}, function(newValue, oldValue) {
				fetchData();
			}, true);

		});


		$scope.signOptions = {};
		$scope.signEvents = {
			clicked: function(marker, eventName, model, args) {
			}
		};
	}]);

})();