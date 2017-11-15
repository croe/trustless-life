import React, {Component} from 'react'
import {Link} from 'react-router';
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'
import Modal from 'react-modal'
import swal from 'sweetalert'
import store from 'store';
import _ from 'lodash';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      componentModalIsOpen: false,
      controlModalIsOpen: false,
      scanFlg: true
    }
    this.componentHandleScan = this.componentHandleScan.bind(this)
  }

  componentHandleScan(data){
    let it = this;
    let json = JSON.parse(data);
    if(data && it.state.scanFlg){
      console.log(json);
      it.setState({scanFlg: false});
        // Initialize Player
      if (json.x === 1) {
        it.props.player.id = json.p;
        it.props._it.setState({ player: it.props.player});
        store.set('player', it.props.player);
        it.props._it.setUserStatus();
        console.log(it.props.player);
        swal({title: 'Success'}).then((agree)=>{
          if (agree){
            it.closeComponentModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          }
        });
      }
      if (json.x === 3){
        // Mapに乗った時の判定、Mapタイル自体が消費コスト（赤１）
        // 違う都市タイルに乗った時の判定、消費コスト（黄１）
      }
      if (json.x === 6) {
        it.props._it.getAllAssets();
      }

    }
  }

  openCtrlModal(){ this.setState({ controlModalIsOpen: true })}
  closeCtrlModal(){ this.setState({ controlModalIsOpen: false })}
  openComponentModal(){ this.setState({ componentModalIsOpen: true })}
  closeComponentModal(){ this.setState({ componentModalIsOpen: false })}
  handleError(err) { console.log(err)}

  /**
   * テスト用
   */

  changeVal(){
    let it = this;
    it.props.player.st.confirmedTrust += 10;
    it.props._it.setState({player: it.props.player});
    it.props._it.setUserStatus();
  }
  viewPlayers(){
    let it = this;
    it.props._it.getUsersStatus();
    console.log(it.props.players)
  }

  render() {
    const previewStyle = {
      heigth: 240,
      width: 320
    }
    const customStyles = {
      overlay : { background: 'rgba(0,0,0, .4)' },
      content : {
        top : '50%',
        left : '50%',
        right : 'auto',
        bottom : 'auto',
        marginRight : '-50%',
        transform : 'translate(-50%, -50%)',
        width : '72%',//openしているコンテンツの幅を変える,
        zIndex: '100'
      }
    };
    return (
      <div className="app">
        <header onClick={this.openCtrlModal.bind(this)} />
        <main className="container">
          <h1>{'Player' + (this.props.player.id + 1)}</h1>
          <div>
            <Modal
              isOpen={this.state.controlModalIsOpen}
              style={customStyles}
              contentLabel="Controls"
            >
              <button onClick={this.openComponentModal.bind(this)}>読み込み</button>
              <button onClick={this.closeCtrlModal.bind(this)}>閉じる</button>
              <button onClick={this.changeVal.bind(this)}>変化</button>
              <button onClick={this.viewPlayers.bind(this)}>閲覧</button>
            </Modal>
            <Modal
              isOpen={this.state.componentModalIsOpen}
              style={customStyles}
              contentLabel="Components"
            >
              <h1>コンポーネント読み込み</h1>
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.componentHandleScan}
              />
              <button onClick={this.closeComponentModal.bind(this)}>閉じる</button>
            </Modal>
          </div>
        </main>
      </div>
    );
  }
}

export default Index