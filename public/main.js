const messageContainer = document.getElementById('messages');
const msgOutline = document.getElementById('msg-outline');

const input = document.getElementById('msg');
const submitBtn = document.getElementById('submit');

const allUserNum = document.getElementById('all');
const currentUserNum = document.getElementById('current');

const allUserNumMobile = document.getElementById('allMobile');
const currentUserNumMobile = document.getElementById('currentMobile');
// Get username from URL

const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username);

const socket = io();

// Join room
socket.emit('joinRoom', {username});

// Change number of users
socket.on('changeStats', (connectedUsers, allTimeUsers) => {
    changeStats(connectedUsers, allTimeUsers);
    updateChart(connectedUsers, allTimeUsers);
});

// Message from server
socket.on('send-message', message => {
    outputMessage(message);
});

socket.on('send-message-sender', message => {
    outputMessageSender(message);
});

submitBtn.addEventListener("click", (e) => {
    const msg = input.value;
    // Emmit message to server
    e.preventDefault();
    socket.emit('send-message-sender', msg);
    socket.emit('send-message', msg);

    messageContainer.scrollTop = messageContainer.scrollHeight;
});

// Update chart numbers
function updateChart (connectedUsers, allTimeUsers){
    myChart.config.data.datasets[0].data[1] = allTimeUsers;
    myChart.config.data.datasets[0].data[0] = connectedUsers;
    myChart.update();

    myChartMobile.config.data.datasets[0].data[1] = allTimeUsers;
    myChartMobile.config.data.datasets[0].data[0] = connectedUsers;
    myChartMobile.update();
}

// Change number of current users and all time users
function changeStats (connectedUsers, allTimeUsers){
    allUserNum.textContent = allTimeUsers;
    currentUserNum.textContent = connectedUsers;

    allUserNumMobile.textContent = allTimeUsers;
    currentUserNumMobile.textContent = connectedUsers;
}


// Output message to dom to all except sender
function outputMessage (message){
    const date = new Date();
    const formatedTime = moment(date).format("HH:mm");
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${formatedTime}</span></p> <p>${message.text}</p>`
    input.value = ' ';
    document.querySelector('.msg-outline').append(div);
}

// Output message to dom only to sender
function outputMessageSender (message){
    const date = new Date();
    const formatedTime = moment(date).format("HH:mm");
    const div = document.createElement('div');
    div.classList.add('message-sent');
    div.innerHTML = `<p class="meta">${message.username}<span>${formatedTime}</span></p> <p>${message.text}</p>`
    input.value = ' ';
    document.querySelector('.msg-outline').append(div);
}