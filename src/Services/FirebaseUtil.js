
//FIREBASE CONFIG//
import firebase from 'firebase';
import 'firebase/firestore';
import UserService from './UserService.js'


var firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};
  
firebase.initializeApp(firebaseConfig)


//DATABASE INIT
const firestore = firebase.firestore();
var database = firebase.database();

const chatroomsDB = firestore.collection('chatrooms');
const usersDB = firestore.collection('annonUsers');
//const messagesRef = firestore.collection('messages');


//Functional groups
class FirebaseUtil  {

    static firestore = firestore;


    static async getAllRooms(){
        let rooms = []
        await chatroomsDB.get().then((querySnapshot) => {
            rooms = querySnapshot.docs.map(doc => doc.data());
        });

        return rooms

    }

}


export {
    firebase,
    firestore, 
    FirebaseUtil
}

function stringGen(len) {
    var text = "";
    
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    for (var i = 0; i < len; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
    }