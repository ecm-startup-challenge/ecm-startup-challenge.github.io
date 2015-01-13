var React = require('react');

function percent(n){
	return (n*100).toFixed(2)+"%";
}

var ResultsTable = React.createClass({
	render: function(){
		if(this.props.output.Error){
			return <div className="alert alert-danger">
				<strong>Ooops</strong>{" "+this.props.output.Error.Msg}
			</div>;
		}

		var facts = ["Budget", "WAU", "Retention", "Conversion", "Virality"],
			data = this.props.output.States;

		return <table className="table table-compact table-striped">
			<thead>
				{[<th key="blank"/>].concat(this.props.output.States.map(function(_, i){
					return <th key={i}>{"Week #"+i}</th>;
				}))}
			</thead>
			<tbody>
				{facts.map(function(name, i){
					return <tr key={i}>
						{[<th key="title">{name}</th>].concat(data.map(function(state, idx){
							var value = state[name];
							if(i === 0){
								value = "£"+state[name].toFixed(2);
							}
							if(i > 1){
								value = percent(state[name])+" ("+percent(state["Modified"+name])+")";
							}
							return <td key={idx}>{value}</td>;
						}))}
					</tr>;
				})}
			</tbody>
		</table>;
	}
});

module.exports = ResultsTable;