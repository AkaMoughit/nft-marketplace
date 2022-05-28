const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const currentProfileId = document.getElementById('currentProfileId').innerText;
const otherParticipantId = document.getElementById('otherParticipantId').innerText;
const currentProfileName = document.getElementById('currentProfileName').innerText;
const otherParticipantName = document.getElementById('otherParticipantName').innerText;
const conversationId = document.getElementById('conversationId').innerText;

socket.on('message', message => {
    displayMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('msg').value = '';
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msgBody = document.getElementById('msg').value;
    const message =  {
        send_date: new Date(),
        body: msgBody,
        ProfileId : currentProfileId,
        ConversationId : conversationId
    }
    socket.emit('message', message);
    displayMessage(message);
    document.getElementById('msg').value = ''
})

function displayMessage(message) {
    let ownerName, messageClass;
    if (message.ProfileId === currentProfileId) {
        ownerName = currentProfileName;
        messageClass = 'messageCurrent';
    } else {
        ownerName = otherParticipantName;
        messageClass = 'messageParticipant';
    }
    const div = document.createElement('div');
    div.classList.add(messageClass);
    div.innerHTML = `<p class="meta">${ownerName}
                        <span>${new Date()}</span>
                        </p>
                        <p class="text">
                            ${message.body}
                        </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function emitJoin() {
    socket.emit('join', conversationId);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}