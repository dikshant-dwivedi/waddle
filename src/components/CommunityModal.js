import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React from 'react';
import * as animationData from './../jsonLottie/underConstruction.json'
import Lottie from 'react-lottie';

function CommunityModal(props) {

    const handleClose = () => {
        props.clearCommunityModal()
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <>
            <Modal show={props.show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Form Community</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Lottie options={defaultOptions}
                        height={280}
                        width={280}
                        isStopped={false}
                        isPaused={false} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CommunityModal