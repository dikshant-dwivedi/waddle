import React, { Component } from 'react'
import './Timer.css'
import ReactCardFlip from 'react-card-flip';
import Switch from "react-switch";

import 'bootstrap/dist/css/bootstrap.min.css';

export class Timer extends Component {

    constructor()
    {
        super();

        this.state = {
            isFlipped: false,
            checked: false
        }

        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(checked) {
        this.setState(prevState => {
            return { 
            isFlipped: !prevState.isFlipped,
            checked: !prevState.checked
         }});
    }
    render() {
        return (
            
            <section className="pomodoro-clock-section">
                <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
                    <div className="timer-work-session">
                        <p>Pomodoro work session</p> 
                        <Switch onChange={this.handleChange} checked={this.state.checked}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            offColor="#32CD32" 
                            offHandleColor="#FF0000" /> 
                    </div>

                    <div className="timer-break-session">
                        <p>Pomodoro break session</p>
                        <Switch onChange={this.handleChange} checked={this.state.checked}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            onHandleColor="#fff" 
                            onColor="#FF0000"
                            onHandleColor="#32CD32"/>
                    </div>
                </ReactCardFlip>
            </section>
        )
    }
}

export default Timer


