const users = []

// addUser, removeUser, getUsers, getUsersInRoom

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate data
    if( !username || !room){
        return{
            error : 'Username and room are required!'
        }
    } 

    // check for existing users
    const existingUsers = users.find((user)=>{
        return user.room === room && user.username === username
    });

    // validate username 
    if(existingUsers){
        return{
            error:'Username is in use!'
        }
    }

    // store user
    const user = { id, username, room};
    users.push(user)

    return { user } ;

}

// remove a user
const removeUser = (id)=>{
    const index = users.findIndex(( users )=> users.id === id);

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

// get a user
const getUser = (id)=>{
    return users.find((users) => users.id === id);
}

// get all users in a room
const getUsersInRoom = (room) => {
    return users.filter((users) => users.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};