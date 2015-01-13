"use strict";
/**
 *	Assorted Helper Functions
 */

//deep-copy, simple objects/functions/arrays
module.exports.DeepCopy = function deepCopy(obj){
	if(typeof obj === "object"){
		if(Array.isArray(obj)){
			return obj.map(deepCopy);
		}
		//not an array
		if(obj !== null){
			return Object.keys(obj).reduce(function(acc, key){
				return (acc[key] = deepCopy(obj[key]), acc);
			}, {});
		}
	}
	return obj;
};

//finds and returns a value in the array (if any) which does not match one of the object keys.
module.exports.ArrayValueNotInObjectKeys = function(arr, obj){
	return arr.reduce(function(acc, curr){
		return acc || (curr in obj ? null : curr);
	}, null);
};

//check for natural number
module.exports.IsNaturalNumber = function(n){
	return (typeof n === "number") && //is a number
			n >= 0 && //greater then or equal to zero (also implies !isNaN)
			isFinite(n) && //is finite (duh)
			Math.floor(n) === n; // is an integer;
};

//check an array for duplicate values.
module.exports.ArrayHasDuplicates = function(arr){
	return arr.reduce(function(acc, curr, idx){
		return acc || arr.lastIndexOf(curr) !== idx;
	}, false);
};

//add 2 numbers. useful in Array.reduce
module.exports.Sum = function(a,b){ return a + b; };

//round a number to given decimal places
module.exports.Round = function(num, dp){
	if(!dp){
		return Math.round(num); //as if dp === 0;
	}
	var m = Math.pow(10, dp);
	return Math.round(num * m) / m;
}