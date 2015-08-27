
function onDeviceReady(){
  console.log("Device is ready");
}

function recognizeSpeech() {
  var maxMatches = 5;
  var language = "nl-NL";
  //alert(window.plugins);
  //alert(window.plugins.speechrecognizer);
  console.log('started');
  window.plugins.speechrecognizer.start(resultCallback, errorCallback, maxMatches, language);
}

function stopRecognition(){
  console.log('stopped');
  window.plugins.speechrecognizer.stop();
  //window.plugins.speechrecognizer.stop(resultCallback, errorCallback);
  
}

function resultCallback (result){
  $('.speechIntro').html("Gesproken text hier");
  //$('.speechIntro').append('"' +result.results[0][0].transcript + '"');
}

function errorCallback(error){
  alert('error, ' +error);
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