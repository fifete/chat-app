const socket = io();
const form = document.querySelector('form');
const input = document.querySelector('#m');
const messages = document.querySelector('#messages');
const name = prompt('What is your name?');

console.log('hola socketdom');

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
  socket.emit('chat message', message);
  input.value = '';
});
socket.on('chat message', (data) => {
  appendMessage(`${data}`);
});

