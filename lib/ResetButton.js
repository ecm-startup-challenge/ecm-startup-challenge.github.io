var React = require('react');

var ResetButton = React.createClass({
	render: function(){
		return <button className="btn btn-default" onClick={this.resetLocalStorage}>Reset</button>;
	},
	resetLocalStorage: function(){
		if(window.localStorage){
			window.localStorage.removeItem(this.props.localStorageKey);
		}
		if(window.location) {
			window.location.reload();
		}
	}
});

module.exports = ResetButton;