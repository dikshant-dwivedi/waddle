import React, { Component } from 'react'
import './Timer.css'
import ReactCardFlip from 'react-card-flip';
import Switch from "react-switch";
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import PageVisibility from 'react-page-visibility';
import TimerInterrupted from '../TimerInterrupted';
import Button from 'react-bootstrap/Button';

export class Timer extends Component {

    constructor() {
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
        this.handleVisibilityChangeSocket = this.handleVisibilityChangeSocket.bind(this)
        this.clearModal = this.clearModal.bind(this)
        this.playSocket = this.playSocket.bind(this)
        this.stopSocket = this.stopSocket.bind(this)
        this.resetSocket = this.resetSocket.bind(this)
    }

    handleSessionChange() {
        this.setState(prevState => {
            return {
                isFlipped: !prevState.isFlipped,
                isWorkSession: !prevState.isWorkSession
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.roomCode && this.props.socket) {
            if (this.props.play === true && !this.state.isPlaying && this.props.play !== prevProps.play) {
                console.log('componentdidupdate: play')
                this.play()
            }
            if (this.props.stop === true && this.state.isPlaying && this.props.stop !== prevProps.stop && this.props.reset === false) {
                console.log('componentdidupdate: stop')
                this.stop()
            }
            if (this.props.reset === true && !this.state.isPlaying && this.props.reset !== prevProps.reset)//this.props.roomCode)
            {
                console.log('componentdidupdate: reset')
                this.reset()
            }
            console.log(this.props.isVisibleSocket)
            if (this.props.isVisibleSocket !== prevProps.isVisibleSocket) {
                console.log('componentdidupdate: visibility')
                this.handleVisibilityChange(this.props.isVisibleSocket)
            }
        }
    }

    onChangeSliderInput(event) {
        if (this.state.isWorkSession) {
            this.setState({
                workMinute: event.target.value,
                timerSecond: 0
            })
        }
        else {
            this.setState({
                breakMinute: event.target.value,
                timerSecond: 0
            })
        }
    }

    play() {
        this.setState({
            isPlaying: true,
            resetDisabled: true
        })
        let interval = setInterval(() => this.updateTimer(), 1000);
        this.setState({
            intervalId: interval
        })
    }

    playSocket() {
        console.log("roomCode: ", this.props.roomCode)
        if (this.props.roomCode && this.props.socket) {
            this.props.socket.emit('play', () => { console.log("I am sending a play callback"); })
        }
        else {
            this.play()
        }
    }

    updateTimer() {
        if (this.state.isWorkSession) {
            if (this.state.timerSecond === 0 && this.state.workMinute === 0) {
                this.stop()
                this.handleSessionChange()
                this.play()
            }
            else if (this.state.timerSecond === 0) {
                this.setState((prevState) => {
                    return {
                        timerSecond: 59,
                        workMinute: prevState.workMinute - 1
                    }
                })
            }
            else {
                this.setState((prevState) => ({
                    timerSecond: prevState.timerSecond - 1
                }))
            }
        }
        else {
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

    stop() {
        this.setState((prevState) => ({
            isPlaying: false,
            resetDisabled: false
        }))
        clearInterval(this.state.intervalId)
    }

    stopSocket() {
        if (this.props.roomCode && this.props.socket) {
            this.props.socket.emit('stop', () => { console.log("I am sending a stop callback"); })
        }
        else {
            this.stop()
        }
    }

    reset() {
        if (this.state.isWorkSession) {
            this.setState({
                workMinute: 25,
                timerSecond: 0,
                resetDisabled: true
            })
        }
        else {
            this.setState({
                breakMinute: 5,
                timerSecond: 0,
                resetDisabled: true
            })
        }
    }

    resetSocket() {
        if (this.props.roomCode && this.props.socket) {
            this.props.socket.emit('reset', () => { console.log("I am sending a reset callback"); })
        }
        else {
            this.reset()
        }
    }

    handleVisibilityChange(isVisible) {
        this.setState({
            isVisible: isVisible
        })
        if (isVisible === false) {
            if (this.state.isWorkSession && this.state.isPlaying) {
                const timerId = setTimeout(() => {
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
        if (isVisible === true && this.state.timerId !== 0) {
            clearTimeout(this.state.timerId)
        }
    }

    clearModal() {
        this.setState({
            show: false
        })
    }

    handleVisibilityChangeSocket(isVisible, isHidden) {
        if (this.props.roomCode && this.props.socket) {
            this.props.socket.emit('handleVisibilityChange', isVisible, () => { console.log("I am sending a handleVisibility change callback"); })
        }
        else {
            this.handleVisibilityChange(isVisible)
        }
    }

    render() {
        return (
            <section className="pomodoro-clock-section">
                <TimerInterrupted clearModal={this.clearModal} show={this.state.show} />
                <PageVisibility onChange={this.handleVisibilityChangeSocket}>
                    <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="vertical">
                        <WorkSession
                            isWorkSession={this.state.isWorkSession}
                            timerSecond={this.state.timerSecond}
                            workMinute={this.state.workMinute}
                            onChangeSliderInput={this.onChangeSliderInput}
                            handleSessionChange={this.handleSessionChange}
                            isPlaying={this.state.isPlaying}
                            resetDisabled={this.state.resetDisabled}
                            play={this.playSocket}
                            stop={this.stopSocket}
                            reset={this.resetSocket}
                            isFlipped={this.state.isFlipped}
                        />

                        <BreakSession
                            isWorkSession={this.state.isWorkSession}
                            timerSecond={this.state.timerSecond}
                            breakMinute={this.state.breakMinute}
                            onChangeSliderInput={this.onChangeSliderInput}
                            handleSessionChange={this.handleSessionChange}
                            isPlaying={this.state.isPlaying}
                            resetDisabled={this.state.resetDisabled}
                            play={this.playSocket}
                            stop={this.stopSocket}
                            reset={this.resetSocket}
                            isFlipped={this.state.isFlipped}
                        />
                    </ReactCardFlip>
                </PageVisibility>
            </section>
        )
    }
}

export default Timer

function WorkSession(props) {

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
        <div className="timer-work-session">
            <IconButton size="medium"
                style={{ color: "#000000", outline: 'none', float: 'left', marginTop: "-10px", marginLeft: "-2px" }}>
                <SettingsIcon />
            </IconButton>
            <header className="headings-container">
                <h3 className="headings">Work</h3>
                <Switch onChange={handleSessionChange}
                    checked={!props.isWorkSession}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    className="switch"
                    onColor="#000"
                    offColor="#000"
                    disabled={props.isPlaying}
                    handleDiameter={18}
                    height={24} />
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
            <Button variant="dark"
                className='btn btn-outline-dark shadow-none'
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    padding: "0.7rem 2rem",
                    background: "black",
                    fontFamily: "sans-serif"
                }}
                disabled={props.isPlaying}
                onClick={play}>Start</Button>
            <Button variant="dark"
                className='btn btn-outline-dark shadow-none'
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    padding: "0.7rem 2rem",
                    background: "black",
                    fontFamily: "sans-serif",
                    marginRight: '4px',
                    marginLeft: "4px"
                }}
                disabled={!props.isPlaying}
                onClick={stop}>Stop</Button>
            <Button variant="dark"
                className='btn btn-outline-dark shadow-none'
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    padding: "0.7rem 2rem",
                    background: "black",
                    fontFamily: "sans-serif",
                }}
                disabled={props.resetDisabled}
                onClick={reset}>Reset</Button>
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
                <h3 className="headings">Work</h3>
                <Switch onChange={handleSessionChange}
                    checked={!props.isWorkSession}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    className="switch"
                    disabled={props.isPlaying}
                    offColor="#000"
                    onColor="#000"
                    handleDiameter={18}
                    height={24} />
                <h3 className="headings">Break</h3>
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
            <Button variant="dark"
                className='btn btn-outline-dark shadow-none'
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    padding: "0.7rem 2rem",
                    background: "black",
                    fontFamily: "sans-serif",
                }}
                disabled={props.isPlaying}
                onClick={play}>Start</Button>
            <Button variant="dark"
                className='btn btn-outline-dark shadow-none'
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    padding: "0.7rem 2rem",
                    background: "black",
                    fontFamily: "sans-serif",
                    marginRight: '4px',
                    marginLeft: "4px"
                }}
                disabled={!props.isPlaying}
                onClick={stop}>Stop</Button>
            <Button variant="dark"
                className='btn btn-outline-dark shadow-none'
                style={{
                    color: "white",
                    fontSize: "1.1rem",
                    padding: "0.7rem 2rem",
                    background: "black",
                    fontFamily: "sans-serif",
                }}
                disabled={props.resetDisabled}
                onClick={reset}>Reset</Button>
        </div>
    )
}


