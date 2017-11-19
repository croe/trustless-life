import React, {Component} from 'react'
import {Link} from 'react-router';
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'
import Modal from 'react-modal'
import swal from 'sweetalert'
import store from 'store';
import _ from 'lodash';

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  initPlayerName(){
    let it = this;
    if (findDOMNode(it.refs.playerName).value.length === 0){
      return false;
    }
    if (store.get('player') !== undefined){
      return false;
    }
    let name = findDOMNode(it.refs.playerName).value
    it.props._it.initPlayerData(name);
    console.log(name);
  }

  render() {

    return (
      <div className="app login">
        <main className="container">
          <div className="form_login">
            <h1>TRUSTLESS LIFE</h1>
            <p>
              <input ref="playerName" type="text"/>
            </p>
            <p>
              <Link to={"/play"} onClick={this.initPlayerName.bind(this)}>Login</Link>
            </p>
          </div>
        </main>
      </div>
    );
  }
}

export default Login