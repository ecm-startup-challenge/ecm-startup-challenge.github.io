var React = require('react'),
    InputForm = require('./InputForm'),
    WAUChart = require('./WAUChart'),
    ResultsTable = require('./ResultsTable');

var App = React.createClass({
    render: function(){
        return <div>
            <InputForm />
            <WAUChart />
            <ResultsTable />
            </div>;
    }
});

module.exports = App;