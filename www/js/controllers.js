angular.module('starter.controllers', [])

.controller('ModuleCtrl', function($scope) {
	var module = $scope;
	module.information = [];
});

/*

.controller('ModuleCtrl', [ '$http', function($http){
	var module = this;
	module.information = [];
	
	$http.get('store-products.json').success(function(data){
		module.information = data;
	});
} ]);

*/