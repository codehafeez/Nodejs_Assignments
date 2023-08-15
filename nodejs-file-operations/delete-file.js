var fs = require('fs');
fs.unlink('helloworld.txt', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});