var socket=io();

var form=document.getElementById("form");
var input=document.getElementById("input");
var nickname='';
var typingTimout;

//adding a nickname
while(!nickname){
  nickname=prompt('what is your nickname:');
}
//function to display typing status
function displayTypingstatus(user){
  document.getElementById("typingStatus").textContent=user ? `${user} is typing...`:'';
}

//event listener for typing status
input.addEventListener('input',function(){
  socket.emit('typing');
  clearTimeout(typingTimout);

  //set a new timeout to clear the typing status 
  typingTimout=setTimeout(function(){
    displayTypingstatus('');
  },1500);
})

//function for online users
function displayonlineuser(onlineUsers){
  document.getElementById("onlineUsers").textContent=`Online Users: ${onlineUsers.join(', ')}`;
}

//event listener for submit function
form.addEventListener('submit',function(e){
  e.preventDefault();
})

socket.emit('set Nickname',nickname);

socket.on('userconnected',(userId) =>{
console.log('User connected :' +userId);
})

socket.on('userdisconnected',(userId) =>{
console.log("user disconnected:" +userId);
})

socket.on('typing',function(user){
  displayTypingstatus(user);
})

//Listen for online users
socket.on('onlineUsers',function(onlineUsers){
  displayonlineuser(onlineUsers);
})

form.addEventListener('submit',function(e){
e.preventDefault();

if(input.value){
  socket.emit('chat message',input.value);
  input.value='';
  clearTimeout(typingTimout);
 }
});
  socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg.nickname +": "+msg.msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});