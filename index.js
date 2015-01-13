"use strict";
/*
 *	When used as a module, we expose a single function that uses the model and simulates the outcome
 *	of the given solution.
 */
var Simulate = require("./lib/simulator").Simulate,
	Model = require("./lib/model");

//Bind this Simulate function to the given model.
module.exports = Simulate.bind(null, Model);