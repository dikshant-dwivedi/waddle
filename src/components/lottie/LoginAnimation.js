import React from 'react'
import * as animationData from '../../jsonLottie/login.json'
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';

export default function LoginAnimation(props) {

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
            <Link style={{
                    color: "white",
                    textDecoration: "none",
                }} to="/login">
                 <h2 id="login-to-make-a-room" >Login to make a room</h2></Link>
        </div>
    )
}
