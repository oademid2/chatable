import { Redirect, BrowserRouter as Router, Route, Switch, withRouter, useLocation, Link} from 'react-router-dom';
import HoritzontalCard from './HorizontalCard'
import React, { useState,  useEffect} from 'react';
import { useHistory } from "react-router";



import './Topics.css';
import icon from './icon.png'; // Tell webpack this JS file uses this image

import { FirebaseUtil } from '../Services/FirebaseUtil';



function Topics(props) {
  const history = useHistory()

  let location = useLocation();
  const [allRooms, setAllRooms] = useState([])

  useEffect(async() => {

    let rooms_ = await FirebaseUtil.getAllRooms()
    setAllRooms(rooms_)

  
  }, []);



  function onJoinRoom(room){
    console.log(room)
    history.push("/chat")
  
  }


  return (
    <div class="page-root">

        <div className="header-div">
          <h3 className="header-title">ROOMS</h3>
          {/*<button className="header-button">create new topic</button>*/}
        </div>
        <div className="topics-root">
        {allRooms.map((room)=>{
          return(
                <HoritzontalCard
                imageSource={icon}
                title={room.roomName}
                description={"This is a wider card with supporting text below as a natural lead-in to additional content."}
                subtext={"Last updated 3 mins ago"}
                onClick={()=>onJoinRoom(room)}
                />
          )
        })}
        </div>

       </div>
       

  );
}


export default Topics;
