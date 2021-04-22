/*
Author: Matt Selby
Resources: https://socket.io/docs/v4/index.html
           https://www.youtube.com/watch?v=jD7FnbI76Hg


              "Selbynet was developed as part of a
  capstone project at SUNY Polytechnic University, in Spring of 2021,
              under the supervision of Scott Spetka.">
*/

//Client-side Socket.IO

const chatBoxForm = document.getElementById('chatBoxForm');
const chatMessages = document.querySelector('chatMessages');

var socket = io();

socket.on('welcomeMessage', message => {
  console.log(message);
  outputMessage(message);
});

socket.on('message', message =>{
  console.log(message);
  outputMessage(message);
})

  //Message Send listener
  chatBoxForm.addEventListener('submit', (e) =>{
    e.preventDefault(); //by default, submits forms as a file (not what we want)

  let msg = e.target.elements.msg.value; //get message by id

  if(!msg){
    return false;
  }
  
  //log the message that client sends on server
  socket.emit('chatMessage', msg);

  //Clear chatBox input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//scrolling chatMessages box
chatMessages.scrollTop = chatMessages.scrollHeight;

//Output message function
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');

  div.innerHTML = `<p class="meta">User:</p>
  <p class="text">${message}</p`;
  document.querySelector('.chatBox').appendChild(div);
  console.log();
}


