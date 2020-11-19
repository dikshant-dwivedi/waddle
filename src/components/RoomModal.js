import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, {useState}  from 'react';
import LoginAnimation from './lottie/LoginAnimation'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CheckIcon from '@material-ui/icons/Check';

 function RoomModal(props) {

    const [disabled, setDisabled] = useState(false)
    const [timerId, setTimerId] = useState(0);
    const [copied, setCopied] = useState(false);
    const [joined, setJoined] = useState(false);
    
    let copyString = copied ? "copied" : "";

     function join()
     {
         handleClose()
         props.join()
     }

     function createRoom(e)
     {
         e.preventDefault()
         if(!props.roomName || !props.roomCode)
         {
            return
         }
         else
         {
             setJoined(true)
             handleClose()
             props.join()
         }
     }

     const generateRoomCode = (event) => {
         event.preventDefault()
         props.setRoomCode(makeid(7))
         setDisabled(true)
         const id = setTimeout(() => {
             setDisabled(false)
             props.setRoomCode('')
         }, 120000);
         setTimerId(id)
         return () => clearTimeout(timerId)
     }

     const handleClose = () => {
         setDisabled(false);
         setCopied(false);
         if (!joined) {
             props.setRoomCode('')
         }
         clearTimeout(timerId)
         props.clearRoomModal()
     }

     function makeid(length) {
         var result = '';
         var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
         var charactersLength = characters.length;
         for (var i = 0; i < length; i++) {
             result += characters.charAt(Math.floor(Math.random() * charactersLength));
         }
         return result;
     }
     
    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.userData.user?
                    <div style = {{textAlign: "center"}}>
                    <h3 style = {{marginBottom: "20px"}}>Make a Room</h3>
                    <input type="text"
                        placeholder="Enter room name"
                        onChange={(e) => props.setRoomName(e.target.value)}
                        style={{ marginRight: "10px" }}></input>
                    <Button 
                        variant="dark"
                        style = 
                     {{background: "green",
                        height: "30px",
                        fontSize: "0.8em",
                        position: "relative",
                        bottom: "2px"}}
                        disabled = {disabled}
                        onClick = {generateRoomCode}>Generate room code</Button>
                    <span style = {{
                        display: "inline-block",
                        fontFamily: "monospace",
                        marginLeft: "10px",
                        color: disabled ? "red" : "grey" ,
                        border: "1px solid black",
                        fontSize: "1.5em" }}>{(props.roomCode && props.show)? props.roomCode : 'XXXXXXX'}</span>
                    <CopyToClipboard text={props.roomCode}
                    style = {{padding: "2px",
                    marginLeft: "10px",
                    background: "green",
                    position: "relative",
                    bottom: "2px"}}
                    disabled = {props.roomCode? false : true}
                    onCopy={() => {props.roomCode? setCopied(true) : setCopied(false)}}>
                    <Button style = {{background: "green"}}><FileCopyIcon style={{ fontSize: "21", color: "white", marginBottom: "3px"}}/></Button>
                    </CopyToClipboard>    
                    <p style={{marginTop: "10px"
                        }}>This code will be valid just for 2 minutes. {copyString}{copied && <CheckIcon style = {{marginBottom: "3px", color: "green"}}/>}</p>
                        <Button variant="dark"
                            className='btn btn-outline-dark shadow-none'
                            onClick={createRoom}
                            style={{
                                color: "white",
                                height: "35px",
                                fontSize: "0.8rem",
                                marginBottom: "10px"
                            }}>Create Room</Button>      
                    <h4>Or</h4>
                    <h3 style={{ marginBottom: "20px" }}>Join a Room</h3>
                    <input type="text"
                        placeholder = "Enter room code"
                        onChange = {(e) => props.setRoomCode(e.target.value)}
                        style = {{marginLeft : "10px"}}></input>
                    <Button
                        variant="dark"
                        size = "sm"
                        style = {{marginBottom: "5px"}}
                        onClick = {(e) => (!props.roomCode)? e.preventDefault() : join()}>Join</Button>
                    </div>:
                    <LoginAnimation/>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RoomModal