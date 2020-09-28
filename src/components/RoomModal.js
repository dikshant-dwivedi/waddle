import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import React from 'react';

export default function RoomModal(props) {

    const handleClose = () => { 
        props.clearRoomModal()}
    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style = {{textAlign: "center"}}>
                    <h3 style = {{marginBottom: "20px"}}>Make a Room</h3>
                    <Button 
                     variant="dark"
                     style = 
                     {{background: "green",
                     height: "30px",
                     fontSize: "0.8em"}}>Generate room code</Button>
                    <span style = {{
                     display: "inline-block",
                     fontFamily: "monospace",
                     marginLeft: "10px",
                     color: "red",
                     border: "1px solid black",
                     fontSize: "1.5em" }}>4qe5WXz</span>
                    <p style={{marginTop: "10px"
                    }}>This code will be valid just for 2 minutes</p>
                    <h4>Or</h4>
                    <h3 style={{ marginBottom: "20px" }}>Join a Room</h3>
                    <span>Room code</span>
                    <input type="text"
                    style = {{marginLeft : "10px"}}></input>
                    <Button
                        variant="dark"
                        size = "sm"
                        style = {{marginBottom: "5px"}}>Join</Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                 </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
