var React = require('react');

var Checkbox = React.createClass({
    render: function(){
        return <input type="checkbox" {...this.props} />;
    }
});

var Radio = React.createClass({
    render: function(){
        return <input type="radio" {...this.props} />;
    }
});

var Input = React.createClass({
    render: function(){
        return <input type="text" {...this.props} />;
    }
});

var InputForm = React.createClass({
    render: function(){
        return <div className="form">
                    <Input onChange={this.onChange} />
                    <Radio onChange={this.onChange} />
                    <Checkbox onChange={this.onChange} />
               </div>;
    },
    onChange: function(e){
        console.log(e);
    }
});

module.exports = InputForm;