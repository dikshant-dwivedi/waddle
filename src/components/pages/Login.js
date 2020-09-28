import React, {useContext, useState} from 'react'
import UserContext from '../../context/UserContext'
import './Login.css'
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import Button from 'react-bootstrap/Button';
import GoogleLogin from 'react-google-login';
import ReactCardFlip from 'react-card-flip';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import ErrorNotice from '../ErrorNotice'


export default function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setPasswordCheck] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [isFlipped, setIsFlipped] = useState(false);
    const {setUserData} = useContext(UserContext) 
    const history = useHistory()
    const [error, setError] = useState();

    const registerUser = async(e) => {
        try{
        e.preventDefault()
        const newUser = {email, password, passwordCheck, firstName, lastName}
        await axios.post("http://localhost:5000/users/register", newUser)
        const loginRes = await axios.post("http://localhost:5000/users/login", {
            email,
            password
        })
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        })
        localStorage.setItem("auth-token", loginRes.data.token)
        history.push('/')
    }catch(err)
    {
        err.response.data.msg && setError(err.response.data.msg)
    }
    }

    const loginUser = async (e) => {

        try{
        e.preventDefault()
        const lgnUser = { email, password }
        const loginRes = await axios.post("http://localhost:5000/users/login", lgnUser)
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        })
        localStorage.setItem("auth-token", loginRes.data.token)
        history.push('/')
    }
    catch(err)
    {
        err.response.data.msg && setError(err.response.data.msg)
    }
    }

    const googleSignup = async(response) => {
        try{
        const profile = response.getBasicProfile()
        const name = profile.getName().split(' ')
        const email_id = profile.getEmail()
        const newUser = {email: email_id,firstName: name[0],lastName: name[1] }
        await axios.post("http://localhost:5000/users/registerGoogle", newUser)
        const loginRes = await axios.post("http://localhost:5000/users/loginGoogle", {email:
        email_id
        })
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        })
        localStorage.setItem("auth-token", loginRes.data.token)
        history.push('/')
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }

    const googleLogin = async(response)=>{
        try{
        const profile = response.getBasicProfile()
        const email_id = profile.getEmail()
        const lgnUser = {email: email_id}
        const loginRes = await axios.post("http://localhost:5000/users/loginGoogle", lgnUser)
        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        })
        localStorage.setItem("auth-token", loginRes.data.token)
        history.push('/')
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg)
        }
    }
    return (
           <div id = "login">
                <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                <div className="login-box">
                {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                <h1 id = "branding" style = {{marginBottom: "50px"}}>Waddle</h1>
                <form onSubmit={loginUser}>
                <AccountCircle style={{ color: "white", position: "relative", left: "30px",bottom: "2px"}} />
                <input 
                    disabled={isFlipped ? true : false}
                    type = "email" 
                    placeholder = "Email" 
                    className = "email-field"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}/>
                <br/>
                <LockIcon style={{ color: "white", position: "relative", left: "30px", bottom: "2px" }} />
                <input 
                    disabled={isFlipped? true: false}
                    type="password" 
                    placeholder="Password" 
                    className = "password-field"
                    value ={password}
                    onChange={(e)=> setPassword(e.target.value)}/>
                <p className="links" id = "forgot-password">Forgot password?</p>
                <Button variant="dark"
                    className='btn btn-outline-dark shadow-none'
                    onClick={loginUser}
                    style={{
                        color: "white",
                        height: "35px",
                        fontSize: "0.9rem",
                        border: "1px solid white",
                        width: "300px",
                        marginTop: "15px",
                        marginBottom: "20px"
                }}>Login</Button>
                </form>
                <GoogleLogin 
                    className = "google-button" 
                    theme = "dark"
                    clientId="474264424778-ak06d51lnohj2gqhjq2qkv1ud7hj17vt.apps.googleusercontent.com"
                    buttonText="Sign in with Google"
                    onSuccess={googleLogin}
                    cookiePolicy={'single_host_origin'}/>
                <p style=
                    {{
                        fontSize: "0.75rem",
                        color: "white",
                        fontWeight: "600",
                        marginTop: "30px"
                        }}>Not registered? <span className="links" onClick={(e) => setIsFlipped(true)}>Create an account</span></p>   
                </div>
                <div className="login-box">  
                    {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
                    <h1 id="branding">Waddle</h1>
                    <form onSubmit={registerUser}>
                        <input 
                            disabled={isFlipped ? false : true}
                            type="text"
                            placeholder="First Name"
                            id="first-name-field"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} />
                        <input 
                            disabled={isFlipped ? false : true}
                            type="text" 
                            placeholder="Last Name" 
                            id="last-name-field"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                        <br/>
                        <AccountCircle style={{ color: "white", position: "relative", left: "30px", bottom: "2px" }} />
                        <input 
                            disabled={isFlipped ? false : true}
                            type="email" 
                            placeholder="Email" 
                            className="email-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <LockIcon style={{ color: "white", position: "relative", left: "30px", bottom: "2px" }} />
                        <input
                            disabled={isFlipped ? false : true}
                            type="password" 
                            placeholder="Password" 
                            className="password-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <br />
                        <LockIcon style={{ color: "white", position: "relative", left: "30px", bottom: "2px" }} />
                        <input 
                            disabled={isFlipped ? false : true}
                            type="password" 
                            placeholder="Confirm password" 
                            className="password-field"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)} />
                    <Button variant="dark"
                        className='btn btn-outline-dark shadow-none'
                        onClick={registerUser}
                        style={{
                            color: "white",
                            height: "35px",
                            fontSize: "0.9rem",
                            border: "1px solid white",
                            width: "300px",
                            marginBottom: "10px",
                            marginTop: "5px"
                        }}>Sign up</Button>
                    </form>
                    <GoogleLogin 
                        className="google-button" 
                        theme="dark" 
                        clientId="474264424778-ak06d51lnohj2gqhjq2qkv1ud7hj17vt.apps.googleusercontent.com"
                        onSuccess={googleSignup}
                        cookiePolicy={'single_host_origin'}
                        buttonText = "Sign up with Google"/>
                    <p style=
                        {{
                            fontSize: "0.75rem",
                            color: "white",
                            fontWeight: "600",
                            marginTop: "10px"
                        }}>Have an account? <span className="links" onClick = {(e)=> setIsFlipped(false)}>Sign in</span></p>
                </div>
            </ReactCardFlip>
        </div>
    )
}