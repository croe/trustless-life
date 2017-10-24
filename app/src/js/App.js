import React, {Component} from "react";
import {render} from "react-dom";
import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import store from 'store';

import Index from './index';

const milkcocoa = new MilkCocoa('hotj8ru7jps.mlkcca.com');
const dsOffers = milkcocoa.dataStore('offers');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isHandshake: false,
      isCompleteInitialize: false,
      mcIns: milkcocoa,
      dsOffers: dsOffers,
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
          "str": 0,
          "int": 0
        }
      },
      gene: 1,
      mlist: [],
      oflist: [],
      complist: [],
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
          player: this.state.player,
          gene: this.state.gene,
          mlist: this.state.mlist,
          oflist: this.state.oflist,
          complist: this.state.complist
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
