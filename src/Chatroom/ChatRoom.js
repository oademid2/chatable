//STYLE IMPORTS
import './chatroom.css';

//Third party imports
import React from 'react';
import io from 'socket.io-client';
import autosize from "autosize";
import { Modal} from 'antd';
import { FaTelegramPlane, FaWizardsOfTheCoast } from "react-icons/fa";
import { withRouter} from 'react-router-dom';

//custom imports
import ChatMessage from './ChatMessage';
import SocketManager from './Socket'
import  UserService  from '../Services/UserService.js';
//import Message from '../Models/MessageModel'
import User from '../Models/UserModel';
import { firebase, firestore, FirebaseUtil } from '../Services/FirebaseUtil';





class Chat extends React.Component{


    constructor(props){

        super(props)

        this.state = {
            room: null,
            user: null,
            isAdmin: "",
            newMessage: "",
            messages: [],
            status: "",
            messageOptionsIsVisible: false,
            render:false
        }

        ////bind functions
        this.textarea = <textarea/>
        this.messagesEnd = <div/>
        this.showModal = this.showModal.bind(this)
        this.removeMessage =this.removeMessage.bind(this)
        this.onAddReaction = this.onAddReaction.bind(this)
        this.showMessageOptions = this.showMessageOptions.bind(this)

        //other variables
        this.MaxMessageLength = 140;
        this.socket = null; 
        this.room = null;
    }


    componentDidMount(){

        let room;

        //query parameters to find the room that has been selected
        this.queryParams = this.queryParameters(this.props.history.location.search)
        if(!this.queryParams){
            this.setState({render:true, status: "404"})
            return 
        }else if (!this.queryParams.room){
            this.setState({render:true, status: "404"})
            return 
        }

        ( async() => {

            /////find room
            if(this.props.location.state) room = this.props.location.state.room
            else room = await FirebaseUtil.findRoomById(this.queryParams.room)

            //TODO: handle redirects/prompts

            //if room not found then render a 404 page
            if(!room){
                this.setState({render:true, status: "404"})
                this.setState({render: true})
                return
            }


                        
            //if the user is not logged in then new one...
            //if they are not authenticated prompt....
            if(!UserService.isLoggedIn()){
                /*this.props.history.push({
                    pathname: '/joinroom',
                    search: "",
                    state: { room: room}
                })
                return*/
            }

            //set state with new values
            
            this.setState({
                room: room,
                user: {userName: UserService.userName(), userID: UserService.token() },
                isAdmin: room.adminID == UserService.getUserID(),
                newMessage: "",
                messages: [],
                status: "200",
                messageOptionsIsVisible: false,
                modalVisible: false,
                modal:{state:""},
                render:true
            })

            this.room = room;
            
            //set up message listener
            this.messagesRef = FirebaseUtil.firestore.collection('chatrooms').doc(this.queryParams.room).collection("messages");
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
            roomID: this.queryParams.room,
            message :  this.state.newMessage,
            userName : this.state.user.userName,
            userToken : UserService.getUserID(),
            id : "mid",
            createdAt : FirebaseUtil.timeStamp(),
            reactions : []
        }
        await FirebaseUtil.sendMessage(newMessageData, this.queryParams.room)
        this.set("newMessage", "")
    }

    endRoom(){
        this.setState({status: "exit"})
    }

    leaveRoom(){
        this.props.history.push("/")
    }

    removeUser(msg){
       
        
    }
    
    exitClosedRoom(){
        this.props.history.push("/")
    }

    removeMessage(msg){
        
    }

    onAddReaction(emoji, msg){
        FirebaseUtil.addReacton(msg, emoji)
    }

    closeMessageOptions(){
        this.setState({modalVisible: false})
        this.setState({modal: {state:""}})
        this.setState({messageOptionsIsVisible: false})
    }


    showMessageOptions(msg){
        this.setState({messageOptionsIsVisible: true})
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
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
            
            <div class="chatroom-root">
                {!this.state.render? <div>Loading</div>:null}
                {(this.state.render && this.state.status=="404")? <div>STATUS 404</div>:null}
                {(this.state.render && this.state.status=="exit")? <div>room ended by admin.</div>:null}
                {(this.state.render && this.state.status=="303")? <div>you've been removed from this room.</div>:null}

                {(this.state.render && this.state.status =="200" )?
        
                        <div class="chatroom-view">
                        
                        <div class="title-view">
            
            <span class="title-text">{this.state.room.roomName}</span>
            {/*this.state.isAdmin?
                <p class="title-leave-btn"  onClick={this.endRoom.bind(this)}>end room</p>:
                <p class="title-leave-btn"  onClick={this.leaveRoom.bind(this)}>leave</p>
            */ }
        {this.state.isAdmin?
                <span onClick={()=>this.showModal("end-room")}class="leave-text">end</span>:
                <span onClick={this.leaveRoom.bind(this)} class="leave-text">leave</span>
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
                                    isUser={UserService.getUserID()=== msg.userToken }/>)}
                                       <div style={{ float:"left", clear: "both" }}
                                ref={(el) => { this.messagesEnd = el; }}>
                            </div>
                            </div>
                                :null
                                 }
                
                            </div>
                         
                        <div class="typed-message-view">
                            <textarea
                                class="typed-message-input"
                                ref={c => (this.textarea = c)}
                                rows={3}
                                defaultValue=""
                                value={this.state.newMessage} 
                                onChange={this.updateNewMessage.bind(this) }
                                class="typed-message-input"
                                />
            
                            
                                <i class="material-icons send-message-btn" 
                                    onClick={this.sendMessage.bind(this)}
                                ><FaTelegramPlane/></i>
                                <span className="character-count">{this.state.newMessage.length}/{this.MaxMessageLength}</span>
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

            </div>






        );

        
    }
    
}

export default withRouter(Chat);
