import React, {useEffect, useState} from 'react'
import './Chatbox.css'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Messages from './../messages/Messages.js';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Button from 'react-bootstrap/Button';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Settings from './Settings/Settings.js';

const Chatbox = (props) => {


    const [userName,setUserName] = useState('')
    const [showSettings, setShowSettings] = useState(false)
    useEffect(() => {
        if(props.userData.user)
        {
            setUserName(props.userData.user.firstName)
        }
        else
        {
            console.log("set to khali ")
        }
        //setUserName(props.userData.user.firstName)
    }, [props.userData])

    function onEmojiSelect(emoji)
    {
        let new_message = props.message + emoji.native
        props.setMessage(new_message)
    }
    const [showEmoji, setShowEmoji] = useState(false)

    function handleClick(e){
        e.preventDefault()
        let showEmojiStatus = showEmoji
        setShowEmoji(!showEmojiStatus)
    }
    function closePicker(e) {
        e.preventDefault()
        setShowEmoji(false)
    }
    return (
        <div className = "chat-box">
            <IconButton size="medium"
                onClick = {(e) => setShowSettings(true)}
                style={{ color: "#000000", outline: 'none', float: 'right', top: "-14px", left: "14px", marginBottom: "-20px" }}>
                <SettingsIcon />
            </IconButton>
            <Settings setShowSettings = {setShowSettings}
            showSettings = {showSettings}
            users = {props.users}
            userName = {userName}
            socket = {props.socket}
            notice = {props.notice}
            setNotice = {props.setNotice}/>
            <Messages messages = {props.messages} userName = {userName}/>
            <form id = "message-form">
                {/*} <button id="message-send" onClick={handleClick}></button>*/}
                    <Button variant="dark"
                        className='btn btn-outline-dark shadow-none'
                        style={{
                            color: "white",
                            fontSize: "1rem",
                            padding: "5px",
                            background: "black",
                            fontFamily: "sans-serif",
                        }} onClick = {handleClick}>
                <EmojiEmotionsIcon style={{ fontSize: "20", color: "white", marginBottom: "1.5px" }} />
                </Button>
                {/*<IconButton onClick={handleClick} size="small">
                <AttachFileIcon style={{ fontSize: "20", color: "white", marginBottom: "1.5px", marginLeft: "2px" }}/>
    </IconButton>*/}
            <input id = "message-input"
                     autoComplete = "off"
                    value  = {props.message}
                    autoFocus = {true}
                    placeholder = "Type your message here"
                    onChange = {(event) => props.setMessage(event.target.value)}
                    onKeyPress = {(event) => event.key === 'Enter' ? props.sendMessage(event): null}
                    onFocus = {closePicker}/>
            <span>
                    <Picker onSelect={onEmojiSelect} showPreview = {false} showSkinTones = {false} theme="dark" style={{ 
                    position: 'absolute', 
                    bottom: '35px', 
                    width: "300px", 
                    left: "0px",
                    background: "#000",
                    visibility: showEmoji ? "visible" : "hidden" }} />  
            </span> 
                <Button variant="dark"
                    className='btn btn-outline-dark shadow-none'
                    style={{
                        color: "white",
                        fontSize: "1rem",
                        padding: "5px",
                        background: "black",
                        fontFamily: "sans-serif",
                    }}
                     disabled={props.message !== ""? false: true} 
                     onClick={(e) => { props.sendMessage(e) }} >Send</Button> 
            </form>
    </div>
    )
}
export default Chatbox;