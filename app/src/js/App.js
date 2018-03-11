import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import store from 'store';
import io from 'socket.io-client';
import _ from 'lodash';
import swal from 'sweetalert';

import Index from './index';
import Login from './login';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHandshake: false,
      isCompleteInitialize: false,
      isInitPlayer: false,
      lang: 'en',
      IO: {},
      player: {
        "id": 0,
        "name": null,
        "city": 0,
        "slam": false,
        "status": {
          "str": 2,
          "int": 2,
          "mov": 0,
          "trs": 100,
          "val": 10
        },
        "max": {
          "str": 2,
          "int": 2
        }
      },
      plist:[],
      mlist: [],
      oflist: [],
      complist: [],
      tradelist: [],
      homelist: [],
      myhomelist: [],
      moneylist: [],
      carlist: [],
      trustlist: [],
      lastPoscity: 0,
      allowMove: null,
      rideFlg: false,
      markerTrust: 1
    }
  }

  componentWillMount() {
    let it = this;

    // let _io = io('http://192.168.1.185:3030/');
    // let _io = io('http://localhost:3030/');
    let _io = io(); // for Production

    _io.on('connect', () => {
      it.setState({
        IO: _io,
        isHandshake: true
      });
      it.getPlayersList()

      _io.on('catch_player_status', (msg) => {
        console.log(msg);
      })

      _io.on('catch_inited_player', (msg) => {
        console.log(msg[0].p);
        it.setState({ player: msg[0].p});
        store.set('player', it.state.player);
        swal({ title: 'Welcome! ' + msg[0].p.name + ' さん' })
      })

      _io.on('catch_players_list', (msg) => {
        console.log(msg);
        it.setState({ plist: msg});
        store.set('plist', msg);
      })

      _io.on('catch_offers_list', (msg) => {
        console.log(msg);
        it.setState({ oflist: msg});
        store.set('offer', it.state.oflist);
      })

      _io.on('catch_trades_list', (msg) => {
        console.log(msg);
        it.setState({ tradelist: msg});
        store.set('trades', it.state.tradelist);
      })

      _io.on('catch_transaction', (msg) => {
        console.log(msg);
        if(msg[0] === it.state.player.id){
          if(msg[1] === 'val'){
            it.state.player.status.val += msg[2];
          }
          it.setPlayerStatus();
        }
      })

      _io.on('catch_trust_transaction', (msg) =>{
        console.log(msg)
        // 信用に関する登録が行われた時の処理
        if (msg.dir === 0) {
          it.setState({ markerTrust: 's' });
        } else if (msg.dir === -1) {
          it.setState({ markerTrust: 'd' });
        } else if (msg.dir === 1) {
          it.setState({ markerTrust: 'u' });
        }
      })

    })

    /**
     * Initialize Status
     */
    let lng = store.get('lang');
    if (lng !== undefined){
      it.setState({ lang: lng });
    }
    let st = store.get('player');
    if (st !== undefined){
      it.setState({ player: st })
    }
    let ml = store.get('mission');
    if (ml !== undefined){
      it.setState({ mlist: ml });
    }
    let cm = store.get('complete');
    if (cm !== undefined){
      it.setState({ complist: cm });
    }
    let of = store.get('offer');
    if (of !== undefined){
      it.setState({ oflist: of });
    }
    let hm = store.get('homes');
    if (hm !== undefined){
      it.setState({ homelist: hm});
    }
    let mhm = store.get('myhome');
    if (mhm !== undefined){
      it.setState({ myhomelist: mhm});
    }
    let pc = store.get('poscity');
    if (pc !== undefined){
      it.setState({ lastPoscity: pc });
    }
    let tr = store.get('trades');
    if (tr !== undefined){
      it.setState({ tradelist: tr});
    }
    let mn = store.get('moneys');
    if (mn !== undefined){
      it.setState({ moneylist: mn});
    }
    let cr = store.get('cars');
    if (cr !== undefined){
      it.setState({ carlist: cr});
    }
    let pl = store.get('plist');
    if (pl !== undefined) {
      it.setState({ plist: pl});
    }
    let ts = store.get('trust');
    if (ts !== undefined){
      it.setState({ trustlist: ts});
    }
    let am = store.get('arwmove');
    if (am !== undefined) {
      it.setState({ allowMove: am});
    }
    let rd = store.get('rideFlg');
    if (rd !== undefined) {
      it.setState({ rideFlg: rd});
    }
  }

  componentDidMount(){
    let it = this;

    /**
     * Initialize Milkcocoa
     * Add Events
     */


  }

  setPlayerStatus(){
    let it = this;

    it.setState({ player: it.state.player});
    store.set('player', it.state.player);
    it.state.IO.emit('set_player_status', it.state.player);

  }

  getPlayersList(){
    let it = this;

    it.state.IO.emit('get_players_list', '');
  }

  initPlayerData(_name){
    let it = this;

    // データベースにプレイヤー情報を登録、IDの発行と名前とのひも付けを行う
    it.state.player.name = _name;
    it.setState({ player: it.state.player});
    it.state.IO.emit('init_player_data', it.state.player);

  }

  addOffersList(_item){
    let it = this;

    it.state.IO.emit('add_offers_list', _item);
  }

  updateOfferData(_id, _item){
    let it = this;
    let msg = [_id, _item];

    it.state.IO.emit('update_offer_data', msg);
  }

  addTradesList(_item){
    let it = this;

    it.state.IO.emit('add_trades_list', _item);
  }

  updateTradeData(_id, _item){
    let it = this;
    let msg = [_id, _item];

    it.state.IO.emit('update_trade_data', msg);
  }

  setTransaction(tx){
    let it = this;
    tx.push(it.state.player.id);
    it.state.IO.emit('set_transaction', tx);
  }

  trustTransaction(tx){
    let it = this;
    it.state.IO.emit('tx_transaction', tx);
    it.state.trustlist.unshift(tx);
    it.setState({trustlist: it.state.trustlist});
    store.set('trust', it.state.trustlist)
  }

  render() {
    let cls = 'wrapper '+ 'city' + this.state.lastPoscity;
    return (
      <div className={cls}>
        {this.props.children && React.cloneElement(this.props.children, {
          _it: this,
          isHandshake: this.state.isHandshake,
          lang: this.state.lang,
          player: this.state.player,
          plist: this.state.plist,
          mlist: this.state.mlist,
          oflist: this.state.oflist,
          complist: this.state.complist,
          tradelist: this.state.tradelist,
          homelist: this.state.homelist,
          myhomelist: this.state.myhomelist,
          carlist: this.state.carlist,
          trustlist: this.state.trustlist,
          lastPoscity: this.state.lastPoscity,
          allowMove: this.state.allowMove,
          rideFlg: this.state.rideFlg,
          IO: this.state.IO,
          markerTrust: this.state.markerTrust
        })}
      </div>
    )
  }


}

render((
    <Router history={browserHistory}>
      <Route path="/" components={App}>
        <IndexRoute components={Login}/>
        <Route path="/config" component={Index}/>
        <Route path="/login" component={Index}/>
        <Route path="/play" component={Index}/>
      </Route>
    </Router>
  ), document.getElementById('root')
);
