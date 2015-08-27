angular.module('OneTouch.controllers', ['ngResource'])

    .constant('OneTouchConfig', {
          baseUrl: 'http://bb01.honours.robbytu.net:8090'
    })

    .factory('OneTouchAPI', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        return {
            get: function(endpoint, callback) {
                var resource = $resource(OneTouchConfig.baseUrl + endpoint);
                return resource.get(callback);
            }
        }
    }])

    .factory('Profile', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        return $resource(OneTouchConfig.baseUrl + '/api/v1/user/profile.json');
    }])

    .factory('Status', ['OneTouchAPI', function(OneTouchAPI) {
        var currentStatus = {};

        var reload = function(success, error){
            OneTouchAPI.get('/api/v1/main/status.json').$promise.then(
                function(response){
                    currentStatus = response;
                    success(currentStatus);
                }, function(response){
                    currentStatus = {};
                    error(currentStatus);
                }
            );
        };

        var getStatus = function(){
            return currentStatus;
        };

        return {
            getStatus: getStatus,
            reloadStatus: reload
        }

    }])

    .controller('MenuController',
        ['OneTouchAPI','Status', 'Profile', '$scope', '$state', '$stateParams',
        function (OneTouchAPI, Status, Profile, $scope, $state, $stateParams) {
            $scope.reloadPage = function(){
                $scope.profile = Profile.get();
                $scope.menu = OneTouchAPI.get(endpoint);
            };

            $scope.status = Status.getStatus();

            var endpoint = '/api/v1/main/menu.json';

            if($stateParams.endpoint !== undefined){
                endpoint = $stateParams.endpoint;
            }

            $scope.profile = Profile.get();
            $scope.menu = OneTouchAPI.get(endpoint);

            $scope.itemClicked = function(item){
                if(item.action == null) return;

                item.loading = true;
                OneTouchAPI.get(item.action).$promise.then(
                    function(response){
                        for(var i in response.data) {
                            item[i] = response.data[i];
                        }
                        item.loading = false;
                    }, function(error){
                        alert("Action mislukt");
                        item.loading = false;
                    }
                );
            }
        }
    ])

    .controller('StatusController',
        ['OneTouchAPI', 'Status', '$scope',
        function(OneTouchAPI, Status, $scope){
            var reloadStatus = function(){
                Status.reloadStatus(function(response){
                    $scope.status = response;
                }, function(error){
                    $scope.status = error;
                })
            };

            setInterval(reloadStatus, 2000);
            reloadStatus();
        }
    ])
    ;
