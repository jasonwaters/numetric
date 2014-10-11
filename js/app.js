(function() {

	var newTreatment = function(dateCompleted, description, cost) {
		return  {
			'dateCompleted': dateCompleted,
			'description': description,
			'cost': cost
		}
	};

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var app = angular.module('numetric', ['google-maps'.ns()]);

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

	app.controller('numetric-main', ['$scope', 'GoogleMapApi'.ns(), function ($scope, GoogleMapApi) {
		$scope.map = {
			center: {
				latitude: 40.442603,
				longitude: -111.909485
			},
			zoom: 10
		};

		GoogleMapApi.then(function(maps) {
		});

		$scope.charts = {};
		$scope.treatments = [
			newTreatment(new Date(2010, 0,1), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2011, 1,2), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2012, 2,9), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2013, 3,11), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2014, 4,21), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2014, 5,12), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2014, 5,12), "Chip Seal", getRandomInt(1000000, 10000000)),
			newTreatment(new Date(2014, 5,12), "Chip Seal", getRandomInt(1000000, 10000000)),
		];


		function renderAverageConditionLineChart() {
			$scope.charts['averageConditionLine'] = c3.generate({
				bindto: '#chart-average-condition-line',
				size: {
					height: 230
				},
				data: {
					x: 'x',
					columns: [
						['x', '2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
						['Condition', 60, 67, 88, 38, 64, 55, 41]
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
						['x', '2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
						['Condition', 60, 67, 88, 38, 64, 55, 41]
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
						['x', '2007-01-01', '2008-01-01', '2009-01-01', '2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01'],
						['Traffic', 40, 50, 55, 50, 47, 55, 48]
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


		$scope.initialize = function() {
			renderAverageConditionLineChart();
			renderAverageConditionBarChart();
			renderAADTLineChart();
		};

	}]);
})();

