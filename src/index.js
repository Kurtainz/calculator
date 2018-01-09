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
    return(
        <div>
            <p className="currentSum">{props.currentSum}</p>
            <p>{props.currentVal}</p>
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
        currentSum : []
    }

    handleButtonPress = (event) => {
        const clickedVal = event.target.getAttribute('itemprop');
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
    }

    handleNumberPress = (clickedVal) => {
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

    clearScreen = () => this.setState(prevState => ({ currentVal: "0" }));

    addToSum = (clickedVal) => {
        let newSumArray = this.state.currentSum.slice();
        newSumArray.push(this.state.currentVal, clickedVal);
        this.setState(prevState => ({ currentSum : newSumArray}), () => console.log(this.state.currentSum));
        this.clearScreen();
    }

    completeSum = () => {
        // Turns the expression array into a string representation of the current sum
        const expression = this.state.currentSum.slice().join("") + this.state.currentVal;
        const sumResult = eval(expression);
        this.setState(prevState => ({
            currentVal : sumResult,
            currentSum : []
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