import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

export default function TimerInterrupted(props) {
 
    const handleClose = () => {props.clearModal()}

    let focus = props.lostFocus? props.lostFocus : "You";

    return (
        <>
            <Modal show={props.show} onHide = {handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Timer Interrupted</Modal.Title>
                </Modal.Header>
            <Modal.Body>{focus} lost focus!{" "}<SentimentVeryDissatisfiedIcon/>{" "}Let's start again!</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
