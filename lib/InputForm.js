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

var EngineeringForm = React.createClass({
    render: function(){
        var numOfDev = this.props.numOfDev,
            items = this.props.items,
            formElements = items.map(function(item, idx){
                var options = [];
                for(var i=0; i < numOfDev; i++){
                    options.push(<Radio defaultChecked={item=='none'} key={i} name={"Engineering."+i} value={item} title={item} onChange={this.handleChange} />);
                }
                return <div key={idx} className={"radio-group " + item}>{options}</div>;
            }, this);

        return <div className="engineering-form-section">
                {formElements}
                </div>;
    },
    handleChange: function(e){
        var data = {
            key: e.target.getAttribute('name'),
            val: e.target.value
        }
        this.props.onChange(data);
    }
});

var MarketingForm = React.createClass({
    render: function(){

        var items = this.props.items,
            formElements = items.map(function(item, i){
                return <div key={i} className={"checkbox-group " + item}>
                            <Checkbox name={item} value={item} title={item} onChange={this.handleChange}/>
                        </div>
            }, this);


        return <div className="marketing-form-section">
                {formElements}
               </div>
    },
    handleChange: function(e){
        var data = {
            key: e.target.value,
            val: e.target.checked
        }
        this.props.onChange(data);
    }
});

var BudgetForm = React.createClass({
    render: function(){
        var defaultVal = this.props.defaultVal || 0;
        return <div className="budget-form-section">
                    <Input className="budget-input" name="Spend" defaultValue={defaultVal} onChange={this.handleChange} />
                </div>
    },
    handleChange: function(e){
        var val = parseFloat(e.target.value);
        var data = {
            key: e.target.name,
            val: !isNaN(val) ? val : 0
        }
        this.props.onChange(data);
    }
})

var InputForm = React.createClass({
    render: function(){

        var model = this.props.model;

        var engineeringProps = {
            items: ['none'].concat(Object.keys(model.Engineering)),
            numOfDev: model.DeveloperResource
        };

        var engineeringForm = <EngineeringForm {...engineeringProps} onChange={this.onChange} />;

        var marketingProps = {
            items: Object.keys(model.Marketing)
        }
        var marketingForm = <MarketingForm {...marketingProps} onChange={this.onChange} />;

        return <div className="form-container week">
                <form onSubmit={this.preventEvent}>
                <span className="input">#{this.props.week +1}</span>
                    { engineeringForm }
                    { marketingForm }
                    <BudgetForm defaultVal={0} onChange={this.onChange}/>
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

var InputFormGroup = React.createClass({
    render: function(){
        var model = this.props.model,
            numWeeks = 10,
            labelText = ['Week:', 'none'].concat(Object.keys(model.Engineering))
                                .concat(Object.keys(model.Marketing))
                                .concat('Spend'),
            labels = labelText.map(function(label, i){
                return <label key={i}>{label}</label>
            }),
            forms = [];



        for(var i = 0; i < numWeeks; i ++){
            forms.push(<InputForm key={i} model={model} week={i} onChange={this.handleChange} />)
        }


        return <div className="input-form-group">
                <div className="label-container">
                {labels}
                </div>
                {forms}
               </div>
    },
    handleChange: function(data){
        console.log(data);
    }
})

module.exports = InputFormGroup;