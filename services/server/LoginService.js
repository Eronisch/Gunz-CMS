module.exports = function (session) {

   /* session.login = {
        userName : 'James',
        userId : 5
    };*/
    
    function isLoggedIn() {
        return session != null && session.login != null;
    }

    function getUsername() {
        return isLoggedIn() ? session.login.userName : null;
    }
    
    function getUserId() {
        return isLoggedIn() ? session.login.userId : null;
    }
    
    function setLogin(id, username) {
        session.login = {
            userName: username,
            userId: id
        }
    }
    
    return {
        isLoggedIn : isLoggedIn,
        getUsername : getUsername,
        getUserId : getUserId,
        setLogin : setLogin
    }
};
