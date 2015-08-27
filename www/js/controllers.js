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
            $scope.status = Status.getStatus();
            $scope.profile = Profile.get();
            $scope.menu = OneTouchAPI.get(endpoint);
            var endpoint = '/api/v1/main/menu.json';
            var modalActivate = false;

            if($stateParams.endpoint !== undefined){
                endpoint = $stateParams.endpoint;
            }

            $scope.startSpeech = function(){                
                if(modalActivate == false){
                    $('.mic-field').addClass('speech-modal');
                    $('.speechButtons').fadeIn(function(){
                        $('.speechIntro').fadeIn();
                        modalActivate = true;
                    });  
                    recognizeSpeech(); 
                }
            };
            $scope.cancelSpeech = function(){
                if(modalActivate == true){
                    
                    $('.speechIntro').fadeOut();
                    $('.mic-field').removeClass('speech-modal');
                    $('.speechButtons').fadeOut(function(){
                        modalActivate = false;                 
                    });
                    stopRecognition();
                }
            }
            $scope.restartSpeech = function(){
                stopRecognition();
                recognizeSpeech(); 
            }
            $scope.okay = function(){
                $('.speechText').html("okay...");
            }

            $scope.reloadPage = function(){
                $scope.profile = Profile.get();
                $scope.menu = OneTouchAPI.get(endpoint);
            };

            $scope.itemClicked = function(item){
                if(item.action == null || item.loading || item.show_check) return;

                item.loading = true;
                OneTouchAPI.get(item.action).$promise.then(
                    function(response){
                        item.loading = false;

                        item.statuses += ' check';
                        item.show_check = true;

                        setTimeout(function() {
                            item.show_check = false;

                            for(var i in response.data)
                                item[i] = response.data[i];
                        }, 1000);

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
