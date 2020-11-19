const users = [];

const addUser = ({ id, userName, roomCode, roomName }) => {
    if(userName)
    {
        userName = userName.trim().toLowerCase();
        userName = userName.charAt(0).toUpperCase() + userName.slice(1)
    }
    if(roomCode)
    roomCode = roomCode.trim().toLowerCase();
    if(roomName)
    roomName = roomName.trim().toLowerCase();

    if (!userName || !roomCode) return { error: 'Username and room code are required.' };

    let isAdmin = false
    if(!roomName)
    {
    const roomExists = users.find((user) => user.roomCode === roomCode)
    if(roomExists)
    {
        for(let i = 0; i < users.length; i++)
        {
            if(users[i].roomCode === roomCode)
            {
                roomName = users[i].roomName;
                break
            }
        }
        const existingUser = users.find((user) => user.roomCode === roomCode && user.userName === userName);
        if (existingUser) return { error: 'this user already exists' };
    }
    else
    {
        return {error: "Invalid room code"}
    }
    }
    else
    {
        console.log("admin ki value change hori")
        isAdmin = true
    }
    const user = { id, userName, roomCode, roomName, isAdmin};

    users.push(user);

    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (roomCode) => users.filter((user) => user.roomCode === roomCode);

const getUsers = () => {return users;}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, getUsers };
