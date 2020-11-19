import React, {useEffect, useState} from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import './Settings.css';
import Button from 'react-bootstrap/Button';
export default function Settings(props) {

    let isAdmin = false;
    for(let i = 0; i < props.users.length; i++)
    {
        if(props.users[i].userName.toLowerCase() === props.userName.toLowerCase())
        {
            if(props.users[i].isAdmin)
            {
                isAdmin = true;
            }
        }
    }
    //const [notice, setNotice] = useState('');
    const roomName = props.users[0] ? props.users[0].roomName : "";
    const roomCode = props.users[0] ? props.users[0].roomCode : "";

    function issueNotice(e)
    {
        e.preventDefault()
        if(props.notice)
        {
            props.socket.emit('issueNotice', props.notice, () => { 
                console.log("I have sent a notice issue callback");})
        }
    }
    return (
        <div>
            <div style={{
                height: "425px",
                width: "100%",
                visibility: props.showSettings ? "visible" : "hidden",
                position: "absolute",
                zIndex: "2",
                backgroundColor: "#8EC5FC",
                backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
                marginBottom: "-10px",
                borderRadius: "5px"
            }}>
                <IconButton size="medium"
                    onClick={(e) => props.setShowSettings(false)}
                    style={{ color: "#000000", outline: 'none', float: 'left', top: "-5px", left: "-5px", marginBottom: "-20px" }}>
                    <ArrowBackIcon />
                </IconButton>
                <div id = "room-info"><span style = {{marginLeft : "-30px"}}>{"Room: " + roomName}</span>
                <span style = {{float: "right"}}>{"Code: " + roomCode}</span></div>  
                <div id="settings-container">
                <Users users={props.users} userName = {props.userName} socket = {props.socket}/>
                <div id = "notice-div">
                <h2 id="notice-heading">Notice</h2>
                <textarea id="comment" value ={props.notice} placeholder={isAdmin? "Type here...":""} disabled={isAdmin? false: true} onChange = {(e) => props.setNotice(e.target.value)}></textarea>
                {isAdmin &&<Button disabled = {props.notice ? false: true} onClick = {issueNotice} variant="outline-danger"size="sm">Issue</Button>}
                </div>
                </div>
            </div>
        </div>
    )
}

function Users(props) {
    return (
        <div id = "users-list-container" className = "users-container">
            <h2 id = "users-heading">Users</h2>
            {props.users.map((user, i) =>
                <div key={i}><User user = {user} userName = {props.userName} socket = {props.socket}/></div>)}
        </div>
    )
}

 function User(props) {

    let isCurrentUser = false

    if (props.user.userName.toLowerCase() === props.userName) {
        isCurrentUser = true
    }

    const removeUser = (e) => {
        console.log(props.socket)
        if(props.socket)
        {
        props.socket.emit("removeUser", props.user.id, () => {console.log("remove user called")})
        }
    }

    return (
        <div className = "individual-user">
            <div style={{ textAlign: "left", fontWeight: "600", clear: "both" }}>
            <span id = "username-span">{isCurrentUser?`${props.user.userName} - You` : props.user.userName}</span>
            {!props.user.isAdmin && !isCurrentUser &&
             <Button variant="outline-danger"
                onClick = {removeUser}
                size="sm"
                style={{ float: "right",
              position: "relative",
               bottom: "3px"}}>Remove</Button>}
            {props.user.isAdmin && <span id = "admin-span">Admin</span>}
            </div>
        </div>
    )
}



