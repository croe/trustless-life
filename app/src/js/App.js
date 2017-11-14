import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import store from 'store';
import _ from 'lodash';

import Index from './index';

const milkcocoa = new MilkCocoa('hotj8ru7jps.mlkcca.com');
const dsOffers = milkcocoa.dataStore('offers');
const dsHomes = milkcocoa.dataStore('homes');
const dsCars = milkcocoa.dataStore('cars');
const dsTrades = milkcocoa.dataStore('trades');
const dsMoney = milkcocoa.dataStore('moneys');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHandshake: false,
      isCompleteInitialize: false,
      mcIns: milkcocoa,
      dsOffers: dsOffers,
      dsHomes: dsHomes,
      dsCars: dsCars,
      dsTrades: dsTrades,
      dsMoney: dsMoney,
      player: {
        "id": 0,
        "status": {
          "str": 0,
          "int": 0,
          "mov": 1,
          "trs": 100,
          "val": 10
        },
        "max": {
          "str": 3,
          "int": 3
        }
      },
      gene: 1,
      mlist: [],
      oflist: [],
      complist: [],
      tradelist: [],
      homelist: [],
      myhomelist: [],
      moneylist: [],
      carlist: [],
      lastPoscity: 0,
      allowMove: 0,
    }
  }

  componentWillMount() {
    let it = this;

    /**
     * Initialize Status
     */
    let st = store.get('player');
    if (st !== undefined){
      it.setState({ player: st })
    }
    let gn = store.get('gene');
    if (gn !== undefined){
      it.setState({ gene: gn });
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
    // 厳密な処理には必要だけど、こんがらがる？
    let aw = store.get('arwmove');
  }

  componentDidMount(){
    let it = this;

    /**
     * Initialize Milkcocoa
     * Add Events
     */

    // dsMoney.push({'content': []})
    /**
     * dsTrades: j9rxxrwt0000835
     * dsHomes: j9lua9qa000062p
     * dsOffers: j8w994qz00002jn
     * dsCars: j9rxxrwu0000hke
     * dsMoney: j9sh36z20000btf
     */

    dsOffers.on('set',function(set){
      console.log(set.value)
      store.set('offer', set.value.content)
      it.setState({ oflist: set.value.content })
    })

    dsHomes.on('set', function(set){
      console.log(set.value)
      store.set('homes', set.value.content);
      it.setState({ homelist: set.value.content })
    })

    dsTrades.on('set', function(set){
      console.log(set.value)
      store.set('trades', set.value.content);
      it.setState({ tradelist: set.value.content })
    })

    // 所持金のリアルタイム反映
    dsMoney.on('set', function(set){
      console.log(set.value)
      set.value.content.map((item, i)=>{
        if (item.id === it.state.player.id){
          // プレイヤー情報の更新
          it.state.player.status.val += parseInt(item.v);
          it.setState({player: it.state.player});
          store.set('player', it.state.player);
          // リストから決済情報の削除
          let pulled = _.pullAt(set.value.content, [i]);
          it.state.dsMoney.set('j9sh36z20000btf', {"content":set.value.content});
        }
      })
    })

  }

  render() {
    let cls = 'wrapper '+ 'city' + this.state.lastPoscity;
    return (
      <div className={cls}>
        {this.props.children && React.cloneElement(this.props.children, {
          _it: this,
          isHandshake: this.state.isHandshake,
          mcIns: this.state.mcIns,
          dsOffers: this.state.dsOffers,
          dsHomes: this.state.dsHomes,
          dsCars: this.state.dsCars,
          dsTrades: this.state.dsTrades,
          dsMoney: this.state.dsMoney,
          player: this.state.player,
          gene: this.state.gene,
          mlist: this.state.mlist,
          oflist: this.state.oflist,
          complist: this.state.complist,
          tradelist: this.state.tradelist,
          homelist: this.state.homelist,
          myhomelist: this.state.myhomelist,
          carlist: this.state.carlist,
          lastPoscity: this.state.lastPoscity,
          allowMove: this.state.allowMove
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
