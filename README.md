See: https://docs.google.com/document/d/1cBTlj0yiR3WAqNI44jlwzPdJdIUxybI572ez6Nqke6c/edit?usp=sharing

## This codebase

For those interesting in creating a programmatic solution, this is an example of programtic
access to the simultor, assuming it's written in the root of this directory.

```javascript
var simulator = require("./index"), //this is the main simulator
    fixedSolution = require("./lib/simulator").FixedDataSolution; //this is for fixed data arrays of spends.

var mySolution = function(gameModel){
  /*
   * You have the gameModel, introspect to find out what the
   * rules are. (NB this is a deep *copy* of the model, you
   * cannot ammend the rules here!)
   */
  //do something with gameModel

  /**
   * Now return the step function which tells the simulator
   * what you want to spend on each step
   */
  return function(lastWeeksState){
    /**
     * lastWeeksState is just that, the state of the system as it is.
     * You need to determine what to spend on here.
     */
    var spend = {};

    //do something complicated

    return spend;
  }
};

//Now you have your solution you can run it with:
var result = simulator(solution);

// result has result.Error (null if all good), result.States -> array of states, introspect the last one for final result!

/**
 * for a fixed solution, you can convert it into a solution function with `fixedSolution`
 */
var spends = [{},{}]; // fill in the gaps...

var fixedResult = simulator(fixedSolution(spends));
```

# Have fun!
