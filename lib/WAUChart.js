"use strict";
var React = require("react"),
	chartjs = require("chart.js");

var WAUChart = React.createClass({
	render: function(){
		if(this.props.output.Error){
			return null;
		}
		return <canvas style={{width: 900, display: "block", margin: "0 auto"}} width="900" height="300" ref="WAUChart"></canvas>;
	},
	updateChart: function(){

	},
	getChartData: function(props){
		var data = {
			labels: [],
			datasets: [{
				label: "WAU",
				data: []
			}]
		},
		output = props.output.States;
		if(output){
			data.labels = output.map(function(_, weekNum){
				return "Week #"+weekNum;
			})
			data.datasets[0].data = output.map(function(state){
				return state.WAU;
			});
		}
		return data;
	},
	newChart: function(props){
		return new chartjs(this.refs.WAUChart.getDOMNode().getContext("2d")).Line(this.getChartData(props));
	},
	componentDidMount: function(){
		var chart = null;
		if(!this.props.output.Error){
			chart = this.newChart(this.props);
		}
		this.setState({chart: chart});
	},
	componentWillReceiveProps: function(newProps){
		if(this.props.output.Error){
			this.setState({chart: null});
		}else{
			if(this.state.chart){
				var dataset = this.state.chart.datasets[0].points;
				this.getChartData(newProps).datasets[0].data.forEach(function(value, idx){
					dataset[idx].value = value;
				})
				this.state.chart.update();
			}else{
				this.setState({chart: this.newChart(newProps)});
			}
		}
	}
});

module.exports = WAUChart;