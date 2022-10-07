/* eslint-disable prettier/prettier */
const socket = io();
const form = document.querySelector('form');
const input = document.querySelector('#m');
const messages = document.querySelector('#messages');
const name = prompt('What is your name?');

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messages.append(messageElement);
}

appendMessage('You joined');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value;
  appendMessage(`You: ${message}`);
  socket.emit('chat message', {
    text: message,
    name: 'user tester',
    id: `${socket.id}${Math.random()}`,
    socketID: socket.id,
  });
  input.value = '';
});
socket.on('chat message', (data) => {
  appendMessage(`${data.text}`);
});