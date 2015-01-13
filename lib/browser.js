"use strict";
/* jshint browser:true */
/**
 *	This is the browser entry point for this app.
 */
var React = require("react");

//Here we start everything!
var simulator = require("./simulator"),
	model = require("./model"),
	App = require("./App");

function init(appContainerDOMNode){
	var appProps = {
			model: model,
			input: getLocalDataOrDefault(),
			output: null,
			update: function(){
				updateResults();
				React.render(React.createElement(App, appProps), appContainerDOMNode);
			}
		};
	appProps.update();

	//run the simulation
	function updateResults(){
		if(window.localStorage){
			window.localStorage.setItem("challenge-data", JSON.stringify(appProps.input));
		}
		appProps.output = simulator.Simulate(model, simulator.FixedDataSolution(appProps.input));
	}

	//check localstorage
	function getLocalDataOrDefault(){
		var input;
		if(window.localStorage){
			var data = window.localStorage.getItem("challenge-data");
			try{
				input = JSON.parse(data);
			}catch(e){
				//nothing.
			}
		}
		if(!input){
			//generate default data.
			var i = model.Weeks;
			input = [];
			while(i--){
				input.push({
					Engineering: [],
					Marketing: [],
					Acquisitions: 0
				});
			}
		}
		return input;
	}
}


//bootstrap the App
window.onload = function(){
	init(document.getElementById("app"));
};