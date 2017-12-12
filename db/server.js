'use strict';

const http = require('http')
  , express = require('express')
  , app = express()
  , NeDB = require('nedb')
  , mongoose = require('mongoose');

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
db.logs = new NeDB({ filename: 'logsFile' });
// オファーリスト
db.offers = new NeDB({ filename: 'offersFile'});
// トレードリスト
db.trades = new NeDB({ filename: 'tradesFile'});
db.users.loadDatabase();
db.logs.loadDatabase();
db.offers.loadDatabase();
db.trades.loadDatabase();

// Mongoose
// let Schema = mongoose.Schema;
// // Market asset
// let MAssetSchema = new Schema({
//   player: Number,
//   asset: Number,
//   amount: Number,
//   value: Number,
//   isSoldout: Boolean,
//   isCancel: Boolean,
//   date: Date
// })
// mongoose.model('MAsset', MAssetSchema);
//
// let MAsset = mongoose.model('MAsset');
// // Player
// let UserSchema = new Schema({
//   player: Number,
//   balance: Number,
//   assetsBalance: []
// })
// mongoose.model('User', UserSchema);
// mongoose.connect('mongodb://localhost/user');
// let User = mongoose.model('User');


// Socket.io
let io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  console.log('connected');

  // アプリ側から送られるデータでプレイヤー情報を初期化
  socket.on('init_player_data', (stateObj) => {
    // idの付与
    db.users.find({}, (err, docs) => {
      console.log(docs.length);
      stateObj.id = docs.length;
      db.users.insert({'p': stateObj}, (err) =>{
        db.users.find({'p.id':stateObj.id}, (err, docs) => {
          socket.emit('catch_inited_player', docs);
        })
      });
    })
  
  });

  // すでに登録されているプレイヤー情報を更新
  socket.on('set_player_status', (stateObj) => {
    db.users.update({'p.id':stateObj.id}, {$set:{'p': stateObj}}, (err) =>{
      db.users.find({'p.id':stateObj.id}, (err, docs) => {
        socket.emit('catch_player_status', docs);
      })
    });
  });

  // 全てのプレイヤーの情報を送信
  socket.on('get_players_list',() => {
    db.users.find({}, (err, docs) => {
      socket.emit('catch_players_list', docs);
    })
  })

  // オファーリストの追加
  socket.on('add_offers_list', (obj) => {
    db.offers.insert({'c':obj}, (err) => {
      db.offers.find({}, (err, docs) => {
        socket.emit('catch_offers_list', docs);
        socket.broadcast.emit('catch_offers_list', docs);
      })
    });
  })

  socket.on('update_offer_data', (msg) => {
    db.offers.update({_id: msg[0]}, {$set:{'c': msg[1]}}, (err) => {
      db.offers.remove({'c.of_f': null,'c.of_t': null}, { multi: true }, (err)=>{
        db.offers.remove({'c.limit': {$lt: 0}}, { multi: true }, (err)=>{
          db.offers.find({}, (err, docs) => {
            socket.emit('catch_offers_list', docs);
            socket.broadcast.emit('catch_offers_list', docs);
          })
        })
      });
    })
  })

  socket.on('add_trades_list', (obj) => {
    db.trades.insert({'t': obj}, (err) => {
      db.trades.find({}, (err, docs) => {
        socket.emit('catch_trades_list', docs);
        socket.broadcast.emit('catch_trades_list', docs);
      })
    })
  })

  socket.on('update_trade_data', (msg) => {
    db.trades.update({_id: msg[0]}, {$set:{'t': msg[1]}}, (err)=> {
      db.trades.remove({'t.fr': null,'t.to': null}, { multi: true }, (err)=>{
        db.trades.find({}, (err, docs) => {
          socket.emit('catch_trades_list', docs);
          socket.broadcast.emit('catch_trades_list', docs);
        })
      });
    })
  })

  socket.on('set_transaction', (msg) => {
    socket.broadcast.emit('catch_transaction', msg);
  })

  socket.on('tx_transaction', (msg) => {
    socket.emit('catch_trust_transaction', msg);
    socket.broadcast.emit('catch_trust_transaction', msg);
  })



  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});
