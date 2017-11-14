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
        "id": 0,
        "status": {
          "str": 0,
          "int": 0,
          "mov": 1,
          "trs": 100,
          "val": 10
        }
      },
      players: [],
    }
  }

  componentWillMount() {
    let it = this;

    /**
     * Initialize Status
     */

    let _io = io('http://localhost:3030/');
    // let _io = io(); // for Production

    _io.on('connect', () => {
      it.setState({
        socketIns: _io,
        isHandshake: true
      });

      _io.on('getUserData',(msg) => {
        console.log(msg);
      })
    })

  }

  componentDidMount(){
    let it = this;

    /**
     * Initialize Milkcocoa
     * Add Events
     */


  }

  render() {
    let cls = 'wrapper '+ 'city' + this.state.lastPoscity;
    return (
      <div className={cls}>
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
