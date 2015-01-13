"use strict";
/*
 *	Instructions for a step in our simulation.
 *
 *	These function help validate and calculate costs for given instructions.
 *
 *	Also give an opportunity to describe the Instructions format. It is a plain
 *  object, but with specific keys.
 *
 *	"Engineering" -> Array of task names (must be the names of the keys of the Engineering object in the model)
 *	                 Array length must be less than or equal to the model.DeveloperResources value.
 *
 *	"Marketing" -> Array of task names (must be the names of the keys of the Marketing object in the model)
 *	               The array must contain each task at most once.
 *
 *	"Acquisitions" -> Number of visitors to pay for.
 */
var help = require("./helpers");

//Validate an instruction set, throw on error.
module.exports.Validate = function(instructions, model){
	if(!("Acquisitions" in instructions)){
		instructions.Acquisitions = 0;
	}
	if(!("Engineering" in instructions)){
		instructions.Engineering = [];
	}
	if(!("Marketing" in instructions)){
		instructions.Marketing = [];
	}
	//Check Acquisitions is a number, finite, integer and >= 0
	if(!help.IsNaturalNumber(instructions.Acquisitions)){
		throw new Error("Acquisitions must be a non-negative finite integer");
	}

	//Check Engineering is valid
	if(!Array.isArray(instructions.Engineering)){
		throw new Error("invalid type given for Engineering (not Array)");
	}
	if(instructions.Engineering.length > model.DeveloperResources){
		throw new Error("Over Allocated Engineering Resource");
	}
	//see if we have an invalid task
	var badTask;
	if( (badTask = help.ArrayValueNotInObjectKeys(instructions.Engineering, model.Engineering)) !== null){
		throw new Error("Invalid Engineering task in instructions: `"+badTask+"`");
	}
	//now check Merketing for invalid tasks
	if( (badTask = help.ArrayValueNotInObjectKeys(instructions.Marketing, model.Marketing)) !== null ){
		throw new Error("Invalid Marketing task in instructions: `"+badTask+"`");
	}
	//check for duplicate tasks
	if(help.ArrayHasDuplicates(instructions.Marketing)){
		throw new Error("Duplicate marketing task attempted");
	}

	//All good if we get to here, return for good measure.
	return true;
};

//calculate the cost from an instructionSet (we assume it passed validation)
module.exports.Cost = function(instructions, model){
	return (
		(instructions.Acquisitions * model.AcquisitionCost) + //acquisitions cost, plus...
		["Marketing", "Engineering"].map(function(key){ //for Marketing and Engineering
			return instructions[key].map(function(task){ //map to cost of each task
				return model[key][task].cost;
			}).reduce(help.Sum, 0); // and work out the sum
		}).reduce(help.Sum, 0) // then work out the total sum
	);
};