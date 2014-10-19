(function() {
	"use strict";

	var app = angular.module('numetric.filters', []);

	app.filter('bigmoney', function () {
		return function (value) {
			return numeral(value).format('($0.0 a)')
		};
	});


	app.filter('lastItem', function () {
		return function (list) {
			if (list.length == 0) {
				return 0;
			}
			return list[list.length - 1];
		};
	});
})();