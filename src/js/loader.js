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
    show_waiting_symbol();
    var url = dirty_hack_prefix + input_url.value;
    http_request.open("GET", url, true);
    http_request.send();
};

function show_err_msg() {
    var error_msg = document.getElementById("error_msg");
    error_msg.style.display = "block";
};

function hide_err_msg() {
    var error_msg = document.getElementById("error_msg");
    error_msg.style.display = "none";
};

function show_waiting_symbol() {
    var waiting_symbol = document.getElementById("waiting_symbol");
    waiting_symbol.style.display = "block";
};

function hide_waiting_symbol() {
    var waiting_symbol = document.getElementById("waiting_symbol");
    waiting_symbol.style.display = "none";
};

function activate_download_button(url) {
    var download_button = document.getElementById("download_button");
    download_button.href = url;
    download_button.style = "";
};

function deactivate_download_button() {
    var download_button = document.getElementById("download_button");
    download_button.href = "";
    download_button.style = "display: none";
};

function provide_download_url(url, http_request, dirty_hack_prefix, input_url) {
    url = encode_utf8(url);
    var tmp_url = url;
    var idx = url.indexOf("\\u");
    url = url.substring(0, idx);

    if (!url) {
        if (!tmp_url.includes("signature")) {
            console.log("sig req - unable to dl");
            show_err_msg();
        } else {
            activate_download_button(tmp_url);
        }
        hide_waiting_symbol();
    } else {
        send_request(dirty_hack_prefix, input_url, http_request);
    }
};

function restore_initial_state() {
    hide_err_msg();
    deactivate_download_button();
};

function handle_ajax_response(ajax_response, dirty_hack_prefix) {
    var title = extract_title(ajax_response);
    var url = extract_url(ajax_response);
    var uri_encoded_title = encodeURI(title);
    var decoded_url = decodeURIComponent(url);

    if (!decoded_url.includes("http")) {
        // broken url - send again
        send_request(dirty_hack_prefix, input_url, ajax_request);
    }
    var url_to_download_from = decoded_url + "title=" + uri_encoded_title;
    provide_download_url(url_to_download_from, ajax_request, dirty_hack_prefix, input_url);
};

function wait_for_url() {
    var dirty_hack_prefix = "https://cors-anywhere.herokuapp.com/";
    var input_url = document.getElementById("input_url");

    input_url.addEventListener("keyup", function(event) {

        event.preventDefault();

        if (event.keyCode === 13) {
            restore_initial_state();
            ajax_request = new XMLHttpRequest();

            ajax_request.addEventListener("load", function() {
                handle_ajax_response(ajax_request.responseText, dirty_hack_prefix);
            });

            send_request(dirty_hack_prefix, input_url, ajax_request);
        }
    });
};

window.addEventListener("DOMContentLoaded", function() {
    wait_for_url();
}, false);
