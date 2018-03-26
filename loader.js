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

function send_request(dirty_hack_prefix, input_url, http_request) {
    var url = dirty_hack_prefix + input_url.value;
    http_request.open("GET", url, true);
    http_request.send();
};

function provide_download_url(url, http_request, dirty_hack_prefix, input_url) {
    url = encode_utf8(url);
    var tmp_url = url;
    var idx = url.indexOf("\\u");
    url = url.substring(0, idx);

    if (!url) {
        var download_url = document.getElementById("download_url");
        download_url.href = tmp_url;
        download_url.style = "";
    } else {
        send_request(dirty_hack_prefix, input_url, http_request);
    }
};

function wait_for_url() {

    var dirty_hack_prefix = "https://crossorigin.me/";
    var input_url = document.getElementById("input_url");

    input_url.addEventListener("keyup", function(event) {
        event.preventDefault();

        if (event.keyCode === 13) {

            ajax_request = new XMLHttpRequest();

            ajax_request.addEventListener("load", function() {

                var http_response = ajax_request.responseText;
                var title = extract_title(http_response);
                var url = extract_url(http_response);
                var uri_encoded_title = encodeURI(title);
                var uri_decoded_url = decodeURIComponent(url);

                if (!uri_decoded_url.includes("http")) {
                    send_request(dirty_hack_prefix, input_url, ajax_request);
                }
                var url_to_download_from = uri_decoded_url + "title=" + uri_encoded_title;
                provide_download_url(
                    url_to_download_from, ajax_request, dirty_hack_prefix, input_url
                );

            });

            send_request(dirty_hack_prefix, input_url, ajax_request);
        }
    });
};

window.addEventListener("DOMContentLoaded", function() {
    wait_for_url();
}, false);
