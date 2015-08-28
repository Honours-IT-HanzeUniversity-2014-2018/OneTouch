
var resultSpeech;
var errorSpeech;

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
  window.plugins.speechrecognizer.stop(resultCallback, errorCallback);
  //DATA GELIJK VERZENDEN
}

function cancelRecognition(){
  console.log('canceled');
  window.plugins.speechrecognizer.stop();
}

function resultCallback (result){
  $scope.speaking = false;
  resultSpeech = result.results[0][0].transcript;
  //alert(result.results[0][0].transcript);
  $('.speechText').html(resultSpeech);
  resultSpeech = false
}

function errorCallback(error){
  $scope.speaking = false;
  errorSpeech = "error:" + error;
  $('.speechText').html(errorSpeech);
  errorSpeech = false
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