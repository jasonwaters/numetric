(function() {
	var DEFAULT_FILL_COLOR = '#aeaeae',
		DEFAULT_FILL_OPACITY = 0.6,
		DEFAULT_STROKE_COLOR = '#666666',
		DEFAULT_STROKE_WEIGHT = 1;

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
					color: DEFAULT_STROKE_COLOR,
					weight: DEFAULT_STROKE_WEIGHT
				},
				fill: {
					color: DEFAULT_FILL_COLOR,
					opacity: DEFAULT_FILL_OPACITY
				}
			}
		}
	};


	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};


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
				latitude: 40.6357,
				longitude: -111.9047
			},
			zoom: 16
		};

		var setPolygonSelected = function(model) {
			var size = $scope.polygons.length;

			for(var i=0;i<size;i++) {
				var polygon = $scope.polygons[i];
				polygon.fill.color = DEFAULT_FILL_COLOR;
				polygon.fill.opacity = DEFAULT_FILL_OPACITY;
				polygon.stroke.color = DEFAULT_STROKE_COLOR;
				polygon.stroke.weight = DEFAULT_STROKE_WEIGHT;
			}

			model.fill.color = "#abbffe";
			model.fill.opacity = .8;
			model.stroke.color = "#5f7acf";
		};

		$scope.polygonEvents = {
			'click': function(polygon, eventName, model, args) {
				setPolygonSelected(model);
			}
		};

		$scope.polygons = [
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


		GoogleMapApi.then(function(maps) {
		});

		$scope.charts = {};
		$scope.treatments = [
			Generate.treatment(new Date(2010, 0,1), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2011, 1,2), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2012, 2,9), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2013, 3,11), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2014, 4,21), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2014, 5,12), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2014, 5,12), "Chip Seal", getRandomInt(1000000, 10000000)),
			Generate.treatment(new Date(2014, 5,12), "Chip Seal", getRandomInt(1000000, 10000000)),
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

