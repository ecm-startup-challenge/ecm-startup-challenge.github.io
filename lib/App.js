var React = require('react'),
    InputForm = require('./InputForm'),
	ResetButton = require('./ResetButton'),
	WAUChart = require('./WAUChart'),
	ResultsTable = require('./ResultsTable');

var App = React.createClass({
	render: function(){
		return <div className="container-fluid">
			<h2>Input</h2>
            <ResetButton />
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