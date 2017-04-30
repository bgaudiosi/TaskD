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
			

			.when('/profile/:USER', {
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
	$scope.myJobs = [];
	$scope.user="";
	$http.get('/user_data').then(function(user_info) {
		$scope.user = user_info.data.userid;
		$http.get('/job_list').then(function(success) {
			var jobList = success.data;
			for (var i = 0; i <jobList.length; i++) {
				if (jobList[i].owner === $scope.user) {
					$scope.myJobs.push(jobList[i]);
				} else {
					$scope.jobs.push(jobList[i]);
				}
			}
		}, function(failure) {
			console.log("bad call to server");
		});
	}, function(failure) {
		console.log("server down");
	});
});

app.controller("loginController", function($scope, $http, $cookieStore, $location) {
	
	
});

app.controller("profileController", function($scope,$location,$route, $routeParams,$http, $cookieStore) {
	$http.get('/user_data').then(function(user_info) {
		$scope.user = user_info.data.userid;
		$scope.USER = ($location.path()).substring(9);
		var send = {username: $scope.USER}
		$http.post('/user_specific', send).then(function(success) {
			console.log(success.data);
			$scope.username = success.data.userid;
			$scope.name = success.data.name;
			$scope.location = success.data.location;
			if (success.data.description === undefined) {
				$scope.description = "Hi, contact me at 617-123-4567 for more information.";
			} else {
				console.log("why in here");
				console.log(success.data.description);
				$scope.description = success.data.description;
			}
		}, function(failure) {
			console.log("wrong");
		});
	}, function(fail) {
		console.log('err');
	});
});
