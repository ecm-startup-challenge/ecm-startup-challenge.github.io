"use strict";
/**
 *	Model Details for StartupChallenge
 */
var model = {

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
            effect: function(Virality){ return Virality + 0.1; } //10% Virality increase (Virality CAN exceed 100%)
        },
		"Celebrity Endorsement (retention)": {
			cost: 25000,
			target: "Retention",
			effect: function(Retention){ return Math.min(Retention + 0.1, 1.0); } // 10% Retention increase, (Retention cannot exceed 100%)
		},
		"PR (signup conversion)": {
			cost: 25000,
			target: "Conversion",
			effect: function(Conversion){ return Math.min(Conversion + 0.1, 1.0); } // 10% Conversion increase (Conversion cannot exceed 100%)
		}
	},

	//Acquistion, Get visitors by paying, e.g. Facebook Install Ads
	//this value is the cost of a single new visitor (not new user)
	AcquisitionCost: 2.5,

	//Engineering, What to get your developers to do
	//effects are permanent (unlike marketing)
	Engineering: {
		"Product Iteration (virality)": {
			cost: 5000,
			target: "Virality",
			effect: function(Virality){
				return Virality + 0.05; // 5% increase in Virality
			}
		},
		"Bug Fixing (retention)": {
			cost: 5000,
			target: "Retention",
			effect: function(Retention){
				return Math.min(
					//Retention + ( (1 - Retention) * 0.2 ), //20% drop in Churn
					Retention + 0.05,
					1.0
				);
			}
		},
		"Funnel Optimisation (signup conversion)": {
			cost: 5000,
			target: "Conversion",
			effect: function(Conversion){
				return Math.min(
					//Conversion + ( (1 - Conversion) * 0.2 ), //20% drop in Drop-Off
					Conversion + 0.05,
					1.0
				);
			}
		}
	}
};

//export the model
module.exports = model;