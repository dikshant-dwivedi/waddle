import React from 'react'
import './Chatbox.css'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import AttachFileIcon from '@material-ui/icons/AttachFile';

export default function Chatbox() {
    return (
        <div className = "chat-box">
            <div style = {{height: "340px", overflow: "auto"}} >
                <div style ={{float: "right", clear: "both"}} className="message-sender">
                    <div style={{ textAlign: "right" }}><strong>Rahul</strong></div>
                    <div style={{ textAlign: "left" }}>hey? Can you review my solution. I seem 
                    to be stuck at 5th paragraph</div>
                </div>
                
                <div style = {{clear: "both"}}className="message-sender">
                    <div style = {{textAlign: "left"}}><strong>Shivani</strong></div>
                    <div style = {{textAlign: "left"}}>Yeah, it was a tough cookie. Send me your approach</div>
                </div>

                <div style={{ float: "right", clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "right" }}><strong>Rahul</strong></div>
                    <div style={{ textAlign: "left" }} className="myBackground"></div>
                    <div style={{ textAlign: "left" }}>here</div>
                </div>

                <div style={{ float: "right", clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "right" }}><strong>Rahul</strong></div>
                    <div style={{ textAlign: "left" }}>What if we square its mean to get the final value</div>
                </div>

                <div style={{ clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "left" }}><strong>Shivani</strong></div>
                    <div style={{ textAlign: "left" }}>dsdfgdfgdfgdg</div>
                </div>


                <div style={{ clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "left" }}><strong>Shivani</strong></div>
                    <div style={{ textAlign: "left" }}>dsdfgdfgdfgdg</div>
                </div>

                <div style={{ float: "right", clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "right" }}><strong>Rahul</strong></div>
                    <div style={{ textAlign: "left" }}>What if we square its mean to get the final value</div>
                </div>

                <div style={{ clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "left" }}><strong>Shivani</strong></div>
                    <div style={{ textAlign: "left" }}>dsdfgdfgdfgdg</div>
                </div>
            </div>
            <form id = "message-form">
            <button id="message-send">
                <EmojiEmotionsIcon style={{ fontSize: "20", color: "white", marginBottom: "3px" }} />
                <AttachFileIcon style={{ fontSize: "20", color: "white", marginBottom: "3px", marginLeft: "2px" }} />
            </button>   
            <input id = "message-input"></input>
            <button id="message-send">Send</button>
            </form>
        </div>
    )
}
