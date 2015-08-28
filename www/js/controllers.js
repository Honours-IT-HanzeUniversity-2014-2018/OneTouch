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

    .factory('Speech', ['OneTouchConfig', '$resource', function(OneTouchConfig, $resource) {
        var resource = $resource(OneTouchConfig.baseUrl + '/api/v1/speech/process.json');

        resource.process = function(command, success_callback, error_callback) {
            resource.get({'command': command}).$promise.then(success_callback, error_callback);
        };

        return resource;
    }])

    .controller('MenuController',
        ['OneTouchAPI', 'Speech', 'Status', 'Profile', '$scope', '$state', '$stateParams',
        function (OneTouchAPI, Speech, Status, Profile, $scope, $state, $stateParams) {
            var modalActivate = false;
            var speaking = false;
            $scope.speaking = false;
            
            $scope.openAndStartSpeech = function(){                
                if(modalActivate == false){ 
                    $('.mic-field').addClass('speech-modal');
                    $('.speechButtons').fadeIn(); 
                    $scope.startSpeech();
                }
            };

            $scope.cancelAndCloseSpeech = function(){
                if(modalActivate == true){
                    $('.speechText').fadeOut();
                    $('.mic-field').removeClass('speech-modal');
                    $('.speechButtons').fadeOut(function(){
                        modalActivate = false; 
                    });
                    $scope.speaking = false;
                    cancelRecognition();
                }
            };

            $scope.startSpeech = function(){
                $('.speechText').fadeIn(function(){
                    modalActivate = true;
                });
                $scope.speaking = true;
                recognizeSpeech(); 
            };
            
            $scope.restartSpeech = function(){
                if($scope.speaking == false){
                    $scope.startSpeech();
                } else {
                    stopRecognition();
                }
            };

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
            };

            /* ------------------------------------------- */
            /* ----------------SPEECH -------------------- */
            /* ------------------------------------------- */

            function recognizeSpeech() {
                var maxMatches = 5;
                var language = "nl-NL";
                $('.speechText').html('U kunt beginnen met praten.');
                window.plugins.speechrecognizer.start(resultCallback, errorCallback, maxMatches, language);
            }

            function stopRecognition() {
                window.plugins.speechrecognizer.stop(resultCallback, errorCallback);
            }

            function cancelRecognition() {
                $scope.speaking = false;
                window.plugins.speechrecognizer.stop();
            }

            function resultCallback(result) {
                var resultSpeech = result.results[0][0].transcript;
                $('.speechText').html(resultSpeech);

                $scope.speaking = false;
                $scope.loading_speech = true;

                $('.speechButtons').fadeOut();

                var speech_error = function() {
                    $scope.loading_speech = false;

                    $('.mic-field').addClass('error');
                    setTimeout(function() {
                        $('.mic-field').removeClass('error');
                        $scope.cancelAndCloseSpeech();
                    }, 2000);
                };

                Speech.process(resultSpeech, function(response) {
                    $scope.loading_speech = false;

                    if(response.success) {
                        $('.mic-field').addClass('check');
                        setTimeout(function () {
                            $('.mic-field').removeClass('check');
                            $scope.cancelAndCloseSpeech();
                        }, 2000);
                    }
                    else {
                        speech_error();
                    }
                }, function(error) {
                    speech_error();
                });
            }

            function errorCallback(error) {
                $('.speechText').html("De spraak werd niet herkent.");
                $scope.speaking = false;
            }

            $scope.status = Status.getStatus();
            var endpoint = '/api/v1/main/menu.json';

            if($stateParams.endpoint !== undefined){
                endpoint = $stateParams.endpoint;
            }

            $scope.profile = Profile.get();
            $scope.menu = OneTouchAPI.get(endpoint);
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
