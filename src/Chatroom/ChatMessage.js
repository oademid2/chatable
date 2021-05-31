
import './ChatMessage.css';
import { FaGrin, FaExclamationCircle } from "react-icons/fa";
import{ useState} from 'react';



function ChatMessage(props) {

  const [showReactions, setShowReactions] = useState(false)
  const reactionOptions = ['❤️', '😂', '🥴']


  function onToggleReactions(){
    setShowReactions(!showReactions)
  }

  function countEmoji(emoji){
      let list = props.reactions.filter(obj => obj.emoji == emoji)
      if(list)return list.length
      else return 0
  }


  function reacted( tkn ){
    let react = props.reactions.find(obj => obj.by == tkn)
    if(react) return react.emoji
    else return false
  }




  return (
      
    <div className={"chat-message-view "+ (props.isUser?"user":" ")}>

            <div className="chat-message-text-view">
              <div className="header">
                <p class="username-text"  onClick={props.onClick}>{props.userName}</p> 
                {/*!props.isUser?<FaGrin  className="show-reaction-button" onClick={onToggleReactions} ></FaGrin>:null*/}

                <div class={"reaction-options "+ (showReactions?"cshow":"chide")}>
                      {   reactionOptions.map(
                                emoji =>{
                                    let code = emoji
                                    return(
                                      <span key={emoji} onClick={()=>{props.onAddReaction(emoji); onToggleReactions()}} className="option">
                                        {code}
                                      </span> 
                                    )
                                }
                          )}
                  </div>


                <div class={"username-text reaction-bar "}>
                      {reactionOptions.map((emoji)=>{
                      let count = countEmoji(emoji)
                      if(count > 0)return(
                  
                            <span class={"reaction-tracking"} key={emoji}>
                              <span class={"reaction-emoji"}>{count> 0? emoji: ""}</span>
                            <span class={"reaction-count"} >{count}</span>
                          </span>
                      )
                    })
                  }
              </div>
              </div>
              
              <p className={"chat-message-text "+ (props.isUser?"user":" ")}>
                  {props.text}
              </p>
  
        </div>

        <div className="options-left-view">
        {!props.isUser?<FaGrin  className="" onClick={onToggleReactions} ></FaGrin>:null}

        </div>

        
        
      





    </div>
    );
}

export default ChatMessage;


/*

  function readEmoji(emoji){
    if(emoji[0] != '&')return emoji
    let pair = emoji.substring(1).split('&');
    return pair
  }


  //if(emoji[0] != '&')code = String.fromCodePoint(emoji)
  //else code = String.fromCodePoint.apply(String, readEmoji(emoji))

*/