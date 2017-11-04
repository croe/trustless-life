import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import store from 'store';

import Index from './index';

const milkcocoa = new MilkCocoa('hotj8ru7jps.mlkcca.com');
const dsOffers = milkcocoa.dataStore('offers');
const dsHomes = milkcocoa.dataStore('homes');
const dsCars = milkcocoa.dataStore('cars');


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
      homelist: [],
      myhomelist: []
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
  }

  componentDidMount(){
    let it = this;

    /**
     * Initialize Milkcocoa
     * Add Events
     */

    dsOffers.on('set',function(set){
      store.set('offer', set.value.content)
      it.setState({ oflist: set.value.content })
    })

    dsHomes.on('set', function(set){
      store.get('homes', set.value.content);
      it.setState({ homelist: set.value.content })
    })

  }

  render() {
    let cls = 'wrapper '+ 'gene' + this.state.gene;
    return (
      <div className={cls}>
        {this.props.children && React.cloneElement(this.props.children, {
          _it: this,
          isHandshake: this.state.isHandshake,
          mcIns: this.state.mcIns,
          dsOffers: this.state.dsOffers,
          dsHomes: this.state.dsHomes,
          dsCars: this.state.dsCars,
          player: this.state.player,
          gene: this.state.gene,
          mlist: this.state.mlist,
          oflist: this.state.oflist,
          complist: this.state.complist,
          homelist: this.state.homelist,
          myhomelist: this.state.myhomelist
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
