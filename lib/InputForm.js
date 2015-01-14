"use strict";
var React = require("react"),
	help = require("./helpers");

var NOT_ALLOCATED = "<not allocated>";

var Checkbox = React.createClass({render: function(){
	return <input type="checkbox" {...this.props} />;
}});

var Radio = React.createClass({render: function(){
	return <input type="radio" {...this.props} />;
}});

var Input = React.createClass({render: function(){
	return <input type="text" {...this.props} />;
}});

var EngineeringForm = React.createClass({
	render: function(){
		var numOfDev = this.props.numOfDev,
			items = this.props.items,
			data = this.props.data,
			week = this.props.week;

		return <div className="engineering-form-section">
			{items.map(function(item, idx){
				var options = [];
				//this is selected if there is a value at data[i] and it matches item
				//or there is no value at data[i] and item is "none"
				for(var i=0; i < numOfDev; i++){
					var selected = (data[i] ? data[i] === item : item === NOT_ALLOCATED);
					options.push(<Radio name={["week", week, "dev", i].join("-")} defaultChecked={selected} key={i} value={item} title={item} onChange={this.handleChange.bind(null, i, item === NOT_ALLOCATED ? undefined : item)} />);
				}
				return <div key={idx} className={"radio-group " + item}>{options}</div>;
			}, this)}
		</div>;
	},
	handleChange: function(idx, value){
		var data = {
			key: "Engineering",
			idx: idx,
			value: value
		};
		this.props.onChange(data);
	}
});

var MarketingForm = React.createClass({
	render: function(){

		var items = this.props.items,
			data = this.props.data;

		return <div className="marketing-form-section">
			{items.map(function(item, i){
				var checked = !!~data.indexOf(item);
				return <div key={i} className={"checkbox-group " + item}>
							<Checkbox name={item} value={item} defaultChecked={checked} title={item} onChange={this.handleChange.bind(null, item)}/>
						</div>;
			}, this)}
		</div>;
	},
	handleChange: function(name, e){
		var data = {
			key: "Marketing",
			selected: e.target.checked,
			value: name
		};
		this.props.onChange(data);
	}
});

var BudgetForm = React.createClass({
	render: function(){
		var defaultVal = this.props.defaultVal || 0;
		return <div className="budget-form-section">
			<Input className="budget-input" name="Acquisitions" defaultValue={defaultVal} onChange={this.handleChange} />
		</div>;
	},
	handleChange: function(e){
		var val = parseInt(e.target.value, 10);
		var data = {
			key: "Acquisitions",
			value: help.IsNaturalNumber(val) ? val : 0
		};
		this.props.onChange(data);
	}
});

var InputForm = React.createClass({
	render: function(){

		var model = this.props.model,
			data = this.props.data,
			engineeringProps = {
			items: ["<not allocated>"].concat(Object.keys(model.Engineering)),
				data: data.Engineering,
				week: this.props.week,
				numOfDev: model.DeveloperResource
			},
			marketingProps = {
				items: Object.keys(model.Marketing),
				data: data.Marketing
			};

		return <div className="form-container week">
			<form onSubmit={this.preventEvent}>
			<span className="input">#{this.props.week +1}</span>
				<EngineeringForm {...engineeringProps} onChange={this.onChange} />
                <BudgetForm defaultVal={data.Acquisitions} onChange={this.onChange}/>
				<MarketingForm {...marketingProps} onChange={this.onChange} />
			</form>
		</div>;
	},
	preventEvent: function(e){
		e.preventDefault();
	},
	onChange: function(data){
		data.week = this.props.week;
		this.props.onChange(data);
	}
});

function label(isSectionHeader, baseKey, text, key){
	var content = (isSectionHeader ? <h4>{text}</h4> : text);
	return <label key={baseKey+key}>{content}</label>;
}

var InputFormGroup = React.createClass({
	render: function(){
		var model = this.props.model,
			numWeeks = model.Weeks,
			forms = [],
			labels = [
				label(false, "week", "Week", 0),
				label(true, "section", "Engineering", 0),
				label(false, "eng", NOT_ALLOCATED, "none")
			]
			.concat(Object.keys(model.Engineering).map(label.bind(null, false, "eng")))
			.concat([label(true, "section", "Marketing", 1)])
            .concat([label(false, "mkt", "Install Ads", "acq")])
			.concat(Object.keys(model.Marketing).map(label.bind(null, false, "mkt")));

		for(var i = 0; i < numWeeks; i ++){
			forms.push(<InputForm key={i} model={model} week={i} data={this.props.input[i]} onChange={this.handleChange} />);
		}

		return <div className="input-form-group">
			<div className="label-container">
				{labels}
			</div>
			{forms}
		</div>;
	},
	handleChange: function(change){
		var data = this.props.input[change.week],
			update = false;
		switch(change.key){
			case "Acquisitions":
				if(change.value !== data.Acquisitions){
					data.Acquisitions = change.value;
					update = true;
				}
				break;
			case "Marketing":
				var valueIndex = data.Marketing.indexOf(change.value);
				if(change.selected && valueIndex == -1){
					data.Marketing.push(change.value);
					update = true;
				}
				if(!change.selected && valueIndex !== -1){
					data.Marketing.splice(valueIndex, 1);
					update = true;
				}
				break;
			case "Engineering":
				if(
					(change.value === undefined && data.Engineering[change.idx]) ||
					(change.value !== undefined && data.Engineering[change.idx] !== change.value)
				){
					data.Engineering[change.idx] = change.value;
					update = true;
				}
				break;
		}
		if(update){
			console.log(change);
			this.props.update();
		}
	}
});

module.exports = InputFormGroup;