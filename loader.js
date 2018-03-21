function extract_title(http_response) {
    var str = "\"title\":\"";
    var start_idx = http_response.search(str) + str.length;
    var end_idx = http_response.indexOf("\",", start_idx);
    return http_response.substring(start_idx, end_idx);
};

function init_url() {

    var url_input = document.getElementById("url_input");

    url_input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {

            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var http_response = xmlhttp.responseText;
                    var title = extract_title(http_response);
                    console.log(title);
                }
            }
            var url = "https://crossorigin.me/" + url_input.value;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    });
};

window.addEventListener("DOMContentLoaded", function() {
    init_url();
}, false);
