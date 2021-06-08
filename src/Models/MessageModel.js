export default class Message{

    constructor(roomCode, message, userName, tkn, id,timestamp) { 
        this.roomCode = roomCode;
        this.message = message;
        this.userName = userName;
        this.messageID = id;
        this.userID = tkn;
        this.createdAt = timestamp;
        this.reactions = []
        this.reactors = {}
    }

}