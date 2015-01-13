var React = require('react'),
    InputForm = require('./InputForm'),
    WAUChart = require('./WAUChart'),
    ResultsTable = require('./ResultsTable');

var App = React.createClass({
    render: function(){
        return <div>
            <InputForm
                model={this.props.model}
                input={this.props.input}
                update={this.props.update} />
            <WAUChart
                output={this.props.output} />
            <ResultsTable
                output={this.props.output} />
        </div>;
    }
});

module.exports = App;