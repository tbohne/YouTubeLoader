
function init_url() {

    var url_input = document.getElementById("url_input");

    url_input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {

            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange=function() {
                if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                    console.log(xmlhttp.responseText);
                }
            }
            xmlhttp.open("GET", url_input.value, true);
            xmlhttp.send();
        }
    });
};

window.addEventListener("DOMContentLoaded", function() {
    init_url();
}, false);
