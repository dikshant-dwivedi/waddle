import React from 'react'
import ReactEmoji from 'react-emoji';

export default function Message(props) {

    let isSentByCurrentUser = false



    if (props.message.user === (props.userName.charAt(0).toUpperCase() + props.userName.slice(1)))
    {
        isSentByCurrentUser = true
    }
    if(props.message.user === 'admin')
    {
        return (
            <div style={{ clear: "both", background : "#fbe3e8", marginRight: "auto", marginLeft:"auto" }} className="message-sender">
                <div style={{ textAlign: "center", fontWeight: "600"}}>{ReactEmoji.emojify(props.message.text)}</div>
            </div>
        )
    }
    else if(props.message.user === 'notice'){
        return (
            <div style={{
                clear: "both", background: "#ADEFD1FF", marginRight: "auto", marginLeft: "auto", whiteSpace: "pre-wrap",
                overflowWrap: "break-word"}} className="message-sender">
                <div style={{ textAlign: "center", marginBottom:"5" }}><strong>Notice</strong></div>
                <hr style = {{marginTop:"0", marginBottom: "0"}}/>
                <div style={{ textAlign: "center", fontWeight: "600", marginTop: "5" }}>{ReactEmoji.emojify(props.message.text)}</div>
            </div>
    )
    }
    return (
        isSentByCurrentUser
        ? (
            <div style={{ float: "right", clear: "both", marginRight: "10px" }} className="message-sender">
                <div style={{ textAlign: "right" }}><strong>{props.message.user}</strong></div>
                    <div style={{ textAlign: "left" }}>{ReactEmoji.emojify(props.message.text)}</div>    
            </div>
        )
        : (
            <div style={{ float: "left", clear: "both" }} className="message-sender">
                    <div style={{ textAlign: "left" }}><strong>{ReactEmoji.emojify(props.message.user)}</strong></div>
                <div style={{ textAlign: "left" }}>{props.message.text}</div>
            </div>
        )
    )
}
