//App.js

'use strict';

var app = angular
	.module('taskd', ['ngRoute', 'ngCookies'])
	.config(['$routeProvider', '$locationProvider',
		
		function ($routeProvider, $locationProvider) {
			$routeProvider.when('/', {
				controller: 'jobController',
				templateUrl: 'jobs.html',
			})
			
			.when('/welcome', {
				controller: 'loginController',
				templateUrl: 'welcome.html',
			})
			

			.when('/profile', {
				controller: 'profileController',
				templateUrl: 'profile.html',
			})
			
			.otherwise({ redirectTo: '/' });
	}])
	.run(['$rootScope', '$location', '$cookieStore', '$http',
		function run($rootScope, $location, $cookieStore, $http) {
			// keep user logged in after page refresh
			$rootScope.globals = $cookieStore.get('globals') || {};
			if ($rootScope.globals.currentUser) {
				$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
			}
			$rootScope.$on('$locationChangeStart', function (event, next, current) {
				// redirect to login page if not logged in and trying to access a restricted page
				console.log("changing page");
				
				var restrictedPage = ['/welcome'].indexOf($location.path()) === -1;
				if (restrictedPage) {
					$http.get('/isAuthenticated').then(function(success) {
						if (success.data === "") {
							$location.path('/welcome');
						} else {
							console.log("you are logged in");
						}
					}, function(failure) {
						console.log("ruh roh shaggy");
					});
				}
				
			});
		}]);

app.controller("jobController", function($scope, $http, $cookieStore, $location) {
	$scope.jobs = [];
	$http.get('/job_list').then(function(success) {
		var jobList = success.data;
		for (var i = 0; i <jobList.length; i++) {
			$scope.jobs.push(jobList[i]);
		}
	}, function(failure) {
		console.log("bad call to server");
	});


});

app.controller("loginController", function($scope, $http, $cookieStore, $location) {
	
	
});

app.controller("profileController", function($scope, $http, $cookieStore) {
	$scope.name = "not set";
	$scope.loc = "not set";
	$scope.profilePic = "err";
	// NYI
	/*$http.get('/user').then(function(success) {
		console.log("success!");
		console.log(success);
		$scope.name = success.data.name;
		$scope.loc = success.data.location;
		$scope.profilePic = success.data.profileUrl;
	}, function(failure) {
		console.log(failure);
	});
	*/ 
});
