
function onDeviceReady(){
  console.log("Device is ready");
}

function recognizeSpeech() {
  var maxMatches = 5;
  var language = "en-US";
  window.plugins.speechrecognizer.start(resultCallback, errorCallback, maxMatches, language);
}

function stopRecognition(){
  window.plugins.speechrecognizer.stop(resultCallback, errorCallback);

}

function resultCallback (result){
  console.log(result);
  alert(result.results[0][0].transcript);
}

function errorCallback(error){
  console.log(error);
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