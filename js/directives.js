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


	//http://stackoverflow.com/questions/12295983/set-active-tab-style-with-angularjs
	app.directive('detectActiveTab', ['$location',
		function($location) {
			return {
				link: function postLink(scope, element, attrs) {
					scope.$on("$routeChangeSuccess", function(event, current, previous) {
						/*
						 Designed for full re-usability at any path, any level, by using data from attrs.
						 Declare like this: <li class="nav_tab"><a href="#/home" active-tab="1">HOME</a></li>
						 */

						// This var grabs the tab-level off the attribute, or defaults to 1
						var pathLevel = attrs.detectActiveTab || 1,
						// This var finds what the path is at the level specified
							pathToCheck = $location.path().split('/')[pathLevel] || "current $location.path doesn't reach this level",
						// This var finds grabs the same level of the href attribute
							tabLink = attrs.href.split('/')[pathLevel] || "href doesn't include this level";
						//console.log(pathToCheck);
						//console.log(tabLink);
						// Above, we use the logical 'or' operator to provide a default value in cases
						// where 'undefined' would otherwise be returned.
						// This prevents cases where undefined===undefined, possibly causing multiple tabs to be 'active'.

						// now compare the two:
						var li = $(element).parent('li');
						if (pathToCheck === tabLink) {
							li.addClass("active");
						} else {
							li.removeClass("active");
						}
					});
				}
			};
		}
	]);
})();