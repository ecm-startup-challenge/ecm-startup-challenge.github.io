"use strict";
/**
 *	The Simulator for the Startup Challenge.
 *
 *  We expose a function that will run the simlution given a "solution", and
 *  Produce the data on WAU at each step so we can graph it.
 */
var help = require("./helpers"),
	instructions = require("./instructions");

//This does the simulation, the default model is taken from "model.js", and should be of the same form
// The solution should be a function which is called with the model and returns another function which
// is called repeatedly to get instructions for each week.
// This allows your solution to inspect the "model" and adjust itself accordingly.
// If you are using fixed data, there is a helper "FixedDataSolution", which turns an array
// of instructions into a "solution" function.
var Simulate = exports.Simulate = function Simulate(model, solution){
	//deepCopy model we can safely pass it into the solution function, without risk of tampering
	var StepFunction = solution(help.DeepCopy(model));

	//Create our State Object.
	// we will copy this at each stage, so we have history.
	var State = {
		Budget: model.Budget,
		WAU: model.WAU,
		Retention: model.Retention,
		Conversion: model.Conversion,
		Virality: model.Virality,
		ModifiedRetention: model.Retention,
		ModifiedConversion: model.Conversion,
		ModifiedVirality: model.Virality
	};

	var Result = {
		States: [help.DeepCopy(State)],
		Error: null
	};

	var weeks = model.Weeks; //prevent screwing with model...
	while(weeks--){
		try {
			State = calculateNextState(State, StepFunction, model);
		}catch(err){
			Result.Error = {
				Msg: err.message,
				Stack: err.stack
			};
			break;
		}
		Result.States.push(help.DeepCopy(State));
	}

	//finally return the results.
	return Result;
};

//This does the hard work, calculating the values for the next state, based on the last one.
//It will throw an error if you go over budget, or break the rules.
//We mutate the state given (so be careful!)
function calculateNextState(state, step, model){
	//First get our instructions
	var stepInstructions = step(help.DeepCopy(state));

	//Now check they are valid (validateInstructions throws on Error, caught in the main Simulate loop)
	instructions.Validate(stepInstructions, model);

	//Now start by assessing the cost of the instructions
	var cost = instructions.Cost(stepInstructions, model);

	if(cost > state.Budget){
		//To expensive
		throw new Error("Attempted Over-spend");
	}

	//subtract cost
	state.Budget -= cost;

	//Now working out the next state, first we apply the "permanent" changes (Engineering)
	stepInstructions.Engineering.forEach(function(task){
		var op = model.Engineering[task];
		state[op.target] = op.effect(state[op.target]);
	});

	//Now we work out the modifier effects (Marketing), but first reset
	["Retention", "Virality", "Conversion"].forEach(function(target){
		state["Modified"+target] = state[target];
	});

	//this applies the marketing instructions to the tempMetrics
	stepInstructions.Marketing.forEach(function(task){
		var op = model.Marketing[task];
		state["Modified"+op.target] = op.effect(state[op.target]);
	});

	//keep a note of the original WAU
	var WAU = state.WAU;

	//Now apply the metrics, first we set it to remove users lost to churn
	//NB we round down people at every stage of calculation
	state.WAU = Math.floor(WAU * state.ModifiedRetention);

	//then we add organic growth users
	state.WAU += Math.floor(Math.floor(WAU * state.ModifiedVirality) * state.ModifiedConversion);

	//then we add purchased users
	state.WAU += Math.floor(stepInstructions.Acquisitions * state.ModifiedConversion);

	//now return the new state.
	return state;
}

//Turns an array of instructions into a "solution"
var FixedDataSolution = exports.FixedDataSolution = function(instructionArray){
	//don't work with the original
	var data = help.DeepCopy(instructionArray);
	return function(model){
		//we don't care about model...
		return function(){
			//return the first entry in the array.
			return data.shift();
		};
	};
};