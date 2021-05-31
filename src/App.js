import logo from './logo.svg';
import './App.css';

import Topic from './Topics/Topics'
import Chatroom from './Chatroom/ChatRoom'


import{ useState, useEffect} from 'react';

import {  useHistory, BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { AnimatedRoute, AnimatedSwitch } from 'react-router-transition';
import { makeStyles } from '@material-ui/core/styles';


import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

const useStyles = makeStyles({
  root: {
    height: "10vh",
  },
});


function App() {

  const [activeNavbar, setActiveNavbar] = useState("home") 
  const classes = useStyles();


  return (
    <div className="App">
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3pro.css"></link>
      
    <p class="app-title">chatable.io </p>


      <div className="app-body">
        
      <AnimatedSwitch >

          <Route  path='/c' component={()=><Topic/> }></Route>
          <Route  path='/' component={()=><Chatroom/> }></Route>


      </AnimatedSwitch>

      </div>
      <BottomNavigation
            value={activeNavbar}
            onChange={(event, newValue) => {
              setActiveNavbar(newValue);
            }}
            showLabels
          >
            <BottomNavigationAction label="home" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
          </BottomNavigation>




  </div>


  );
}

export default App;
