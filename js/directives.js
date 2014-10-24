(function() {
	"use strict";

	var app = angular.module('numetric.directives', []);

	app.directive('focusMe', function ($timeout) {
		return {
			scope: { trigger: '@focusMe' },
			link: function (scope, element) {
				scope.$watch('trigger', function (value) {
					if (value === "true") {
						$timeout(function () {
							element[0].focus();
						});
					}
				});
			}
		};
	});

})();