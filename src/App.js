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
import Chatbox from './components/chat/Chatbox';

function App(){

  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,});

  const [showRoomModal, setShowRoomModal] = useState(false);  

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token")
      if(token === null){
        localStorage.setItem("auth-token","")
        token = ""
      }
      const tokenRes = await axios.post(
        "http://localhost:5000/users/tokenIsValid", null, {headers: {"x-auth-token": token}})
        if(tokenRes.data){
          const userRes = await axios.get("http://localhost:5000/users/",{
             headers: { "x-auth-token": token},
             }) 
          setUserData({
            token,
            user: userRes.data
          })
        }
      }
      checkLoggedIn()
  }, []);

  function logout()
  {
     setUserData({
       token: undefined,
       user: undefined
     })
     localStorage.setItem("auth-token", "")
  }

  function onClickButton(e)
  {
    e.preventDefault()
    setShowRoomModal(true)
    console.log("button clicked")
  }

    return (
          <Router>
            <UserContext.Provider value = {{userData, setUserData}}>
              <React.Fragment>
                <Route exact path = "/" render= {() => (
                  <React.Fragment>
                <main className="App" >    
                <Navbar style={{ background: "rgba(255, 255, 255, 0.438)",
                 height: "50px",
                 borderBottom: "1px solid #000000"}}>
                  <Navbar.Brand href="#home" style= {{fontWeight: "600"}}>Waddle</Navbar.Brand>
                    <input type="text" 
                    placeholder="Search community"
                    className="search-community-input"
                    style = {{
                      display: userData.user ? "inline-block" : "none"
                    }}></input>
                    <Button variant="dark"
                      className='btn btn-outline-dark shadow-none'
                      style = {{
                        color: "white",
                        height: "35px",
                        fontSize: "0.8rem",
                        display: userData.user? "inline-block" : "none"
                        }}>Form community</Button>
                  <Button variant="dark"
                    className='btn btn-outline-dark shadow-none'
                    onClick={onClickButton}
                    style={{
                      color: "white",
                      height: "35px",
                      fontSize: "0.8rem",
                      marginLeft: userData.user? "10px" : "980px"         
                    }}>Make a room</Button>
                    <RoomModal show = {showRoomModal} clearRoomModal = {() => setShowRoomModal(false)}/>
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
                <Timer />
                {/*<TodoList/>*/}
                <Chatbox/>
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
