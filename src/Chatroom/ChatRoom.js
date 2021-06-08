//STYLE IMPORTS
import './chatroom.css';
import "antd/dist/antd.css"

//Third party imports
import React from 'react';
import autosize from "autosize";
import { Modal, Button} from 'antd';
import { FaTelegramPlane, FaArrowLeft, FaWizardsOfTheCoast } from "react-icons/fa";
import { withRouter} from 'react-router-dom';

//custom imports
import ChatMessage from './ChatMessage';
import  UserService  from '../Services/UserService.js';
import loadingGif from './loading.gif'

//Data models
//import Message from '../Models/MessageModel'
//import User from '../Models/UserModel';
import { firebase, firestore, FirebaseUtil } from '../Services/FirebaseUtil';






class Chat extends React.Component{


    constructor(props){

        super(props)

        this.state = {
            room: null, //information about which chat room this is
            user: null, //information about user logged in
            isAdmin: "", //*TODO: information on if user is admin -- to remove and use function to check
            newMessage: "", //state for message form
            messages: [], //messages to be shown
            status: "", //status of page
            messageOptionsIsVisible: false, //??
            render:false, //render page,
            roomID: "IIqkSHjF1BvrLHrq4OuX"
        }

        //html variables
        this.textarea = <textarea/> //set textarea ahead so we can call autosize function before render
        this.messagesEnd = <div/> //creating div to put at bottom of messages to allow for autoscroll

        ////bind functions
        this.showModal = this.showModal.bind(this)
        this.removeMessage =this.removeMessage.bind(this) //allows a message to be reported
        this.onAddReaction = this.onAddReaction.bind(this) //user clicks a reaction to add
        this.showMessageOptions = this.showMessageOptions.bind(this) //toggle options that can be take on message to show

        //other variables
        this.MaxMessageLength = 140;
        this.socket = null; 
        this.room = null;
    }


    componentDidMount(){

        let room = {};
 
        ( async() => {

            
            //Get the room

            //get url parameters -- status 404 if not found
            this.queryParams = this.queryParameters(this.props.history.location.search) ;
            this.queryParams.roomID = "IIqkSHjF1BvrLHrq4OuX"
            if(!this.queryParams.roomID) return this.setState({render:true, status: "404"});
            
            //get room from ID -- status 404 if not found
            room = await FirebaseUtil.findRoomById(this.queryParams.roomID)
            if(!room) return this.setState({render:true, status: "404"});

            
       
            //UserService.setUserID(prompt("Please enter your name", "Harry Potter"))
            

            if(!UserService.isLoggedIn()){
                this.setState({promptDisplayname: true})
            }

            //set state with new values
            
            this.setState({
                room: room,
                user: {userName: UserService.userName(), userID: UserService.getUserID() },
                isAdmin: room.adminID == UserService.getUserID(),
                newMessage: "",
                messages: [],
                status: "200",
                render:true,
                displayName: "",
                messageOptionsIsVisible: false,
                modalVisible: false,
                modal:{state:""}
      
            })

            this.room = room;
            
            //set up message listener for messages
            this.messagesRef = FirebaseUtil.firestore.collection('chatrooms').doc(this.queryParams.roomID).collection("messages");
            this.query = this.messagesRef.orderBy('createdAt').limit(25)
            this.unsubscribeMessages = this.query.onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                this.setState({messages:data})
            })

            console.log("this room is: ", room)
            autosize(this.textarea);


        })()

    }





    queryParameters(searchPath){
        let queryParams = {}
        try{
            let searchString = searchPath.substring(1).split('&')
            let pair = []
            for(var i=0;i<searchString.length;i++){
                pair = searchString[i].split('=')
                queryParams[pair[0]] = pair[1]
            }
            //if no room in parameters status 404
            return queryParams
        }catch(err){
            return null
            
        }

    }


    set(field, value){
        this.setState({[field]: value})
    }

    setValue(setter, event){
        this.set(setter, event.target.value)
    }

    updateNewMessage(event){
        if(event.target.value.length>this.MaxMessageLength)
            return this.set("newMessage" ,event.target.value.substring(0,this.MaxMessageLength))
        this.set("newMessage" ,event.target.value)
    }

    async sendMessage(){
        //create message
        let newMessageData = {
            roomCode: this.state.room.roomCode,
            roomID: this.state.room.roomID,
            message :  this.state.newMessage,
            userName : this.state.user.userName,
            userID : UserService.getUserID(),
            id : "mid",
            createdAt : FirebaseUtil.timeStamp(),
            reactions : []
        }

        console.log(this.state.room.roomID)
        console.log(this.state)
        await FirebaseUtil.sendMessage(newMessageData, this.state.room.roomID)
        this.set("newMessage", "")
    }

    endRoom(){this.setState({status: "exit"})}
    leaveRoom(){this.props.history.push("/")}

    removeUser(msg){
       
        
    }
    
    exitRoom(){
        this.props.history.push("/home")
        console.log("test")
    }

    setValue(setter, event){
        setter(event.target.value)
     }
    exitClosedRoom(){this.props.history.push("/")}

    removeMessage(msg){
        
    }

    onAddReaction(emoji, msg){FirebaseUtil.addReacton(msg, emoji)}

    closeMessageOptions(){
        this.setState({modalVisible: false})
        this.setState({modal: {state:""}})
        this.setState({messageOptionsIsVisible: false})
    }

    showMessageOptions(msg){this.setState({messageOptionsIsVisible: true})}

    scrollToBottom = () => {this.messagesEnd.scrollIntoView({ behavior: "smooth" });}

    componentDidUpdate(prevState, currState) {
        //console.log(prevState, currState)
        if(this.state.render && this.state.status =="200")this.scrollToBottom();
      }

    showModal(state,data=null){
        console.log(state)
        this.setState({modal: {state:state, data:data}})
        this.setState({modalVisible: true})
    }

  
    render(){

        return (
            
            <>
            <div class="chatroom-root">
                {!this.state.render? <div class="loading-div"><img src={loadingGif}></img></div>:null}
                {(this.state.render && this.state.status=="404")? <div>STATUS 404</div>:null}
                {(this.state.render && this.state.status=="exit")? <div>room ended by admin.</div>:null}
                {(this.state.render && this.state.status=="303")? <div>you've been removed from this room.</div>:null}

                {(this.state.render && this.state.status =="200" )?
        
                        <div class="chatroom-view">
                        
                        <div class="title-view">

            <span onClick={this.exitRoom.bind(this)} class="title-back-btn"><FaArrowLeft/></span>
            
            <span class="title-text">{this.state.room.roomName}Bachelor in Paradise</span>
            {/*this.state.isAdmin?
                <p class="title-leave-btn"  onClick={this.endRoom.bind(this)}>end room</p>:
                <p class="title-leave-btn"  onClick={this.leaveRoom.bind(this)}>leave</p>
            */ }
        {this.state.isAdmin?
                <span onClick={()=>this.showModal("end-room")}class="leave-text">end</span>:
                <span onClick={this.leaveRoom.bind(this)} class="leave-text">X</span>
        }

       
        <div className="subtitle-view">
            <p className="subtitle-text">code: {this.state.room.roomCode}</p>
        </div>
    

        </div>
  
                  
                        <div class="chatroom-messages-view">
                    
                            {this.state.messages?
                            <div>
                                {this.state.messages.map(msg=> 
                                <ChatMessage 
                                    onClick={()=> this.showModal("ban-user",msg)} 
                                    onReportMessage={this.removeMessage}
                                    message ={msg}
                                    key={msg.id} 
                                    text={msg.message} 
                                    userName={msg.userName } 
                                    reactions = {msg.reactions}
                                    onAddReaction={(emoji=>this.onAddReaction(emoji, msg))}
                                    isUser={UserService.getUserID()=== msg.userID }/>)}
                                       <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                            </div>
                                :null
                                 }
                
                            </div>
                         
                        <div class="typed-message-view">
                            <div className="typed-message-input-div">
                            <textarea
                                class="typed-message-input"
                                ref={c => (this.textarea = c)}
                                rows={3}
                                defaultValue=""
                                value={this.state.newMessage} 
                                onChange={this.updateNewMessage.bind(this) }
                                class="typed-message-input"
                                />
                            </div>
                            <div className="typed-message-options-div">
                            
                                <i class="material-icons send-message-btn" 
                                    onClick={this.sendMessage.bind(this)}
                                ><FaTelegramPlane/></i>
                                <span className="character-count">{this.state.newMessage.length}/{this.MaxMessageLength}</span>
                            
                            </div>
                        </div>

                
                
                        <Modal  width="80%" visible={this.state.modalVisible}  onCancel={this.closeMessageOptions.bind(this)} footer={null}>
                            <div className="message-info-modal">
                                {this.state.modal.state == "end-room"?
                                    <div>
                                        Are you sure you want to end room? All members will be kicked out.
                                        <button onClick={this.endRoom.bind(this)}> End Room</button>

                                    </div>:null
                                }

                                {this.state.modal.state == "ban-user"?
                                    <div>
                                    <button onClick={()=>this.removeMessage(this.state.modal.data)}> Remove User</button>
                                    </div>:null
                                }
                            </div>
                        
                        </Modal>



           
                        </div>
                      

                    :null
                }

            

                <Modal  
                    getContainer={true}
                    width="80%" 
                    visible={this.state.promptDisplayname}  
                    onCancel={this.exitRoom.bind(this)} 
                    cancelText={"exit"}
                    onOk={() => {
                        this.setState(
                            {user: UserService.anonLogin(this.state.displayName),
                            promptDisplayname: false
                            })
                    }}
                >
                              <p>Enter a display name:</p>
                              <input
                                value={this.state.displayName}
                                onChange={(event) => this.setState({displayName: event.target.value})}
                            >
                            </input>  
                </Modal>
            </div>


            </>




        );

        
    }
    
}

export default withRouter(Chat);
