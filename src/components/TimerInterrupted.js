import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

export default function TimerInterrupted(props) {
 
    const handleClose = () => {props.clearModal()}

    return (
        <>
            <Modal show={props.show} onHide = {handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Timer Interrupted</Modal.Title>
                </Modal.Header>
            <Modal.Body>You lost focus!{" "}<SentimentVeryDissatisfiedIcon/>{" "}Let's start again!</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
