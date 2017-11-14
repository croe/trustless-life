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
      // it.setState({scanFlg: false});
      // it.setState({scanFlg: true});
      }
    }

  openCtrlModal(){ this.setState({ controlModalIsOpen: true })}
  closeCtrlModal(){ this.setState({ controlModalIsOpen: false })}
  openComponentModal(){ this.setState({ componentModalIsOpen: true })}
  closeComponentModal(){ this.setState({ componentModalIsOpen: false })}
  handleError(err) { console.log(err)}

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
          <div>
            <Modal
              isOpen={this.state.controlModalIsOpen}
              style={customStyles}
              contentLabel="Controls"
            >
              <button onClick={this.openComponentModal.bind(this)}>読み込み</button>
              <button onClick={this.closeCtrlModal.bind(this)}>閉じる</button>
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

// TODO: ミッションを特定のプレイヤーにオファーする　→　同じ町にいないとできない制限をつける？ →　今はしない
// TODO: →体力・知力・信用度などのパラメータ調整（個別で？）、同タイミングでの処理？

// TODO: オファーを双方が可能にならないと実行されない仕様に変更 -> 難しいので後で
// TODO: 自分の借りている家を貸し出す処理、借りている状態も保持する？ -> 難しいので後で
// TODO: カーシェアの処理
