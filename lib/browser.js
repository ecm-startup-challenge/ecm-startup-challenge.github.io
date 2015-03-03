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

function init(appContainerDOMNode, version){
	var theModel = model({version: version}),
		localStorageKey = "challenge-data" + ((version > 1) ? (":v:"+version) : ""),
		appProps = {
			version: version,
			localStorageKey: localStorageKey,
			model: theModel,
			input: getLocalDataOrDefault(),
			output: null,
			update: function(){
				updateResults();
				React.render(React.createElement(App, appProps), appContainerDOMNode);
				if(window.ga){
					window.ga("send", "event", "stateChange", "click"); //arbitrary really, just to check interaction!
				}
			}
		};
	appProps.update();

	//run the simulation
	function updateResults(){
		if(window.localStorage){
			window.localStorage.setItem(localStorageKey, JSON.stringify(appProps.input));
		}
		appProps.output = simulator.Simulate(theModel, simulator.FixedDataSolution(appProps.input));
	}

	//check localstorage
	function getLocalDataOrDefault(){
		var input;
		if(window.localStorage){
			var data = window.localStorage.getItem(localStorageKey);
			try{
				input = JSON.parse(data);
			}catch(e){
				//nothing.
			}
		}
		if(!input){
			//generate default data.
			var i = theModel.Weeks;
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
	var version =1;
	try{
		version = window.location.href.match(/index\.v([0-9]+)\.html/)[1];
	}catch(e){}
	init(document.getElementById("app"), version);
};