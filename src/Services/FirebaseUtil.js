
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

    static async findRoomById(roomID){

        let room;
        await chatroomsDB.doc(roomID).get().then((doc) => {

            console.log(doc)
            if(doc){
                 room =doc.data()
                 room.roomID = doc.id
            }
        })

        return room
        
    }

    static timeStamp(){
        console.log("Timestamped: ",firebase.firestore.FieldValue.serverTimestamp())
        return firebase.firestore.FieldValue.serverTimestamp()
   }

   static async sendMessage(newMessageData, roomID){
        let newMessageDataRef = await  chatroomsDB.doc(roomID).collection("messages").doc()
        newMessageDataRef.set({...newMessageData, id:newMessageDataRef.id})
    }

    static async findRoomByCode(code){

        let room = {}
        await chatroomsDB.where("roomCode", "==", code)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                room = doc.data();
                console.log(doc.data())
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });

        console.log(room)
        return room
        
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