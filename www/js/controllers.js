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

            $scope.status = Status.getStatus();
            var endpoint = '/api/v1/main/menu.json';

            if($stateParams.endpoint !== undefined){
                endpoint = $stateParams.endpoint;
            }

            $scope.profile = Profile.get();
            $scope.menu = OneTouchAPI.get(endpoint);

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


            /* ------------------------------------------- */
            /* ----------------SPEECH -------------------- */
            /* ------------------------------------------- */
            function onDeviceReady(){
              console.log("Device is ready");
            }

            function recognizeSpeech() {
              var maxMatches = 5;
              var language = "nl-NL";
              //alert(window.plugins);
              //alert(window.plugins.speechrecognizer);
              console.log('started');
               $('.speechText').html('U kunt beginnen met praten. <br> Druk op het laad icoontje om te stoppen');
              window.plugins.speechrecognizer.start(resultCallback, errorCallback, maxMatches, language);
            }

            function stopRecognition(){
              console.log('stopped');
              $scope.speaking = false;
              window.plugins.speechrecognizer.stop(resultCallback, errorCallback);
              //DATA GELIJK VERZENDEN
            }

            function cancelRecognition(){
              console.log('canceled');
              $scope.speaking = false;
              window.plugins.speechrecognizer.stop();
            }

            function resultCallback (result){
              $scope.speaking = false;
              var resultSpeech = result.results[0][0].transcript;
              //alert(result.results[0][0].transcript);
              $('.speechText').html(resultSpeech);
            }

            function errorCallback(error){
              $scope.speaking = false;
              var errorSpeech = "error:" + error;
              $('.speechText').html(errorSpeech);
              //alert('error, ' +error);
            }

            // Show the list of the supported languages
            function getSupportedLanguages() {
              window.plugins.speechrecognizer.getSupportedLanguages(function(languages){
                // display the json array
                alert(languages);
              }, function(error){
                alert("Could not retrieve the supported languages : " + error);
              });
            }

            document.addEventListener("deviceready", onDeviceReady, true);

            






            
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
