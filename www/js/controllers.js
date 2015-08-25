angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicHistory) {
	$scope.myGoBack = function() {
	    $ionicHistory.goBack();
	  };
});