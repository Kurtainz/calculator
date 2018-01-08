import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";

const Calc = (props) => {

    const generateNumButtons = () => {
        const buttons = [];
        for (let i = 9; i >= 0; i--) {
            buttons.push(<Button key={i} val={i} className="numButton" />);
        }
        buttons.push(<Button key="." val="." className="numButton" />);
        return buttons;
    }

    const generateOperatorButtons = () => {
        const operators = [
            'C', '÷', 'x', '-', '+', '='  
        ];
        return operators.map(operator => <Button className="numButton" key={operator} val={operator} />);
    }

    const numButtons = generateNumButtons();
    const operatorButtons = generateOperatorButtons();
    const topRowButtons = operatorButtons.slice(0, 4);
    const sideRowButtons = operatorButtons.slice(4);

    return(
        <div className="main">
            <div className="screen">
                <Screen val={props.val} />
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
        <p>{props.val}</p>
    )
}

const Button = (props) => {
    return(
        <div className={props.className} itemProp={props.val}>
            <div className="innerButton">
                <span className="buttonSpan">{props.val}</span>
            </div>
        </div>
    )
}

class App extends React.Component {

    state = {
        val : 0
    }

    render() {
        return(
            <div>
                <Calc val={this.state.val} />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));