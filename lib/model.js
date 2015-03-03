"use strict";

function bumpPercent(bump, max){
	return function(current){
		return Math.min(current+bump, max);
	};
}

function dropPercent(drop){
	return function(current){
		return Math.max(current-drop, 0);
	};
}

function identity(x){ return x; }

function consectutiveDiminishingBump(bump, max, diminishFactor){
	var lastCalledInWeek = -Infinity, count = 0;
	return function(value, weekNo){
		if(lastCalledInWeek +1 === weekNo){
			//bump count!
			count++;
		}else{
			count = 0;
		}
		lastCalledInWeek = weekNo;
		return Math.min(value + (bump * Math.pow(diminishFactor, count)), max);
	};
}

/**
 *	Model Details for StartupChallenge
 *	each developer
 */
var model = function(options){
	options = options||{version: 1};
	var VERSION = options.version;
	return {
		//The Weekly Average users at the start
		WAU: 97500,

		//The budget you have
		Budget: 1000000,

		//The Initial Retention Value (proportion of WAU that you will keep week on week)
		Retention: 0.7,

		//The Initial Virality Value (number of organic new visitors as a proportion of existing WAU)
		Virality: 0.3,

		//The Initial Conversion Rate (proportion of Visitors that become WAU)
		Conversion: 0.5,

		//The number of Weeks the challenge will run over
		Weeks: 10,

		//The developer resource you have for you project
		DeveloperResource: 2,

		//Marketing Options, Effects are temporary (only in the week they are bought)
		// can only be bought once in a week
		Marketing: {
			"Promoted Posts (virality)": {
				cost: 25000,
				target: "Virality",
				effect: ({
					"1": bumpPercent(0.1, +Infinity), //10% Virality increase (Virality CAN exceed 100%)
					"2": consectutiveDiminishingBump(0.1, +Infinity, 0.5)
				})[VERSION]
			},
			"Celebrity Endorsement (retention)": {
				cost: 25000,
				target: "Retention",
				effect: ({
					"1": bumpPercent(0.1, 1.0), // 10% Retention increase, (Retention cannot exceed 100%)
					"2": consectutiveDiminishingBump(0.1, +Infinity, 0.5)
				})[VERSION]
			},
			"PR (signup conversion)": {
				cost: 25000,
				target: "Conversion",
				effect: ({
					"1": bumpPercent(0.1, 1.0), // 10% Conversion increase (Conversion cannot exceed 100%)
					"2": consectutiveDiminishingBump(0.1, +Infinity, 0.5)
				})[VERSION]
			}
		},

		//Acquistion, Get visitors by paying, e.g. Facebook Install Ads
		//this value is the cost of a single new visitor (not new user)
		AcquisitionCost: ({
			"1": function(n){ return n*2.5; }, //version one cost is fixed
			"2": function(n){
				//in v2 first 500 cost 2.5, then each further 500 +
				var costPer = 2.5,
					totalCost = 0;
				while(n > 500){
					totalCost += 500 * costPer;
					costPer += 0.5;
					n -= 500;
				}
				totalCost += n * costPer;
				return totalCost;
			}})[VERSION],

		//Engineering, What to get your developers to do
		//effects are permanent (unlike marketing)
		//but each week you don't work on a task, you lose on that task
		Engineering: {
			"Product Iteration (virality)": {
				cost: 5000,
				target: "Virality",
				effect: bumpPercent(0.05, +Infinity), // 5% increase in Virality
				negativeEffect: ({
					"1": identity,
					"2": dropPercent(0.025)
				})[VERSION]
			},
			"Bug Fixing (retention)": {
				cost: 5000,
				target: "Retention",
				effect: bumpPercent(0.05, 1.0),
				negativeEffect: ({
					"1": identity,
					"2": dropPercent(0.025)
				})[VERSION]
			},
			"Funnel Optimisation (signup conversion)": {
				cost: 5000,
				target: "Conversion",
				effect: bumpPercent(0.05, 1.0),
				negativeEffect: ({
					"1": identity,
					"2": dropPercent(0.025)
				})[VERSION]
			}
		}
	};
};

//export the model
module.exports = model;