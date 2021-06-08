


class UserService  {


    static user = {
        userName:"TEST",
        userID:"0"
    }

    static isLoggedIn(){
        if(this.user.status)return true
        else return false
    }

    static anonLogin(userName){
        this.user = {
            userName: userName,
            status: "anon",
            userID:0
        }

        localStorage.setItem("userName", userName)

        return this.user
         

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

    static token(){
        return this.user.userID
        //return localStorage.getItem("userID")
    }

    static user(){
        
        return this.user;
        //return {userName: localStorage.getItem("userID"), userID: this.token()}
    }

    static userName(){
        
        return this.user.userName;
        //return {userName: localStorage.getItem("userID"), userID: this.token()}
    }



    static login(user){
        this.user = {...user} 
        //localStorage.setItem("userName", user.userName)
        //localStorage.setItem("userID", user.userID)
        console.log("user logged in: ", user.userID)
    }




}



export default UserService