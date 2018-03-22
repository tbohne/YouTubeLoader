function extract_title(http_response) {
    var str = "\"title\":\"";
    var start_idx = http_response.search(str) + str.length;
    var end_idx = http_response.indexOf("\",", start_idx);
    return http_response.substring(start_idx, end_idx);
};

function remove_itag_params(url) {
    var itag_idx = url.search("itag=");
    var end_idx = url.indexOf(itag_idx, "&");
    var substring = url.substring(itag_idx, end_idx);
    url = url.replace(substring, "");
    return substring;
};

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
};

function extract_url(http_response) {
    var str = "\"url_encoded_fmt_stream_map\":";
    var start_idx = http_response.search(str) + str.length + 1;
    var url_start_idx = http_response.indexOf("http", start_idx);
    var append_to_url = "";
    var url_meta_length = 4;

    if (start_idx != url_start_idx - url_meta_length) {
        append_to_url += "&";
        append_to_url += http_response.substring(start_idx, url_start_idx);
    }
    var end_idx = http_response.indexOf(",", url_start_idx);
    var url = http_response.substring(url_start_idx, end_idx);

    url += append_to_url;
    url = encode_utf8(url);
    url = remove_itag_params(url);

    return url;
};

function download_video(url, dirty_hack_prefix) {
    url = dirty_hack_prefix + url;
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "blob";
    request.onload = function() {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(this.response);
        a.download = this.response.name;
        console.log(this.response.responseText);
        document.body.appendChild(a);
        a.click();
    }
    request.send();
};

function init_url() {

    var dirty_hack_prefix = "https://crossorigin.me/";

    var url_input = document.getElementById("url_input");

    url_input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {

            xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    var http_response = xmlhttp.responseText;
                    var title = extract_title(http_response);
                    console.log("TITLE: " + title);
                    var url = extract_url(http_response);

                    var uri_encoded_title = encodeURI(title);
                    var uri_decoded_url = decodeURIComponent(url);
                    var url_to_download_from = uri_decoded_url + "title=" + uri_encoded_title;
                    download_video(url_to_download_from, dirty_hack_prefix);
                }
            }
            var url = dirty_hack_prefix + url_input.value;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
    });
};

window.addEventListener("DOMContentLoaded", function() {
    init_url();
}, false);
