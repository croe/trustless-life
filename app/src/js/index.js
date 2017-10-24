import React, {Component} from 'react'
import {Link} from 'react-router';
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'
import Modal from 'react-modal'
import swal from 'sweetalert'
import store from 'store';
import _ from 'lodash';

import db_mission from './db_mission.json';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      dispModalIsOpen: false,
      initModalIsOpen: false,
      geneModalIsOpen: false,
      mapModalIsOpen: false,
      controlModalIsOpen: false,
      offerModalIsOpen: false,
      scanFlg: true,
      nowSelectedItem: {}
    }

    this.playerInitHandleScan = this.playerInitHandleScan.bind(this)
    this.componentHandleScan = this.componentHandleScan.bind(this)
  }

  componentHandleScan(data){
    let it = this;
    let json = JSON.parse(data);
    if(data && it.state.scanFlg){
      it.setState({scanFlg: false});
      if (json.x === 2) {
        console.log(json)
        // Set generation
        it.props._it.setState({gene: json.g});
        store.set('gene', it.props.gene);
        // Pay Cost
        let payFlgArr = [];
        json.c.map((item,i)=>{
          let f = _.forEach(item,(v, k)=>{
            // Keyのものを持っているか判定、なければFalseを返す
            let flg;
            if (k === "o1") {
              flg = (it.props.player.status.str >= v);
            } else if (k === "o2") {
              flg = (it.props.player.status.int >= v);
            } else if (k === "o3") {
              flg = (it.props.player.status.trs >= v);
            } else if (k === "o4") {
              flg = (it.props.player.status.val >= v);
            }
            payFlgArr.push(flg);
          })
        });
        console.log(payFlgArr)
        // payFlgArrに一つでもFalseが入っていたら購入処理しない
        if (_.includes(payFlgArr, false)) {
          new Audio("data:audio/wav;base64,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").play();
          swal ( {text: "コストがありません、カードを捨ててください。",  icon:"error" })
        } else {
          // 購入処理開始
          // 支払い処理
          json.c.map((item,i)=>{
            _.forEach(item,(v, k)=>{
              let flg;
              if (k === "o1") {
                it.props.player.status.str -= v;
              } else if (k === "o2") {
                it.props.player.status.int -= v;
              } else if (k === "o3") {
                it.props.player.status.trs -= v;
              } else if (k === "o4") {
                it.props.player.status.val -= v;
              }
            })
          });
          // 追加処理
          json.s.map((item, i)=>{
            _.forEach(item,(v, k)=>{
              let flg;
              if (k === "o1") {
                it.props.player.max.str += v;
              } else if (k === "o2") {
                it.props.player.max.int += v;
              } else if (k === "o3") {
                it.props.player.status.mov += v;
              }
            })
          })
          store.set('player', it.props.player);
          it.props._it.setState({player: it.props.player})
          swal ( {text: "処理完了しました！",  icon:"success" })
        }
        it.closeMapModal();
        it.closeCtrlModal();
        it.setState({scanFlg: true})
      }
      if (json.x === 3){
        console.log(json)
        if (json.s === 1){
          it.props.player.status.str = it.props.player.max.str;
          store.set('player', it.props.player);
          it.closeMapModal();
          it.closeCtrlModal();
          it.setState({scanFlg: true});
        }
        if (json.s === 2){
          it.props.player.status.int = it.props.player.max.int;
          store.set('player', it.props.player);
          it.closeMapModal();
          it.closeCtrlModal();
          it.setState({scanFlg: true});
        }
        if (json.s === 3){
          let sel, selcp;
          let arr = store.get('mission')? store.get('mission'): [];
          if (it.props.gene === 1){
            sel = Math.floor(Math.random() * db_mission[0].length);
            selcp = db_mission[0][sel];
            selcp.city = json.c;
            arr.push(selcp);
            store.set('mission', arr);
            it.props._it.setState({mlist: arr});
          } else if (it.props.gene === 2){
            sel = Math.floor(Math.random() * db_mission[1].length);
            selcp = db_mission[1][sel];
            selcp.city = json.c;
            arr.push(selcp)
            store.set('mission', arr);
            it.props._it.setState({mlist: arr});
          } else if (it.props.gene === 3){
            sel = Math.floor(Math.random() * db_mission[2].length);
            selcp = db_mission[2][sel];
            selcp.city = json.c;
            arr.push(selcp)
            store.set('mission', arr);
            it.props._it.setState({mlist: arr});
          }
          it.closeMapModal();
          it.closeCtrlModal();
          it.setState({scanFlg: true});
        }
      }
    }
  }
  playerInitHandleScan(data){
    let it = this;
    let json = JSON.parse(data);
    if (data !== null) {
      if (json.x === 1){
        it.props.player.id = json.p;
        it.props._it.setState({player: it.props.player})
        store.set('player', it.props.player)
        it.closeInitModal();
        it.closeCtrlModal();
      }
    }
  }
  doMissionHandleClick(event, item, i) {
    let it = this;
    if (it.props.player.status.str >= item.req[0]
      && it.props.player.status.int >= item.req[1]
      && it.props.player.status.trs >= item.req[2]){
      // 成否判定 ->
      if (100 - item.rate < Math.floor(Math.random() * 101)){
        // 成功ならコスト払って報酬と信用を獲る
        swal ( {text: "ミッション成功しました！",  icon:"success" })
        it.props.player.status.str = it.props.player.status.str - item.req[0];
        it.props.player.status.int = it.props.player.status.int - item.req[1];
        it.props.player.status.trs = it.props.player.status.trs + item.req[2] / 10;
        it.props.player.status.val = it.props.player.status.val + item.res;
        store.set('player', it.props.player)
        // ミッション完了で完了リストに保存される
        it.AddCompleteMission(item.gen ,item.city);

      } else {
        // 失敗なら信用がなくなるだけ
        new Audio("data:audio/wav;base64,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").play();
        swal ( {text: "ミッションに失敗しました...",  icon:"error" })
        it.props.player.status.trs = it.props.player.status.trs - 5;
        store.set('player', it.props.player)
      }
      let pulled = _.pullAt(it.props.mlist, [i]);
      console.log(it.props.mlist)
      it.props._it.setState({mlist: it.props.mlist});
      store.set('mission', it.props.mlist);
      it.props._it.setState({player: it.props.player})
    } else {
      swal ( {text: "実行できる状態ではありません！",  icon:"warning" })
    }
  }
  doOfferHandleClick(event, item, i){
    let it = this;
    if (it.props.player.status.str >= item.req[0]
      && it.props.player.status.int >= item.req[1]
      && it.props.player.status.trs >= item.req[2]){
      // 成否判定 ->
      if (100 - item.rate < Math.floor(Math.random() * 101)){
        // 成功ならコスト払って報酬と信用を獲る
        swal ( {text: "ミッション成功しました！",  icon:"success" })
        it.props.player.status.str = it.props.player.status.str - item.req[0];
        it.props.player.status.int = it.props.player.status.int - item.req[1];
        it.props.player.status.trs = it.props.player.status.trs + Math.floor(item.req[2] / 10);
        it.props.player.status.val = it.props.player.status.val + item.res;
        store.set('player', it.props.player)
        // ミッション完了で完了リストに保存される
        it.AddCompleteMission(item.gen ,item.city);

      } else {
        // 失敗なら信用がなくなるだけ
        new Audio("data:audio/wav;base64,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").play();
        swal ( {text: "ミッションに失敗しました...",  icon:"error" })
        it.props.player.status.trs = it.props.player.status.trs - 5;
        store.set('player', it.props.player)
      }
      let pulled = _.pullAt(it.props.oflist, [i]);
      console.log(it.props.oflist)
      it.props._it.setState({oflist: it.props.oflist});
      store.set('offer', it.props.oflist);
      it.props._it.setState({player: it.props.player})
    } else {
      swal ( {text: "実行できる状態ではありません！",  icon:"warning" })
    }
  }
  AddCompleteMission(_gene, _city){
    let it = this;
    // クリアした世代（1~3）とどのタイルでのミッションだったかを受け取って保存
    let addItem = {
      gene: _gene,
      city: _city
    };
    it.props.complist.push(addItem);
    // App.jsのcomplistを更新・ストアを更新して終了
    it.props._it.setState({complist: it.props.complist});
    store.set('complete', it.props.complist);
  }
  offerMissionHandleClick(event, item, i){
    let it = this;
    let selected = {item: item, i:i};
    it.setState({nowSelectedItem: selected})
    it.openOfferModal();
  }
  makeOfferHandleClick(){
    let it = this;
    // 送信先プレイヤーの決定（プレイヤー自身を含む）
    let toArr =  []
    if (findDOMNode(it.refs.ofPlayer1).checked) { toArr.push(0) }
    if (findDOMNode(it.refs.ofPlayer2).checked) { toArr.push(1) }
    if (findDOMNode(it.refs.ofPlayer3).checked) { toArr.push(2) }
    toArr.push(it.props.player.id);
    toArr = _.uniq(toArr)
    // オファーリストに報酬・成功率・送信先を更新したアイテムを挿入
    let newItem = it.state.nowSelectedItem.item;
    newItem.of_t = toArr;
    newItem.req[0] = Math.floor(newItem.req[0] / toArr.length);
    newItem.req[1] = Math.floor(newItem.req[1] / toArr.length);
    newItem.req[2] = newItem.req[2] - (10 * toArr.length);
    newItem.res = Math.floor(newItem.res / toArr.length);
    newItem.rate = Math.floor(newItem.rate * (toArr.length * toArr.length) / 10) + newItem.rate;
    let pulled = _.pullAt(it.props.mlist, [it.state.nowSelectedItem.i]);
    it.props._it.setState({mlist: it.props.mlist});
    store.set('mission', it.props.mlist);
    // ミッションリストに追加
    it.props.oflist.push(newItem);
    it.props._it.setState({oflist: it.props.oflist});
    store.set('offer', it.props.oflist);
    let c = {"content": it.props.oflist}
    it.props.dsOffers.set('j8w994qz00002jn', c,function(err){
      if(err){
        console.log('can\'t get user list');
        return;
      }
    })
    it.closeOfferModal();
  }

  openCtrlModal(){ this.setState({ controlModalIsOpen: true })}
  closeCtrlModal(){ this.setState({ controlModalIsOpen: false })}
  openInitModal(){ this.setState({ initModalIsOpen: true })}
  closeInitModal(){ this.setState({ initModalIsOpen: false })}
  openGeneModal(){ this.setState({ geneModalIsOpen: true })}
  closeGeneModal(){ this.setState({ geneModalIsOpen: false })}
  openMapModal(){ this.setState({ mapModalIsOpen: true })}
  closeMapModal(){ this.setState({ mapModalIsOpen: false })}
  openOfferModal(){ this.setState({ offerModalIsOpen: true})}
  closeOfferModal(){ this.setState({ offerModalIsOpen: false})}
  handleError(err) { console.log(err)}
  resetDataHandleClick() {
    let it = this;
    swal({
      text: 'データをリセットしますか？',
      icon: "warning",
      buttons: true
    }).then((agree) => {
      if (agree) {
        let c = { content: [] }
        store.clearAll();
        it.props.dsOffers.set('j8w994qz00002jn', c);
        it.closeCtrlModal();
      } else {
        swal("キャンセルしました");
      }
    });
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
    let missionList = this.props.mlist.map((item, i)=>{
      let title = item.title;
      let cost1 = (item.req[0])? '体力'+item.req[0]:'体力'+0;
      let cost2 = (item.req[1])? '知力'+item.req[1]:'知力'+0;
      let cost3 = (item.req[2])? '信用度'+item.req[2]:'信用度'+0;
      let cls = 'gene'+item.gen + ' city'+item.city;
      let info = ' 必要:' + cost1 +' '+ cost2 +' '+ cost3 + '　確率:' + item.rate + '％  報酬:₿' + item.res;
      return (
        <li className={cls} key={i}>
          <span>{title}</span>
          <span>{info}</span>
          <div className="box_btn">
            <button onClick={e => this.offerMissionHandleClick(e, item, i)}>手伝いを頼む</button>
            <button onClick={e => this.doMissionHandleClick(e, item, i)}>実行する</button>
          </div>
        </li>
      )
    });
    let offerList = this.props.oflist.map((item, i) =>{
      if (_.includes(item.of_t, this.props.player.id)){
        let title = item.title;
        let cost1 = (item.req[0])? '体力'+item.req[0]:'体力'+ 0;
        let cost2 = (item.req[1])? '知力'+item.req[1]:'知力'+ 0;
        let cost3 = (item.req[2])? '信用度'+item.req[2]:'信用度'+ 0;
        let cls = 'gene'+item.gen + ' city'+item.city;
        let info = ' 必要:' + cost1 +' '+ cost2 +' '+ cost3 + '　確率:' + item.rate + '％  報酬:₿' + item.res;
        return (
          <li className={cls} key={i}>
            <span>{title}</span>
            <span>{info}</span>
            <div className="box_btn">
              <button onClick={e => this.doOfferHandleClick(e, item, i)}>実行する</button>
            </div>
          </li>
        )
      }
    });
    let compList = this.props.complist.map((item, i)=>{
      let cls = 'city' + item.city + ' gene' + item.gene;
      return (
        <li className={cls} key={i}/>
      )
    });
    return (
      <div className="app">
        <header className={'gene'+this.props.gene}>
          <ul>
            <li>{this.props.player.status.str}/{this.props.player.max.str}</li>
            <li>{this.props.player.status.int}/{this.props.player.max.int}</li>
            <li>{this.props.player.status.mov}</li>
            <li>{this.props.player.status.trs}</li>
            <li>{this.props.player.status.val}</li>
            <li onClick={this.openCtrlModal.bind(this)}> </li>
          </ul>
        </header>
        <main className="container">
          <div className="mission">
            <h2>ミッションリスト</h2>
            <ul className="mission_list">
              {missionList}
            </ul>
            <h2>オファーリスト</h2>
            <ul className="offer_list">
              {offerList}
            </ul>
            <h2>成功したミッション</h2>
            <ul className="complete_list">
              {compList}
            </ul>
          </div>
          <div>
            <Modal
              isOpen={this.state.controlModalIsOpen}
              style={customStyles}
              contentLabel="Buttons"
            >
              <button onClick={this.openMapModal.bind(this)}>読み込み</button>
              <button onClick={this.openInitModal.bind(this)}>プレイヤー登録</button>
              <button onClick={this.closeCtrlModal.bind(this)}>閉じる</button>
              <button className="dangerous" onClick={this.resetDataHandleClick.bind(this)}>データリセット</button>
            </Modal>
            <Modal
              isOpen={this.state.initModalIsOpen}
              style={customStyles}
              contentLabel="Player Init"
            >
              <h1>プレイヤーの登録</h1>
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.playerInitHandleScan}
                facingMode={'rear'}
              />
              <button onClick={this.closeInitModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.mapModalIsOpen}
              style={customStyles}
              contentLabel="Map"
            >
              <h1>コンポーネント読み込み</h1>
              <QRreader
                delay={this.state.delay}
                style={previewStyle}
                onError={this.handleError}
                onScan={this.componentHandleScan}
                facingMode={'rear'}
              />
              <button onClick={this.closeMapModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.offerModalIsOpen}
              style={customStyles}
              contentLabel="Offer"
            >
              <h1>誰に手伝いをお願いしますか？</h1>
              <p>注意：一度手伝いをお願いするとキャンセルすることができません</p>
              <p>
                <span><input ref="ofPlayer1" type="checkbox"/>プレイヤー１　</span>
                <span><input ref="ofPlayer2" type="checkbox"/>プレイヤー２　</span>
                <span><input ref="ofPlayer3" type="checkbox"/>プレイヤー３</span>
              </p>
              <button onClick={this.makeOfferHandleClick.bind(this)}>お願いする</button>
              <button onClick={this.closeOfferModal.bind(this)}>閉じる</button>
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


// TODO: マップチップ検証・修正
// TODO: ミッション調整
// ↑ここまでを10時までに
// TODO: テストプレイ
