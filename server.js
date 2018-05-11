const express = require('express');
// Body parsing middleware.
var bodyParser = require('body-parser');

function show(req, res, next) {
    res.sendFile(__dirname + '/index.html');
};

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

function send_request(input_url, http_request) {
    console.log("sending req");
    var url = input_url.value;
    http_request.open("GET", url, true);
    http_request.send();
};

function provide_download_url(url, http_request, input_url, title) {
    url = encode_utf8(url);
    var tmp_url = url;
    var idx = url.indexOf("\\u");
    url = url.substring(0, idx);

    if (!url) {
        return (tmp_url, title);
    } else {
        send_request(dirty_hack_prefix, input_url, http_request);
    }
};

function handle_ajax_response(ajax_response) {
    var title = extract_title(ajax_response);
    var url = extract_url(ajax_response);
    var uri_encoded_title = encodeURI(title);
    var decoded_url = decodeURIComponent(url);

    if (!decoded_url.includes("http")) {
        // broken url - send again
        send_request(input_url, ajax_request);
    }
    var url_to_download_from = decoded_url + "title=" + uri_encoded_title;
    return provide_download_url(url_to_download_from, ajax_request, input_url, title);
};

function send_request_actually(url) {

    var requestify = require('requestify');

    var decoded_url = "";

    while (!decoded_url.includes("http")) {
        requestify.get(url).then(function(response) {
            // Get the response body (JSON parsed or jQuery object for XMLs)
            var body = response.getBody();
            var title = extract_title(body);
            var tmp_url = extract_url(body);
            var uri_encoded_title = encodeURI(title);
            decoded_url = decodeURIComponent(tmp_url);
        }
    );

    return decoded_url;

    }

};

function send_request_test(url) {
    return send_request_actually(url);
};

var app = express();
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/res'));

// Enables parsing application/x-www-form-urlencoded.
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function(req, res) {
    var url = req.body['url'];

    console.log("url: " + url);

    var decoded_url = send_request_test(url);

    var url_to_download_from = decoded_url + "title=" + uri_encoded_title;

    var new_url = encode_utf8(url);
    var tmp_url = new_url;
    var idx = new_url.indexOf("\\u");
    new_url = new_url.substring(0, idx);

    if (!new_url) {
        var resp_data = {'url': tmp_url, 'title': title};
    } else {
        console.log("didn't work, sry.");
        send_request_test(url);
    }

    req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
    });

    // ajax_request = new XMLHttpRequest();
    // ajax_request.addEventListener("load", function() {
    //     var data = handle_ajax_response(ajax_request.responseText);
    // });
    // send_request(input_url, ajax_request);

    // if (!data[0].includes("signature")) {
    //     // console.log("sig req - unable to dl");
    //     var res = "error";
    //     // show_err_msg();
    // } else {
    //     // activate_download_button(url, title);
    //     var res = {'url': data[0], 'title': data[1]};
    // }

    console.log(resp_data);
    res.send(resp_data);
    // hide_waiting_symbol();

    // res.sendStatus(200);
});

// Route configuration
app.get('/', show);

app.listen(8080, function() { console.log('YouTubeLoader listening on http://localhost:8080/'); });
