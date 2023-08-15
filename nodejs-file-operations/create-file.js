var http = require('http');

http.createServer(function (req, res) {


	fs = require('fs');
	fs.writeFile('helloworld.txt', 'Hello World!', function (err) {

	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.end('Hello World > helloworld.txt');
	  
	});


}).listen(8080);