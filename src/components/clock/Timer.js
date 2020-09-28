import React, { Component } from 'react'
import './Timer.css'
import ReactCardFlip from 'react-card-flip';
import Switch from "react-switch";
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import PageVisibility from 'react-page-visibility';
import TimerInterrupted from '../TimerInterrupted'

export class Timer extends Component {

    constructor()
    {
        super();

        this.state = {
            isFlipped: false,
            isWorkSession: true,
            breakMinute: 5,
            workMinute: 25,
            timerSecond: 0,
            timerId: 0,
            intervalId: 0,
            isPlaying: false,
            resetDisabled: false,
            isVisible: true,
            show: false
        }

        this.handleSessionChange = this.handleSessionChange.bind(this)
        this.onChangeSliderInput = this.onChangeSliderInput.bind(this)
        this.play = this.play.bind(this)
        this.stop = this.stop.bind(this)
        this.reset = this.reset.bind(this)
        this.updateTimer = this.updateTimer.bind(this)
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
        this.clearModal = this.clearModal.bind(this)
    }

    handleSessionChange() {
        this.setState(prevState => {
            return { 
            isFlipped: !prevState.isFlipped,
            isWorkSession: !prevState.isWorkSession
         }});
    }

    onChangeSliderInput(event){
        if(this.state.isWorkSession){
            this.setState({
                workMinute: event.target.value,
                timerSecond: 0
            })
        }
        else{
            this.setState({
                breakMinute: event.target.value,
                timerSecond: 0
            })
        }
    }

    play()
    {
        this.setState({
            isPlaying: true,
            resetDisabled: true
        })
        let interval = setInterval(() => this.updateTimer(), 1000);
        this.setState({
            intervalId: interval
        })
    }


    updateTimer()
    {
        if(this.state.isWorkSession)
        {
        if(this.state.timerSecond === 0 && this.state.workMinute === 0)
        {
            this.stop()
            this.handleSessionChange()
            this.play()
        }
        else if(this.state.timerSecond === 0)
        {
            this.setState((prevState) => {
                return {
                    timerSecond: 59,
                    workMinute: prevState.workMinute - 1
                }
            })
        }
        else{
            this.setState((prevState) => ({
                timerSecond: prevState.timerSecond - 1
            }))
        }
        }
        else
        {
            if (this.state.timerSecond === 0 && this.state.breakMinute === 0) {
                this.stop()
                this.handleSessionChange()
                this.play()
            }
            else if (this.state.timerSecond === 0) {
                this.setState((prevState) => {
                    return {
                        timerSecond: 59,
                        breakMinute: prevState.breakMinute - 1
                    }
                })
            }
            else {
                this.setState((prevState) => ({
                    timerSecond: prevState.timerSecond - 1
                }))
            }
        }
    }

    stop()
    {
        this.setState((prevState) => ({
            isPlaying: false,
            resetDisabled: false
        }))
        clearInterval(this.state.intervalId)  
    }

    reset()
    {
        if(this.state.isWorkSession){
            this.setState({
                workMinute: 25,
                timerSecond: 0,
                resetDisabled: true
            })
        }
        else{
            this.setState({
                breakMinute: 5,
                timerSecond: 0,
                resetDisabled: true
            }) 
        }
    }

    handleVisibilityChange(isVisible, isHidden)
    {
        this.setState({
            isVisible: isVisible
        })
        if(isVisible === false)
        {
            if(this.state.isWorkSession && this.state.isPlaying)
            {
                const timerId= setTimeout(() => {
                    this.stop()
                    this.reset()
                    this.setState({
                        show: true
                    })
                }, 3000);
                this.setState({
                    timerId: timerId
                })
                return () => clearTimeout(timerId)
            }
        }
        if(isVisible === true && this.state.timerId !== 0)
        {
            clearTimeout(this.state.timerId)
        }
    }

    clearModal()
    {
        this.setState({
            show: false
        })
    }
    render() {
        return (
            <section className="pomodoro-clock-section">
                <TimerInterrupted clearModal = {this.clearModal} show = {this.state.show}/>
                <PageVisibility onChange = {this.handleVisibilityChange}>  
                <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
                    <WorkSession
                        isWorkSession = {this.state.isWorkSession}
                        timerSecond = {this.state.timerSecond}
                        workMinute = {this.state.workMinute}
                        onChangeSliderInput = {this.onChangeSliderInput}
                        handleSessionChange = {this.handleSessionChange}
                        isPlaying = {this.state.isPlaying}
                        resetDisabled = {this.state.resetDisabled}
                        play = {this.play}
                        stop = {this.stop}
                        reset = {this.reset}
                        isFlipped = {this.state.isFlipped}
                    />

                    <BreakSession
                        isWorkSession={this.state.isWorkSession}
                        timerSecond={this.state.timerSecond}
                        breakMinute={this.state.breakMinute}
                        onChangeSliderInput={this.onChangeSliderInput}
                        handleSessionChange={this.handleSessionChange}
                        isPlaying={this.state.isPlaying}
                        resetDisabled={this.state.resetDisabled}
                        play={this.play}
                        stop={this.stop}
                        reset={this.reset}
                        isFlipped={this.state.isFlipped}
                    />
                </ReactCardFlip>
                </PageVisibility>
            </section>
        )
    }
}

export default Timer

function WorkSession(props)
{

    function handleSessionChange()
    {
        props.handleSessionChange();
    }

    function onChangeSliderInput(event)
    {
        props.onChangeSliderInput(event);
    }

    function play() {
        props.play()
    }

    function stop() {
        props.stop()
    }

    function reset() {
        props.reset()  
    }

    return(
        <div className="timer-work-session">
            <IconButton size = "medium"
             style={{ color: "#000000", outline: 'none',float: 'left',marginTop : "-10px", marginLeft: "-2px"}}>
                 <SettingsIcon />
            </IconButton>
            <header className="headings-container">
            <h3 className = "headings">Work</h3>
            <Switch onChange={handleSessionChange}
                checked={!props.isWorkSession}
                checkedIcon={false}
                uncheckedIcon={false}
                className="switch"
                onColor="#000"
                offColor="#000"
                disabled={props.isPlaying}
                handleDiameter={18}
                height={24}/>
            <h3 className="headings">Break</h3>
            </header>
            <p className="timer">{props.workMinute + ":" + (props.timerSecond === 0 ?
                                  "00" :
                                  props.timerSecond < 10 ?
                                  "0" + props.timerSecond :
                                  props.timerSecond)}
            </p>
            <input type="range"
                min="1"
                max="60"
                value={props.workMinute}
                className="slider"
                disabled={props.isPlaying}
                onChange={onChangeSliderInput} />
            <button className="controlButtons"
                    disabled={props.isPlaying}
                    onClick={play}>Start</button>
            <button className="controlButtons"
                    style={{ marginRight: '4px', marginLeft: "4px" }}
                    disabled={!props.isPlaying}
                    onClick={stop}>Stop</button>
            <button className="controlButtons"
                    disabled={props.resetDisabled}
                    onClick={reset}>Reset</button>
        </div>
    )
}

function BreakSession(props) {


    function handleSessionChange() {
        props.handleSessionChange();
    }

    function onChangeSliderInput(event) {
        props.onChangeSliderInput(event);
    }

    function play() {
        props.play()
    }

    function stop() {
        props.stop()
    }

    function reset() {
        props.reset()
    }

    return (
        <div className="timer-break-session">
            <IconButton size="medium"
                style={{ color: "#000000", outline: 'none', float: 'left', marginTop: "-10px", marginLeft: "-2px" }}>
                <SettingsIcon />
            </IconButton>
            <header className="headings-container">
            <h3 className= "headings">Work</h3>
            <Switch onChange={handleSessionChange}
                checked={!props.isWorkSession}
                checkedIcon={false}
                uncheckedIcon={false}
                className="switch"
                disabled={props.isPlaying}
                offColor="#000"
                onColor="#000"
                handleDiameter={18}
                height={24}/>
            <h3 className = "headings">Break</h3>
            </header>
            <p className="timer">{props.breakMinute + ":" + (props.timerSecond === 0 ?
                "00" :
                props.timerSecond < 10 ?
                    "0" + props.timerSecond :
                    props.timerSecond)}</p>
            <input type="range"
                min="1"
                max="60"
                value={props.breakMinute}
                className="slider"
                disabled={props.isPlaying}
                onChange={onChangeSliderInput} />
            <button className="controlButtons"
                disabled={props.isPlaying}
                onClick={play}>Start</button>
            <button className="controlButtons" 
                style = {{marginRight: '4px', marginLeft: "4px"}}
                disabled={!props.isPlaying}
                onClick={stop}>Stop</button>
            <button className="controlButtons"
                disabled={props.resetDisabled}
                onClick={reset}>Reset</button>
        </div>
    )
}


