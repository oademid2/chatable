


class UserService  {


    static user = {
        userName:"TEST",
        userID:""
    }

    static token(){
        return this.user.userID
        //return localStorage.getItem("userID")
    }

    static getUserID(){
        return this.user.userID
        //return localStorage.getItem("userID")
    }

    static setUserID(ID){
        this.user.userID = ID
        //localStorage.setItem("userID", ID)
    }

    static getUser(){
        
        return this.user;
        //return {userName: localStorage.getItem("userID"), userID: this.token()}
    }


    static user(){
        
        return this.user;
        //return {userName: localStorage.getItem("userID"), userID: this.token()}
    }

    static userName(){
        
        return this.user.userName;
        //return {userName: localStorage.getItem("userID"), userID: this.token()}
    }

    static isLoggedIn(){
        //if(localStorage.getItem("userID"))
        return false
    }

    static login(user){
        this.user = {...user} 
        //localStorage.setItem("userName", user.userName)
        //localStorage.setItem("userID", user.userID)
        console.log("user logged in: ", user.userID)
    }




}



export default UserService