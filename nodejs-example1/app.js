const myArr = ['v1', 'v2', 'v3', 'v4', 'v5'];
var arrLen = function(arr){
	return 'Array Length is : '+arr.length;
}
console.log(arrLen(myArr));





// run this function from count.js file
var arrLenCountFileFunction = require('./count');
const myArray = ['shoes', 'shirts', 'socks', 'sweaters'];
console.log(arrLenCountFileFunction(myArray));
