var http = require('http');

http.createServer(function (req, res) {


	fs = require('fs');
	fs.appendFile('helloworld.txt', 'ABC Test Message', function (err) {

	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.end('Append Data -> helloworld.txt');
	  
	});


}).listen(8080);

