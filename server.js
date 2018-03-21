// https://stackoverflow.com/questions/6084360/using-node-js-as-a-simple-web-server

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8080, function(){
    console.log('Server running on 8080...');
});

// Run with Node.js
// $ node server.js
// You can now go to http://localhost:8080/yourfile.html
