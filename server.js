const express = require('express');

function show(req, res, next) {
    res.sendFile(__dirname + '/index.html');
};

var app = express();
app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/res'));

// Route configuration
app.get('/', show);

app.listen(8080, function() { console.log('YouTubeLoader listening on http://localhost:8080/'); });
