var arrLen = function(arr){
	return 'Array Length is : '+arr.length;
}

var sumFunction = function(a,b){
	var result = a+b;
	return 'Sum of 2 number is : '+result;
}

var exampleName = "module exports example using function";

module.exports = {
	arrLen:arrLen,
	sumFunction:sumFunction,
	exampleName:exampleName
};
