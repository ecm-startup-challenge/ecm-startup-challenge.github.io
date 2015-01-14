var React = require("react"),
	xChart = requier("xchart");

var WAUChart = React.createClass({
	render: function(){
		if(this.props.output.Error){
			return null;
		}
		return <figure style={width: 900, height: 30} ref="WAUChart"></figure>;
	},
	updateChart: function(){

	},
	getChartData: function(){
		var data = {
			"xScale": "ordinal",
			"yScale": "linear",
			"type": "line",
			"main": [
				"data": []
			]
		},
		output = this.props.output.States;

		if(output){
			data = output.map(function(state, weekNum){
				return {x: " Week #"+weekNum, y: state.WAU};
			});
		}
		return data;
	},
	newChart: function(){
		return new xChart("line", this.getChartData(), this.refs.WAUChart.getDOMNode());
	},
	componentDidMount: function(){
		var chart = null;
		if(!this.output.Error){
			chart = newChart();
		}
		this.setState({chart: chart});
	},
	componentWillReceiveProps: function(){
		if(this.output.Error){
			this.setState({chart: null});
		}else{
			if(this.state.chart){
				this.state.chart.setData(this.getChartData());
			}else{
				this.setState({chart: newChart()});
			}
		}
	}
});

module.exports = WAUChart;