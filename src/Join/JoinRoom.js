import React, { useState,  useEffect} from 'react';
import { Modal, Button, message } from 'antd';
import { withRouter} from 'react-router-dom';

//custom imports
import {FirebaseUtil} from '../Services/FirebaseUtil';
import UserService from '../Services/UserService.js';


import styleSheet from '../Styles/StyleSheet'
import './JoinRoom.css';
import '../Styles/root-themes.css';

import CustomInput from './CustomInput'

import io from 'socket.io-client';




function JoinRoom(props) {

    const [room, setRoom] = useState({})
    const [roomCode, setRoomCode] = useState("")
    const [userName, setUserName] = useState("")
    const [roomToJoin, setRoomToJoin] = useState({})
       
    useEffect(() => {
      
      if(props.location.state){
        if(props.location.state.room){
          setRoomCode(props.location.state.room.roomCode)
          setRoom(props.location.state.room)
        }
      }

      if(props.room){
        setRoomCode(props.room.roomCode)
        setRoom(props.room)
      }
      //register user


  }, []);
  

    function setValue(setter, event){
        setter(event.target.value)
     }


    async function onJoinRoom(){

        //check availability
        if(!userName || !roomCode){
          message.error("ensure fields are filled.");
          return
        }

        //TODO: prompt to create user profile
        let userID  = "124"//await FirebaseUtil.getUserToken();
        let user = {userName: userName, userID: userName}//test
        UserService.login(user)

        //get the room
        let room = await FirebaseUtil.findRoomByCode("HLAI7R")
        if(!room)  return message.error("Room does not exist.");
        //TODO: check if user is banned

        console.log(room)
        props.history.push({
          pathname:'/chat',
          search:"?room="+room.roomID,
          state: {room: room}
        })

        return

  
    }

  return (
    <div class="join-room-root">


      <div class="join-room-view">

        <h1 className="join-room-title">Join Room.</h1>
       

    

            <CustomInput
                title={`Enter display name.`}
                placeholder="Enter display name..."
                onChange={(event) => setValue(setUserName, event)}
                value={userName}
            />
         
            <CustomInput
                title={`Enter Room code.`}
                placeholder="Enter room code..."
                onChange={(event) => setValue(setRoomCode, event)}
                value={roomCode}
            />

            



            <button 
              class="root-theme-button-sm join-room-button" 
              onClick={()=>onJoinRoom()}
            >
              join room
            </button>




      </div>


      
    </div>

  );
}

export default withRouter(JoinRoom);


//        <div className="login-warning">Enter display name.</div>