var React = require('react'),
    InputForm = require('./InputForm'),
    WAUChart = require('./WAUChart'),
    ResultsTable = require('./ResultsTable');

var App = React.createClass({
    render: function(){

        console.log(this.props);

        return <div>
            <InputForm model={this.props.data.model} num={10} onChange={this.handleChange} />
            <WAUChart />
            <ResultsTable />
            </div>;
    },
    handleChange: function(data){

    }
});

module.exports = App;