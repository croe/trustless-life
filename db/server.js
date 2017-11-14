'use strict';

const http = require('http')
  , express = require('express')
  , app = express()
  , NeDB = require('nedb');

// サーバー始動
let server = http.createServer(app);
server.listen(3030, () => {
  console.log('https://localhost:3030/');
});

// NeDB
let db = {};
db.users = new NeDB({
  filename: 'usersFile'
});

db.users.loadDatabase();

/*
db.users.insert({name: 'huge'});
db.users.insert({name: 'fuga'});
db.users.insert({name: 'hoge'});
*/

db.users.find({name: 'fuga'}, function (err, docs) {
  console.log("[FIND]");
  console.log(docs);
});

// Socket.io
let io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  console.log('connected');
  socket.on('disconnect', function () {
    console.log('disconnected');
  })

});
