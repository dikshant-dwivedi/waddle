import React, {useState, useEffect} from 'react';
import Timer from './components/clock/Timer.js'
import Login from './components/pages/Login.js'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import TodoList from './components/todo/TodoList.js'
import './App.css';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import UserContext from './context/UserContext.js';
import RoomModal from './components/RoomModal';
import CommunityModal from './components/CommunityModal';
import Chatbox from './components/chat/Chatbox';
import ReactCardFlip from 'react-card-flip';
import io from 'socket.io-client'
//import socket from './Server.js'
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import LoginAnimation from './components/lottie/LoginAnimation'
import MakeRoomAnimation from './components/lottie/MakeRoomAnimation'


let socket;

function App(){

  const [userData, setUserData] = useState({token: undefined,user: undefined,});
  const [showRoomModal, setShowRoomModal] = useState(false); 
  const [showCommunityModal, setShowCommunityModal] = useState(false); 
  const [isFlipped, setIsFlipped] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isConnected, setIsConnected] = useState(false)
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([])
  const [notice, setNotice] = useState('')
  const [users, setUsers] = useState([])
  const ENDPOINT = 'localhost:5000'
  const makeRoomString = isConnected? 'Disconnect' : 'Make a room'

  //for checking if the user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token")
      if (token === null) {
        localStorage.setItem("auth-token", "")
        token = ""
      }
      const tokenRes = await axios.post(
        "http://localhost:5000/users/tokenIsValid", null, { headers: { "x-auth-token": token } })
      if (tokenRes.data) {
        const userRes = await axios.get("http://localhost:5000/users/", {
          headers: { "x-auth-token": token },
        })
        setUserData({
          token,
          user: userRes.data
        })
      }
    }
    checkLoggedIn()
  }, []);


  const [timerControl, setTimerControl] = useState("enabled");
  const [isVisibleSocket, setIsVisibleSocket] = useState(true);
  const [lostFocus, setLostFocus] = useState('')
  const [timerValues, setTimerValues] = useState({ workMinute: 25, breakMinute: 5, timerSecond: 0, isFlipped: false, isWorkSession: true});
  const [open, setOpen] = useState(false)

  //for joining the room
  const join = async() => {
    socket = io(ENDPOINT);
    console.log(socket)
    socket.emit('join', { userName: userData.user['firstName'], roomCode, roomName }, (error) => {
      if (error) {
        alert(error);
        setIsConnected(false)
      }
      else{
        setIsConnected(true)
      }  
    });

    setMessages([])
    setNotice('')
    setIsFlipped(true)

    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
      if(message.user === 'notice')
      {
        setNotice(message.text)
      }
    });

    socket.on('disable', () => {
      console.log('socket.on disable client side: I was called')
      setTimerControl("disabled");
    })

    socket.on('play',(data) => {
      console.log('socket.on play client side: I was called')
      setTimerValues(data.timerValues)
      setTimerControl("play")
    })

    socket.on('stop', () => {
      console.log('socket.on stop client side: I was called')
      setTimerControl("stop")
    })

    socket.on('reset', () => {
      console.log('socket.on reset client side: I was called')
      setTimerControl("reset")
    })

    socket.on('handleVisibility', data => {
      console.log('socket.on visibility changed: ', data.isVisible)
      setIsVisibleSocket(data.isVisible)
      setLostFocus(data.userName)
    })

    socket.on('roomData', (data) => {
      console.log('socket.on roomData client side: I was called')
      setUsers([]);
      for(let i = 0; i < data.users.length; i++)
      {
        let id = data.users[i].id;
        let isAdmin = data.users[i].isAdmin;
        let roomCode = data.users[i].roomCode;
        let roomName = data.users[i].roomName;
        let userName = data.users[i].userName;
        let user = {id, isAdmin, roomName, roomCode, userName}
        setUsers(users => [...users, user])
      } 
    })

    socket.on('onGettingRemoved', () => {
      setRoomCode('')
      setMessages([])
      setUsers([])
      setRoomName('')
      setTimerValues({ workMinute: 25, breakMinute: 5, timerSecond: 0, isFlipped: false, isWorkSession: true })
      setTimerControl("enabled")
      setIsConnected(false)
      setOpen(true)
    })
  }

  //for sending message
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('')});
    }
  }
  //for showing room modal or disconnecting
  const manageRoom = (event) => {
    event.preventDefault()
      if(isConnected)
      {
        console.log("disconnect from client side called")
        socket.emit('disconnectRoom')
        setRoomCode('')
        setMessages([])
        setUsers([])
        setRoomName('')
        setTimerValues({ workMinute: 25, breakMinute: 5, timerSecond: 0 })
        setTimerControl("enabled")
        setIsConnected(false)
      }
      else
      {
          setShowRoomModal(true)
      }
    }

  //for logging the user out
  function logout()
  {
     setUserData({
       token: undefined,
       user: undefined
     })
     localStorage.setItem("auth-token", "")
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

    return (
          <Router>
            <UserContext.Provider value = {{userData, setUserData}}>
              <React.Fragment>
                <Route exact path = "/" render= {() => (
                  <React.Fragment>  
                <main className="App" >    
                  <Snackbar
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    open={open}
                    autoHideDuration={2000}
                    onClose={handleClose}
                    message="You were removed from the room!"
                    action={
                      <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </React.Fragment>
                    }
                  />
                <Navbar style={{ background: "rgba(255, 255, 255, 0.438)",
                 height: "50px",
                 borderBottom: "1px solid #000000"}}>
                  <Navbar.Brand href="#home" style= {{fontWeight: "600"}}>Waddle</Navbar.Brand>
                    <input type="text" 
                    placeholder="Search community"
                    className="search-community-input"
                    style = {{
                      display: "inline-block"
                    }}></input>
                    <Button variant="dark"
                      className='btn btn-outline-dark shadow-none'
                      style = {{
                        color: "white",
                        height: "35px",
                        fontSize: "0.8rem",
                        display: "inline-block"
                        }}
                        onClick = {(e) => setShowCommunityModal(true)}>Form community</Button>  
                    <CommunityModal show={showCommunityModal}
                      clearCommunityModal={() => setShowCommunityModal(false)}
                    />
                  <Button variant="dark"
                    className='btn btn-outline-dark shadow-none'
                    onClick={manageRoom}
                    style={{
                      color: "white",
                      height: "35px",
                      fontSize: "0.8rem",
                      display: "inline-block",
                      marginLeft: "10px"        
                      }}>{makeRoomString}</Button> 
                    <RoomModal show = {showRoomModal}
                     clearRoomModal = {() => setShowRoomModal(false)}
                     userData = {userData}
                     roomCode = {roomCode}
                     setRoomCode = {setRoomCode}
                     setRoomName = {setRoomName}
                     roomName = {roomName}
                     join = {join}
                    />
                      {userData.user ? 
                      <Button variant="dark"
                        className='btn btn-outline-dark shadow-none'
                        onClick={logout}
                        style={{
                          color: "white",
                          height: "35px",
                          fontSize: "0.8rem",
                          marginLeft: "10px"

                        }}>
                        Log out</Button>
                        : <Button variant="dark"
                          className='btn btn-outline-dark shadow-none'
                          style={{
                            color: "white",
                            height: "35px",
                            fontSize: "0.8rem",
                            marginLeft: "10px"
                          }}>  
                         <Link style={{ color: "white", textDecoration: "none" }} to="/login">Sign in</Link></Button>}
                </Navbar>
                <div style={{width: "100%", marginTop: "65px"}}>
                <Timer 
                /*play = {play}
                stop = {stop}
                reset = {reset}*/
                timerControl = {timerControl}
                timerValues = {timerValues}
                isVisibleSocket = {isVisibleSocket}
                roomCode = {roomCode}
                socket = {socket}
                setTimerControl = {setTimerControl}
                lostFocus = {lostFocus}
                />
                <div id = "todo-chat-container" >
                      <div className="switch-work">
                        {/*<button className = "chat-todo-button" onClick={(e) => setIsFlipped(true)}>chat</button>
                        <br/>
                        <button className = "chat-todo-button" onClick={(e) => setIsFlipped(false)}>todo</button>
                        */}
                        <Button variant="dark"
                          className='btn btn-outline-dark shadow-none'
                          style={{
                            color: "white",
                            fontSize: "1rem",
                            padding: "5px",
                            background: "black",
                            fontFamily: "sans-serif",
                            width: "60px"
                          }}
                          onClick={(e) => setIsFlipped(true)}
                          disabled={isFlipped? true: false}>Chat</Button>
                          <br/>
                        <Button variant="dark"
                          className='btn btn-outline-dark shadow-none'
                          style={{
                            color: "white",
                            fontSize: "1rem",
                            padding: "5px",
                            background: "black",
                            fontFamily: "sans-serif",
                            marginTop: "5px",
                            width: "60px"
                          }}
                          onClick={(e) => setIsFlipped(false)}
                          disabled={isFlipped ? false : true}>Tasks</Button>
                        </div>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <TodoList/>
                {userData.user ? (
                (isConnected)? 
                <Chatbox 
                sendMessage = {sendMessage}
                message = {message} 
                setMessage = {setMessage}
                messages = {messages}
                userData = {userData}
                users = {users}
                socket = {socket}
                notice = {notice}
                setNotice = {setNotice}/>
                :
                <MakeRoomAnimation
                setShowRoomModal = {setShowRoomModal}
                isFlipped = {isFlipped}/>)
                :
                <LoginAnimation
                showRoomModal= {showRoomModal}
                isFlipped = {isFlipped}/>}
                </ReactCardFlip>
                </div>
                </div>
                </main>
                  </React.Fragment>
                )} />
          <Route path="/login" component={Login}/>
          </React.Fragment>
        </UserContext.Provider>
         </Router>
    );
}

export default App;
