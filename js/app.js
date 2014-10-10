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

	var app = angular.module('numetric', []);


	app.filter('bigmoney', function() {
		return function(value) {
			return numeral(value).format('($0.0 a)')
		};
	});

	app.controller('numetric-main', ['$scope', function ($scope) {
		$scope.chart = null;
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


		function renderLineChart() {
			$scope.chart1 = c3.generate({
				bindto: '#chart-average-condition-line',
				size: {
					height: 230
				},
				data: {
					x: 'x',
//        			xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
					columns: [
						['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
//			            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
						['data1', 30, 200, 100, 400, 150, 250],
						['data2', 130, 340, 200, 500, 250, 350]
					]
				},
				axis: {
					x: {
						type: 'timeseries',
						tick: {
							format: '%Y-%m-%d'
						}
					}
				}
			});
		};

		function renderBarChart() {
			$scope.chart2 = c3.generate({
				bindto: '#chart-average-condition-bar',
				size: {
					height: 230
				},
				data: {
					columns: [
						['data1', 30, 200, 100, 400, 150, 250],
						['data2', 130, 100, 140, 200, 150, 50]
					],
					type: 'bar'
				},
				bar: {
					width: {
						ratio: 0.5 // this makes bar width 50% of length between ticks
					}
					// or
					//width: 100 // this makes bar width 100px
				}
			});
		}



		$scope.initialize = function() {
			renderLineChart();
			renderBarChart();
		};

		$scope.blah = "blah";
	}]);
})();

