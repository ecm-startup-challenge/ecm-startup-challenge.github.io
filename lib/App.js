var React = require('react'),
	InputForm = require('./InputForm'),
	ResetButton = require('./ResetButton'),
	WAUChart = require('./WAUChart'),
	ResultsTable = require('./ResultsTable');

var App = React.createClass({
	render: function(){
		return <div className="container-fluid">
			<div className="page-header">
				<h1>Maximise for Weekly Active Users (WAU) <small>{"version "+this.props.version}</small></h1>
			</div>
			<h2>Input</h2>
			<ResetButton localStorageKey={this.props.localStorageKey} />
			<InputForm
				model={this.props.model}
				input={this.props.input}
				update={this.props.update} />
			<h2>Output</h2>
			<WAUChart
				output={this.props.output} />
			<ResultsTable
				output={this.props.output} />
		</div>;
	}
});

module.exports = App;