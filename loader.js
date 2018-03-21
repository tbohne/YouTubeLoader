function init_url() {

    var url_input = document.getElementById("url_input");

    url_input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            alert("Requested URL: " + url_input.value);
        }
    });
};

window.addEventListener("DOMContentLoaded", function() {
    init_url();
}, false);
