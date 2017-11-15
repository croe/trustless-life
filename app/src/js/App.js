import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import store from 'store';
import io from 'socket.io-client';
import _ from 'lodash';

import Index from './index';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHandshake: false,
      isCompleteInitialize: false,
      socketIns: {},
      player: {
        "id": null,
        "st": {
          "power": 0,
          "intelligence": 0,
          "energy": 0,
          "confirmedTrust": 100,
          "unconfirmedTrust": 100
        }
      },
      players: [],
      assets: []
    }
  }

  componentWillMount() {
    let it = this;

    /**
     * Initialize Status from localstorage
     */

    let _p = (store.get('player') !== undefined)? store.get('player'):it.state.player;
    it.setState({player: _p});

    /**
     * Initialize Socket.io Instance
     */

    let _io = io('http://localhost:3030/');
    // let _io = io(); // for Production

    _io.on('connect', () => {
      it.setState({
        socketIns: _io,
        isHandshake: true
      });

      _io.on('catchUsersStatus',(msg) => {
        // getUsersStatusの返却値
        it.setState({
          players: msg
        })
      })
    })

  }

  componentDidMount(){
    let it = this;

  }

  getUsersStatus(){
    // 全てのプレイヤーの情報を取得する
    let it = this;
    if (it.state.isHandshake){
      it.state.socketIns.emit('getUsersStatus');
    }
  }

  setUserStatus(){
    // 現在のプレイヤー情報をDBに保存する
    let it = this;
    store.set('player', it.state.player);
    if (it.state.isHandshake){
      it.state.socketIns.emit('setUserStatus', it.state.player);
    }
  }

  setOtherUserStatus(_id, _status){
    // 他のプレイヤーの情報を更新する
    let it = this;
    if (it.state.isHandshake){
      it.state.socketIns.emit('getUsersStatus');
    }
  }

  getAllAssets(){
    let it = this;
    if(it.state.isHandshake){
      it.state.socketIns.emit('getAllAssets');
    }
  }

  render() {
    return (
      <div>
        {this.props.children && React.cloneElement(this.props.children, {
          _it: this,
          isHandshake: this.state.isHandshake,
          socketIns: this.state.socketIns,
          player: this.state.player,
          players: this.state.players
        })}
      </div>
    )
  }


}

render((
    <Router history={browserHistory}>
      <Route path="/" components={App}>
        <IndexRoute components={Index}/>
        <Route path="/config" component={Index}/>
      </Route>
    </Router>
  ), document.getElementById('root')
);
