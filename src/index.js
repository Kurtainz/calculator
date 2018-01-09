import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

const Calc = (props) => {

    const generateNumButtons = () => {
        const buttons = [];
        for (let i = 9; i >= 0; i--) {
            buttons.push(<Button key={i} val={i} className="numButton" handleButtonPress={props.handleButtonPress} />);
        }
        buttons.push(<Button key="." val="." className="numButton" handleButtonPress={props.handleButtonPress} />);
        return buttons;
    }

    const generateOperatorButtons = () => {
        const operators = [
            'C', '÷', 'x', '-', '+', '='  
        ];
        return operators.map(operator => <Button className="numButton" key={operator} val={operator} handleButtonPress={props.handleButtonPress} />);
    }

    const numButtons = generateNumButtons();
    const operatorButtons = generateOperatorButtons();
    const topRowButtons = operatorButtons.slice(0, 4);
    const sideRowButtons = operatorButtons.slice(4);

    return(
        <div className="main">
            <div className="screen">
                <Screen currentVal={props.currentVal} currentSum={props.currentSum} />
            </div>
            <div className="topButtonContainer">
                {topRowButtons}
            </div>
            <div className="mainButtonContainer">
                <div className="sideButtonContainer">
                    {sideRowButtons}
                </div>
                <div className="buttonContainer">
                    {numButtons}
                </div>
            </div>
        </div>
    )
}

const Screen = (props) => {
    let currentSumStr = null;
    let sumInProgress = "sumNotInProgress";
    if (props.currentSum.length) {
        sumInProgress = "sumInProgress";
        currentSumStr = props.currentSum.join(' ');
    }
    return(
        <div>
            <p className="currentSum">{currentSumStr}</p>
            <p className={sumInProgress}>{props.currentVal}</p>
        </div>
    )
}

const Button = (props) => {
    return(
        <div className={props.className}>
            <div className="innerButton" itemProp={props.val} onClick={props.handleButtonPress}>
                <span itemProp={props.val} className="buttonSpan">{props.val}</span>
            </div>
        </div>
    )
}

class App extends React.Component {

    state = {
        currentVal : "0",
        currentSum : [],
        endState : false
    }

    handleButtonPress = (event) => {
        const clickedVal = event.target.getAttribute('itemprop');
        this.checkEndState().then(() => {
            switch (true) {
                case !isNaN(Number(clickedVal)) || clickedVal === ".":
                    this.handleNumberPress(clickedVal);
                    break;
                case clickedVal === "C":
                    this.clearScreen();
                    break;
                case clickedVal === "=":
                    this.completeSum();
                    break;
                default:
                    this.addToSum(clickedVal);
                    break;
            }
        });
    }

    // If in end state, we must clear everything when a new number is entered
    // to start again
    checkEndState = () => {
        return new Promise((resolve, reject) => {
            if (this.state.endState === true) {
                this.setState(prevState => ({
                    currentVal: "0",
                    currentSum: [],
                    endState: false
                }), () => resolve());
            }
            else {
                resolve();
            }
        });
        
    }

    // Puts number presses on the screen
    handleNumberPress = (clickedVal) => {
        console.log(this.state.currentVal);
        if (this.state.currentVal.length >= 18) {
            return;
        }
        let newVal = this.state.currentVal;
        if (newVal === "0") {
            newVal = clickedVal;
        }
        else {
            newVal += clickedVal;
        }
        this.setState(prevState => ({
            currentVal : newVal
        }));
    }

    // Called when "C" button is pressed or one of the operand keys, resets to 0. 
    // Will clear current transaction if currentVal is 0
    clearScreen = () => {
        if (this.state.currentVal === "0") {
            this.setState(prevState => ({
                currentVal : 0,
                currentSum : [],
                endState : false
            }));
        }
        else {
            this.setState(prevState => ({ currentVal: "0" }));
        }
    }

    // Adds each step of the current equation to an array on the state
    addToSum = (clickedVal) => {
        let newSumArray = this.state.currentSum.slice();
        if (clickedVal === "x") {
            clickedVal = "*";
        }
        else if (clickedVal === "÷") {
            clickedVal = "/";
        }
        newSumArray.push(this.state.currentVal, clickedVal);
        this.setState(prevState => ({ currentSum : newSumArray}));
        this.clearScreen();
    }

    // Called when "=" is pressed
    completeSum = () => {
        // Turns the expression array into a string representation of the current sum and add the last number
        const expression = this.state.currentSum.slice().join("") + this.state.currentVal;
        let sumResult;
        if (expression === "2+2-1") {
            sumResult = "Quick Maths!";
        }
        else {
            sumResult = eval(expression).toString();
        }
        if (sumResult.length > 18) {
            sumResult = "Error";
        }
        this.setState(prevState => ({
            currentVal : sumResult,
            endState : true
        }));
    }

    render() {
        return(
            <div>
                <Calc currentSum={this.state.currentSum} currentVal={this.state.currentVal} handleButtonPress={this.handleButtonPress} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));