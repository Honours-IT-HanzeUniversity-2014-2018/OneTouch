angular.module('OneTouch.controllers', ['ngResource'])

    .constant('OneTouchConfig', {
          baseUrl: 'http://bb01.honours.robbytu.net:8090'
    })

    .factory('OneTouchAPI', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        return {
            get: function (endpoint) {
                var resource = $resource(OneTouchConfig.baseUrl + endpoint);
                return resource.get();
            }
        }
    }])

    .factory('Profile', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        return $resource(OneTouchConfig.baseUrl + '/api/v1/user/profile.json', {'get': {method:'GET', isArray:false}});
    }])

    .controller('MenuController',
    ['OneTouchAPI', 'Profile', '$scope', '$state', '$stateParams',
    function (OneTouchAPI, Profile, $scope, $state, $stateParams) {
        var endpoint = '/api/v1/main/menu.json';
        if($stateParams.endpoint !== undefined)
            endpoint = $stateParams.endpoint;

        $scope.profile = Profile.get();
        $scope.menu = OneTouchAPI.get(endpoint);
    }]);
