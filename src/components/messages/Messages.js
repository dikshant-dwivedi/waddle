import React, { useEffect, useRef }from 'react'
import Message from './../message/Message.js'

export default function Messages({messages, userName}) {

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages]);

    return (
            <div style ={{height: "350px", overflow: "auto", clear: "both", marginTop: "-10px", borderTop:"1px solid black", padding: "10px"}}>
            {messages.map((message, i) => 
            <div key = {i}><Message message = {message} userName = {userName}/></div>)} 
            <div style={{ clear: "both" }} ref={messagesEndRef}></div>
            </div>
    )
}
