angular.module('starter.controllers', [])

.controller('ModuleCtrl', [ '$http', '$scope', function($http, $scope){
	var module = $scope;
	var baseUrl = "http://145.37.68.31:8090/api/v1/";
	console.log($scope)
	
	$http.get(baseUrl + "user/profile.json").success(function(data){
		module.profile = data;
	});

	$http.get(baseUrl + "main/menu.json").success(function(data){
		module.menu = data;
	});

} ]);