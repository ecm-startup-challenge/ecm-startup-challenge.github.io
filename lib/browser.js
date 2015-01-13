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
	var appState = {
		input: getLocalDataOrDefault(),
		output: null,
		update: null
	};
	updateResults();

	var app = React.render(React.createElement(App, {data: appState}), appContainerDOMNode);

	appState.update = function(){
		updateResults();
		app.forceUpdate();
	};

	//run the simulation
	function updateResults(){
		if(window.LocalStorage){
			window.LocalStorage.set("challenge-data", JSON.stringufy(appState.input));
		}
		appState.output = simulator.Simulate(model, simulator.FixedDataSolution(appState.input));
	}

	//check localstorage
	function getLocalDataOrDefault(){
		var input;
		if(window.LocalStorage){
			var data = window.LocalStorage.get("challenge-data");
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
}