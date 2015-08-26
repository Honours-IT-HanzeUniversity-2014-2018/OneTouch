function getData(url, object) {
    var xmlhttp = new XMLHttpRequest();
    var baseUrl = "http://145.37.65.36:9080/api/v1/";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            object.responseText = xmlhttp.responseText;
            object.response = true;
        }
    }

    xmlhttp.open("GET", baseUrl + url, true);
    xmlhttp.send();
}

function getUserProfile(object) {
    object.response = false;
    getData("user/profile.json", object);
}

function getMainMenu(object) {
    object.response = false;
    getData("main/menu.json", object);
}
