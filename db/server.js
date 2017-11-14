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
// プレイしてるプレイヤーの情報を登録する
db.users = new NeDB({ filename: 'usersFile' });
// 流通している全てのアセットの状態を登録する
db.assets = new NeDB({ filename: 'assetsFile' });
db.users.loadDatabase();
db.assets.loadDatabase();
// Socket.io
let io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log('connected');

  socket.on('setUserStatus', (stateObj) => {
    db.users.update({'p.id':stateObj.id}, {$set:{'p': stateObj}}, { upsert: true }, (err) =>{
      db.users.find({'p.id':stateObj.id}, (err, docs) => {
        socket.emit('catchUserStatus', docs);
      })
    });
  });

  socket.on('getUsersStatus', (_id) => {
    db.users.find({}, (err, docs) => {
      socket.emit('catchUsersStatus', docs);
    });
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});
