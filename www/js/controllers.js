angular.module('OneTouch.controllers', ['ngResource'])

    .constant('OneTouchConfig', {
          baseUrl: 'http://bb01.honours.robbytu.net:8090'
    })

    .factory('OneTouchAPI', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        return {
            get: function (endpoint, callback) {
                var resource = $resource(OneTouchConfig.baseUrl + endpoint);
                return resource.get(callback);
            }
        }
    }])

    .factory('Profile', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        return $resource(OneTouchConfig.baseUrl + '/api/v1/user/profile.json', {'get': {method:'GET', isArray:false}});
    }])

    .factory('Status', ['OneTouchAPI', function(OneTouchAPI) {
        var currentStatus = {};

        var reload = function(success, error){
            OneTouchAPI.get('/api/v1/main/status.json').$promise.then(
                function(response){
                    currentStatus = response;
                    success(currentStatus);
                }, function(error){
                    currentStatus = {};
                    error(currentStatus);
                }
            ); 
        }

        var getStatus = function(){
            return currentStatus;
        }

        return {
            getStatus: getStatus,
            reloadStatus: reload
        }

    }])

    .controller('MenuController',
    ['OneTouchAPI','Status', 'Profile', '$scope', '$state', '$stateParams',
    function (OneTouchAPI, Status, Profile, $scope, $state, $stateParams) {
        var status  = Status.getStatus();
        var endpoint = '/api/v1/main/menu.json';
        if($stateParams.endpoint !== undefined)
            endpoint = $stateParams.endpoint;

        $scope.profile = Profile.get();
        $scope.menu = OneTouchAPI.get(endpoint);

        $scope.itemClicked = function(item){
            OneTouchAPI.get(item.action).$promise.then(
                function(response){
                    alert('succeed');
                }, function(error){
                   alert('Geen actie gekoppeld');
                }
            );
        }
    }])

    .controller('StatusController',
    ['OneTouchAPI', 'Status', '$scope', function(OneTouchAPI, Status, $scope){
            
        var reloadStatus = function(){
            Status.reloadStatus(function(response){
                $scope.status = response;
            }, function(error){
                $scope.status = error;
            })
        }

        setInterval(reloadStatus, 2000);
        reloadStatus();
    }])
    ;
