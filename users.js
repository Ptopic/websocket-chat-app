const users = [];

function userJoin(id, username) {
    const user = { id, username };
    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id == id);
}

module.exports = {
    userJoin,
    getCurrentUser
};