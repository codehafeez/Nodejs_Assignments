var http = require('http');
var fs = require('fs');
http.createServer(function(req, res) {

	console.log('Current URL : '+req.url);
	if(req.url === "/" || req.url === "/home"){
		fs.createReadStream(__dirname + '/home.html').pipe(res)
	}
	else if(req.url === "/about"){
		fs.createReadStream(__dirname + '/about.html').pipe(res)
	}
	else {
		fs.createReadStream(__dirname + '/error.html').pipe(res)
	}

}).listen(8080);
