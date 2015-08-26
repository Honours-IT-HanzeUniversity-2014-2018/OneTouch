angular.module('starter.controllers', [])

.controller('ModuleCtrl', [ '$http', '$scope', function($http, $scope){
	var module = $scope;
	var baseUrl = "http://145.37.68.31:8090/api/v1/";
	module.information = {};

	
	$http.get(baseUrl + "user/profile.json").success(function(data){
		module.information.info = data;
	});

} ]);

