import React from 'react'
import * as animationData from './../../jsonLottie/makeroom.json'
import Lottie from 'react-lottie';

export default function MakeRoomAnimtion(props) {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div>
            <Lottie options={defaultOptions}
                height={280}
                width={280}
                isStopped={false}
                isPaused={false} />
                <h2 id="login-to-make-a-room" onClick = {(e) => props.setShowRoomModal(true)}
                style={{ display: props.isFlipped 
                ? "inline-block" : "none"}}>Make or join a room</h2>
        </div>
    )
}
