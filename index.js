require("dotenv").config(); 
const app       = require("./app/config/app");
const http = require(`http`).Server(app)
const io = require('socket.io')(http);

const base_url  = process.env.BASE_URL || 'http://127.0.0.1';
const port      = process.env.PORT || 4000;
 var livescore = 10000;

 const activeUsers = new Set();
 var sell = setInterval(function() {
   console.log(livescore);
   if (livescore >= 60000) {
     console.log("Sold out");
     clearInterval(sell);
   }
   else {
     livescore += 50;
   }
 }, 1000);
io.on("connection", function (socket) {
  console.log("new socket connection");
  socket.broadcast.emit('score',{scoreis:`Score is :${livescore}`})
  
  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });
});
http.listen(port, () => {
  console.log(`Server is Running at ${base_url}:${port}`);
});