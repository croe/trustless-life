import React, {Component} from 'react'
import {Link} from 'react-router';
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'
import Modal from 'react-modal'
import swal from 'sweetalert'
import store from 'store';
import _ from 'lodash';
import CountUp from 'react-countup';

import db_mission from './db_mission.json';
import db_homes from './db_homes.json';
import db_cars from './db_car.json';

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
      mapModalIsOpen: false,
      controlModalIsOpen: false,
      offerModalIsOpen: false,
      carModalIsOpen: false,
      tradeModalIsOpen: false,
      homeModalIsOpen: false,
      salehomeModalIsOpen: false,
      scanFlg: true,
      nowSelectedItem: {}
    }
    this.componentHandleScan = this.componentHandleScan.bind(this)
  }

  componentHandleScan(data){
    let it = this;
    let json = JSON.parse(data);
    if(data && it.state.scanFlg){
      it.setState({scanFlg: false});
      // Player register reader
      if (json.x === 1){
        it.props.player.id = json.p;
        it.props._it.setState({player: it.props.player})
        store.set('player', it.props.player)
        it.closeMapModal();
        it.closeCtrlModal();
        it.setState({scanFlg: true})
      }
      // Generation Event reader
      /**
       * フェーズカードを読んだところがターンの開始
       * 家による回復のあと、カードコスト処理
       */
      if (json.x === 2) {
        console.log(json)
        /**
         *  ターン処理
         *  家賃の支払い→支払いがマイナスなら-1につき-5
         *  都市内なら体力・知力が回復
         *  どこにいても電力は回復
         **/
        it.props.myhomelist.map((item, i)=>{
          it.props.player.status.val -= item.req[0];
          it.props.player.status.mov += item.res[2];
          if(item.city === it.props.lastPoscity){
            if (it.props.player.status.str + item.res[0] <= it.props.player.max.str) {
              it.props.player.status.str += item.res[0];
            } else {
              it.props.player.status.str = it.props.player.max.str;
            }
            if (it.props.player.status.int + item.res[1] <= it.props.player.max.int) {
              it.props.player.status.int += item.res[1];
            } else {
              it.props.player.status.int = it.props.player.max.int;
            }
          }
        });
        if (it.props.player.status.val < 0){
          it.props.player.status.trs += parseInt(it.props.player.status.val * 5);
        }

        it.makeListCars();
        // Pay Cost
        /**
         *  Pay Cost -> 払えない場合はマイナス（負債に）
         *  体力や知力消費のコストの扱いを考える
         **/
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
            }
            /**
             * お金だけは借金できるようにする
             **/
            // else if (k === "o4") {
            //   flg = (it.props.player.status.val >= v);
            // }
            payFlgArr.push(flg);
          })
        });
        console.log(payFlgArr)
        // payFlgArrに一つでもFalseが入っていたら購入処理しない
        if (_.includes(payFlgArr, false)) {
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
          it.props._it.setPlayerStatus();
          swal ( {text: "処理完了しました！",  icon:"success" })
        }
        it.closeMapModal();
        it.closeCtrlModal();
        it.setState({scanFlg: true})
      }
      // Map Event reader
      /**
       * マップを読むたびにハプニングカードの判定が発生する
       * マップを読んだ時点でターン終了の判定、仕事の納期が短くなる、最後の位置を記録する、など
       */
      if (json.x === 3){
        console.log(json)
        /**
         * Mapの地区を記録
         */
        it.props._it.setState({lastPoscity: json.c});
        store.set('poscity', json.c);
        /**
         * 仕事の納期を記録する
         */
        it.props.mlist.map((item, i) => {
          item.limit -= 1;
          if(item.limit < 1){
            let pulled = _.pullAt(it.props.mlist, [i]);
            it.props._it.setState({mlist: it.props.mlist});
            store.set('mission', it.props.mlist);
            it.props.player.status.trs -= 6;
            it.props._it.setPlayerStatus();
          }
        });
        it.props.oflist.map((item, i) => {
          if (item.c.of_f === it.props.player.id){
            let _item = item.c;
            _item.limit -= 1;
            it.props._it.updateOfferData(item._id, _item);
          }
          if(item.c.of_f === it.props.player.id || item.c.of_t === it.props.player.id){
            // 両方とも信用を少し失う
            it.props.player.status.trs -= 3;
          }
        });
        store.set('mission', it.props.mlist);
        it.props._it.setState({mlist: it.props.mlist});
        /**
         * 体力回復
         */
        if (json.s === 1){
          //ランダムで1~5の回復
          let rnd = Math.floor(1 + Math.random() * 5);
          let text;
          if (rnd + it.props.player.status.str <= it.props.player.max.str){
            it.props.player.status.str += rnd;
            text = '体力を' + rnd + '回復しました！';
            swal({title: text, icon: "success"});
          } else {
            it.props.player.status.str = it.props.player.max.str;
            text = '体力が最大まで回復しました！';
            swal({title: text, icon: "success"});
          }
          it.props._it.setPlayerStatus();
        }
        /**
         * 知力回復
         */
        if (json.s === 2){
          //ランダムで1~5の回復
          let rnd = Math.floor(1 + Math.random() * 5);
          let text;
          if (rnd + it.props.player.status.int <= it.props.player.max.int){
            it.props.player.status.int += rnd;
            text = '知力を' + rnd + '回復しました！';
            swal({title: text, icon: "success"});
          } else {
            it.props.player.status.int = it.props.player.max.int;
            text = '知力が最大まで回復しました';
            swal({title: text, icon: "success"});
          }
          it.props._it.setPlayerStatus();
        }
        /**
         * 仕事入手（上限３）
         */
        if (json.s === 3){
          let sel, selcp;
          let arr = store.get('mission')? store.get('mission'): [];
          sel = Math.floor(Math.random() * db_mission[0].length);
          selcp = db_mission[0][sel];
          selcp.city = json.c;
          if(arr.length < 3){
            if(selcp.req[2] <= it.props.player.status.trs) {
              arr.push(selcp);
              store.set('mission', arr);
              it.props._it.setState({mlist: arr});
            }
          } else {
            swal({title: '3件以上仕事を受けることはできません！', icon: 'error'});
          }
        }
        /**
         * シェアライド
         */
        if (json.s === 4){
          // 移動後タイルが許可されていない場合は信用度が20下がる。
          // 移動はできる？
          if (it.props.allowMove !== json.c){
            it.props.player.status.trs -= 20;
            it.props.player.status.val -= 5;
            it.props._it.setState({player: it.props.player});
            store.set('player', it.props.player)
            swal({title: "不正な移動です！", icon: "error"});
          }
          it.props._it.setState({
            allowMove: 0
          });
        }
        /**
         * ハプニング判定
         * 信用度100で20%、1ポイントあたり1%の上昇
         *//**
         * スラム街
         */
        let parcent = Math.floor(1 + Math.random() * 100);
        if (json.s === 5){
          if (parcent > parseInt(it.props.player.status.trs - 40)){
            swal({title: '何か起こったようです、ハプニングカードを引いてください', icon:'error'}).then((agree)=>{
              if(agree){
                it.closeMapModal();
                it.closeCtrlModal();
                it.setState({scanFlg: true});
              }
            })
          } else {
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          }
        } else {
          if (parcent > parseInt(it.props.player.status.trs - 20)){
            swal({title: '何か起こったようです、ハプニングカードを引いてください', icon:'error'}).then((agree)=>{
              if(agree){
                it.closeMapModal();
                it.closeCtrlModal();
                it.setState({scanFlg: true});
              }
            })
          } else {
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          }
        }
      }
    }
  }
  doMissionHandleClick(event, item, i) {
    let it = this;
    if (it.props.player.status.str >= item.req[0]
      && it.props.player.status.int >= item.req[1]){
      // 成否判定 ->
      if (100 - item.rate < Math.floor(Math.random() * 100)){
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
        swal ( {text: "Failed..",  icon:"error" })
        it.props.player.status.trs = it.props.player.status.trs - 5;
        store.set('player', it.props.player)
      }
      let pulled = _.pullAt(it.props.mlist, [i]);
      console.log(it.props.mlist);
      it.props._it.setState({mlist: it.props.mlist});
      store.set('mission', it.props.mlist);
      it.props._it.setPlayerStatus();
    } else {
      swal ( {title: "実行できる状態ではありません！",  icon:"warning" });
    }
  }
  doOfferHandleClick(event, _item, i){
    let it = this;
    let item = _item.c;
    if (it.props.player.status.str >= item.req[0]
      && it.props.player.status.int >= item.req[1]){
      // 成否判定 ->
      console.log(item);
      // 同じ街でないと実行できない・相手から先にオファーをクリアする必要がある
      if (it.props.lastPoscity === item.city){
        // 手伝い判定
        // 自分が発信元の場合
        if (item.of_f === it.props.player.id){
          // of_tがnullの場合のみ完了できる
          if (item.of_t === null){
            if (100 - item.rate < Math.floor(Math.random() * 100)){
              // 成功ならコスト払って報酬と信用を獲る
              swal ( {text: "ミッション成功しました！",  icon:"success" })
              it.props.player.status.str = it.props.player.status.str - item.req[0];
              it.props.player.status.int = it.props.player.status.int - item.req[1];
              it.props.player.status.trs = it.props.player.status.trs + Math.floor(item.req[2] / 10);
              it.props.player.status.val = it.props.player.status.val + item.res;
              it.props._it.setPlayerStatus();
              // ミッション完了で完了リストに保存される
              it.AddCompleteMission(item.gen ,item.city);

            } else {
              // 失敗なら信用がなくなるだけ
              swal ( {title: "Failed..",  icon:"error" })
              it.props.player.status.trs -= 5;
              it.props._it.setPlayerStatus();
            }
            let obj = item;
            obj.of_f = null;
            it.props._it.updateOfferData(_item._id, obj);
            it.props._it.setPlayerStatus();
          } else {
            swal({title: "他プレイヤーの手伝いが完了していません", icon: "error"});
          }
        } else {
          // 手伝う側の場合
          if (100 - item.rate < Math.floor(Math.random() * 100)){
            // 成功ならコスト払って報酬と信用を獲る
            swal ( {title: "ミッション成功しました！",  icon:"success" })
            it.props.player.status.str = it.props.player.status.str - item.req[0];
            it.props.player.status.int = it.props.player.status.int - item.req[1];
            it.props.player.status.trs = it.props.player.status.trs + Math.floor(item.req[2] / 10);
            it.props.player.status.val = it.props.player.status.val + item.res;
            it.props._it.setPlayerStatus();
            // ミッション完了で完了リストに保存される
            it.AddCompleteMission(item.gen ,item.city);
          } else {
            // 失敗なら信用がなくなるだけ
            swal ( {title: "Failed..",  icon:"error" })
            it.props.player.status.trs -= 5;
            it.props._it.setPlayerStatus();
          }
          let obj = item;
          obj.of_t = null;
          it.props._it.updateOfferData(_item._id, obj);
          it.props._it.setPlayerStatus();
        }
      } else {
        swal ( {title: "同じ都市内のみ完了できます！",  icon:"warning" })
      }
    } else {
      swal ( {title: "実行できる状態ではありません！",  icon:"warning" })
    }
  }
  rejectOfferHandleClick(event, _item, i){
    let it = this;

    swal({title: '拒否しますか？', icon: 'info', buttons: true}).then((agree)=>{
      if (agree){
        let item = _item.c;
        item.of_t = null;
        item.req[0] *= 2;
        item.req[1] *= 2;
        item.res *= 2;
        item.rate -= item.rate * 4 / 10;
        it.props._it.updateOfferData(_item._id, item);
      } else {
        swal({title: 'Cancel', icon: 'warning'});
      }
    })

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
    it.props._it.getPlayersList();
    it.openOfferModal();
  }
  makeOfferHandleClick(e, item, i){
    let it = this;
    // オファーリストに報酬・成功率・送信先を更新したアイテムを挿入
    let newItem = it.state.nowSelectedItem.item;
    newItem.of_f = it.props.player.id;
    newItem.of_t = item.p.id;
    newItem.req[0] = Math.floor(newItem.req[0] / 2);
    newItem.req[1] = Math.floor(newItem.req[1] / 2);
    newItem.req[2] = newItem.req[2] - (15);
    newItem.res = Math.floor(newItem.res / 2);
    newItem.rate = Math.floor(newItem.rate * 4 / 10) + newItem.rate;
    let pulled = _.pullAt(it.props.mlist, [it.state.nowSelectedItem.i]);
    it.props._it.setState({mlist: it.props.mlist});
    store.set('mission', it.props.mlist);
    // ミッションリストに追加
    it.props._it.addOffersList(newItem);
    it.closeOfferModal();
  }
  makeHomeRent(){
    let it = this;
    let r = [];
    do {
      let arr = db_homes[Math.floor(Math.random() * db_homes.length)];
      r.push(arr);
      r = _.uniq(r);
    } while (r.length < 4);
    store.set('homes', r);
    it.props._it.setState({ homelist: r});
  }
  rentHomeHandleClick(e, item, i){
    let it = this;
    swal({
      title: "この家を借りますか？",
      icon: "info",
      buttons: true
    }).then((agree)=>{
      if (agree){
        // homeListから削除して、自分のリストに追加する
        let pulled = _.pullAt(it.props.homelist, [i]);
        it.props._it.setState({homelist: it.props.homelist});
        store.set('homes', it.props.homelist);
        it.makeHomeRent();
        let arr = it.props.myhomelist;
        arr.push(item);
        it.props._it.setState({myhomelist: arr});
        store.set('myhome', arr);
        // 少し信用が上がる
        it.props.player.status.trs += 5;
        it.props._it.setPlayerStatus();
        swal({title:'契約完了',icon: "success"});
        it.closeHomeModal();
        it.closeCtrlModal();
      } else {
        swal({title:'Cancel', icon: 'error'});
      }
    })
  }
  saleHomeHandleClick(e, item, i){
    // 家の契約を解除する
    let it = this;
    swal({
      title: "この家を返しますか？",
      icon: "info",
      buttons: true
    }).then((agree)=>{
      if (agree){
        // myhomeListから削除する
        // homeListを更新される
        let pulled = _.pullAt(it.props.myhomelist, [i]);
        it.props._it.setState({myhomelist: it.props.myhomelist});
        store.set('myhome', it.props.myhomelist);
        it.makeHomeRent();
        swal({title:'契約解除',icon: "success"});
        // 少し信用が下がる
        it.props.player.status.trs -= Math.floor(Math.random() * 10);
        it.props._it.setPlayerStatus();
        it.closeHomeModal();
        it.closeCtrlModal();
      } else {
        swal({title:'Cancel', icon: 'error'});
      }
    })

  }
  makeTradeHandleClick(e, item, i){
    let it = this;
    console.log(item);

    swal({
      title: 'どちらを出しますか？',
      icon: 'info',
      buttons: {
        cancel: 'Cancel',
        energy: 'エネルギー',
        coin: 'コイン'
      }
    }).then((value)=>{
      switch(value) {
        // 電力確認・電力消費
        case "energy":
          swal({ title: "いくつ出しますか？", icon: "info", content: 'input'}).then((amount)=>{
            if(amount > 0 && it.props.player.status.mov >= amount){
              swal({ title: "いくら欲しいですか？", icon: "info", content: 'input'}).then((value)=>{
                if(value > 0){
                  swal({title: 'トレードを提案しますか？', icon: "info", buttons: true}).then((agree)=>{
                    if (agree){
                      // 電力消費
                      it.props.player.status.mov -= amount;
                      it.props._it.setPlayerStatus();
                      // ブロードキャスト用データ整形・通信・追加
                      let obj = {
                        "x": 'energy',
                        "a": parseInt(amount),
                        "v": parseInt(value),
                        "fr": it.props.player.id,
                        "to": parseInt(item.p.id)
                      };
                      // 現在のリストに追加する
                      it.props._it.addTradesList(obj);
                      console.log(it.props.tradelist)
                      swal({title: 'Success', icon: 'success'});
                      it.closeCtrlModal();
                      it.closeTradeModal();
                    } else {
                      swal({ title: "Cancel", icon: "info"}).then((agree)=>{
                        it.closeCtrlModal();
                        it.closeTradeModal();
                      });
                    }
                  })
                }
              });
            }
          });
          break;
        case "coin":
          swal({ title: "いくつ出しますか？", icon: "info", content: 'input'}).then((amount)=>{
            if(amount > 0){
              swal({ title: "いくら欲しいですか？", icon: "info", content: 'input'}).then((value)=>{
                if(value > 0){
                  swal({title: 'トレードを提案しますか？', icon: "info", buttons: true}).then((agree)=>{
                    if (agree){
                      // コイン消費
                      it.props.player.status.val -= amount;
                      it.props._it.setPlayerStatus();
                      // ブロードキャスト用データ整形・通信・追加
                      let obj = {
                        "x": 'coin',
                        "a": parseInt(amount),
                        "v": parseInt(value),
                        "fr": it.props.player.id,
                        "to": parseInt(item.p.id)
                      };
                      // 現在のリストに追加する
                      it.props._it.addTradesList(obj);
                      console.log(it.props.tradelist)
                      swal({title: 'Success', icon: 'success'});
                      it.closeCtrlModal();
                      it.closeTradeModal();
                    } else {
                      swal({ title: "Cancel", icon: "info"}).then((agree)=>{
                        it.closeCtrlModal();
                        it.closeTradeModal();
                      });
                    }
                  })
                }
              });
            }
          });
          break;
        case "cancel":
          swal({ title: "Cancel", icon: "warning"}).then((agree)=>{
            it.closeCtrlModal();
            it.closeTradeModal();
          });
          break;
      }
    });

  }
  doTradeHandleClick(e, _item, i){
    let it = this;
    let item = _item.t;
    swal({
      title: '購入しますか？',
      icon: 'info',
      buttons: true
    }).then((agree)=>{
      if (agree) {
        // 購入処理
        console.log(item);
        if (item.x === 'energy') {
          if (it.props.player.status.val >= item.v){
            // お金を支払う処理
            it.props.player.status.val -= parseInt(item.v);
            // 電力を受け取る処理
            it.props.player.status.mov += parseInt(item.a);
            // 提供者にお金を渡す処理 -> player状態の更新
            // 配列から
            item.to = null;
            item.fr = null;
            it.props._it.updateTradeData(_item._id, item);
            swal({ title: "Success", icon: "success"});
          }
        } else if (item.x === 'coin') {
          if (it.props.player.status.mov >= item.v){
            // 電力を支払う処理
            it.props.player.status.mov -= parseInt(item.v);
            // お金を受け取る処理
            it.props.player.status.val += parseInt(item.a);
            // 提供者に電力を渡す処理 -> player状態の更新
            // 配列から
            item.to = null;
            item.fr = null;
            it.props._it.updateTradeData(_item._id, item);
            swal({ title: "Success", icon: "success"});
          }
        }
      } else {
      swal({ title: "Cancel", icon: "warning"});
      }
    })
  }
  rideCarHandleClick(e, item, i){
    let it = this;
    // 電力を払って許可を得る。たどり着いた街で成否判定して、不正状態なら信用が減る。
    swal({
      title: "この街にいきますか？",
      icon: "info",
      buttons: true
    }).then((agree)=>{
      if(agree){
        // 信用判定・電力判定
        if (it.props.player.status.trs >= 90
          && it.props.player.status.mov - item.req >= 0){
          it.props.player.status.mov -= item.req;
          it.props._it.setState({
            player: it.props.player,
            allowMove: item.to
          })
          swal({title: "移動権を獲得しました", icon: "success"});
          it.closeCarModal();
          it.closeCtrlModal();
        } else {
          swal({title: "信用か電力が足りません", icon: "error"});
        }
      } else {
        swal({title: "Cancel", icon: "error"});
      }
    })

  }
  makeListCars(){
    let it = this;
    let r = [];
    do {
      let arr = db_cars[Math.floor(Math.random() * db_cars.length)];
      r.push(arr);
      r = _.uniq(r);
    } while (r.length < 4);
    it.props._it.setState({carlist: r});
    store.set('cars', r)
  }

  openCtrlModal(){ this.setState({ controlModalIsOpen: true })}
  closeCtrlModal(){ this.setState({ controlModalIsOpen: false })}
  openMapModal(){ this.setState({ mapModalIsOpen: true })}
  closeMapModal(){ this.setState({ mapModalIsOpen: false })}
  openOfferModal(){ this.setState({ offerModalIsOpen: true})}
  closeOfferModal(){ this.setState({ offerModalIsOpen: false})}
  openHomeModal(){
    let it = this;
    this.setState({ homeModalIsOpen: true})
    // 初期値としての借りられる家リストを生成・ブロードキャスト
    let arr = store.get('homes');
    if(arr !== undefined && arr.length > 0){
      it.props._it.setState({ homelist: store.get('homes')});
    } else {
      let r = [];
      do {
        let arr = db_homes[Math.floor(Math.random() * db_homes.length)];
        r.push(arr);
        r = _.uniq(r);
      } while (r.length < 4);
      store.set('homes', r);
      it.props._it.setState({ homelist: r});
    }
  }
  closeHomeModal(){ this.setState({ homeModalIsOpen: false})}
  openSalehomeModal(){ this.setState({ salehomeModalIsOpen: true})}
  closeSalehomeModal(){ this.setState({ salehomeModalIsOpen: false})}
  openCarModal(){ this.setState({ carModalIsOpen: true})}
  closeCarModal(){ this.setState({ carModalIsOpen: false})}
  openTradeModal(){
    let it = this;
    it.setState({ tradeModalIsOpen: true})
    it.props._it.getPlayersList();
  }
  closeTradeModal(){ this.setState({ tradeModalIsOpen: false})}
  handleError(err) { console.log(err)}
  resetDataHandleClick() {
    let it = this;
    swal({
      text: 'データをリセットしますか？',
      icon: "warning",
      buttons: true
    }).then((agree) => {
      if (agree) {
        store.clearAll();
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
      let cls = 'city'+item.city;
      let info = ' 必要:' + cost1 +' '+ cost2 + '　確率:' + item.rate + '％  報酬:₿' + item.res+ ' 納期あと' + item.limit + 'ターン' ;
      return (
        <li className={cls} key={i}>
          <span>{title}</span>
          <span>{info}</span>
          <div className="box_btn">
            <button onClick={e => this.offerMissionHandleClick(e, item, i)}>手伝いを頼む</button>
            <button onClick={e => this.doMissionHandleClick(e, item, i)}>仕事する</button>
          </div>
        </li>
      )
    });
    let offerList = this.props.oflist.map((item, i) =>{
      if (item.c.of_f === this.props.player.id || item.c.of_t === this.props.player.id){
        let title = item.c.title;
        let cost1 = (item.c.req[0])? '体力'+item.c.req[0]:'体力'+ 0;
        let cost2 = (item.c.req[1])? '知力'+item.c.req[1]:'知力'+ 0;
        let cls = 'city'+item.c.city;
        let info = ' 必要:' + cost1 + ' '+ cost2 + '　確率:' + item.c.rate + '％  報酬:₿' + item.c.res + ' 納期あと' + item.c.limit + 'ターン' ;
        return (
          <li className={cls} key={i}>
            <span>{title}</span>
            <span>{info}</span>
            <div className="box_btn">
              <button onClick={e => this.rejectOfferHandleClick(e, item, i)}>拒否する</button>
              <button onClick={e => this.doOfferHandleClick(e, item, i)}>仕事する</button>
            </div>
          </li>
        )
      }
    });
    let compList = this.props.complist.map((item, i)=>{
      let cls = 'city' + item.city;
      return (
        <li className={cls} key={i}/>
      )
    });
    let tradeList = this.props.tradelist.map((_item, i)=>{
      let item = _item.t;
      console.log(item);
      if (item.to === this.props.player.id || item.fr === this.props.player.id){
        let cls = '';
        if(item.fr === this.props.player.id){ cls = 'self'; }
        let _from = this.props.player.name;
        let _to;
        this.props.plist.map((_p,_i)=>{
          if(_p.p.id === item.to) {
            _to = _p.p.name;
          }
        });
        let plyr = _from + " → " + _to;
        let val;
        if (item.x === "energy"){
          val = 'エネルギー' + item.a + "⇆" + item.v + 'コイン';
        } else {
          val = 'コイン' + item.a + "⇆" + item.v + 'エネルギー';
        }
        let text = plyr + " " + val;
        return (
          <li className={cls} key={i} onClick={e => this.doTradeHandleClick(e, _item, i)}>{text}</li>
        )
      }
    })
    let homeList = this.props.homelist.map((item, i)=>{
      let cls = 'city' + item.city;
      if(item.req[1] < this.props.player.status.trs){
        return (
          <li className={cls} key={i} onClick={e => this.rentHomeHandleClick(e, item, i)}>
            <span data-val={item.req[0]}>毎ターン</span>
            <span data-val={item.res[0]}>体力回復</span>
            <span data-val={item.res[1]}>知力回復</span>
            <span data-val={item.res[2]}>電力回復</span>
          </li>
        )
      }
    });
    let myhomeList = this.props.myhomelist.map((item, i)=>{
      let cls = 'city' + item.city;
      return (
        <li className={cls} key={i} onClick={e => this.saleHomeHandleClick(e, item, i)}>
          <span data-val={item.req[0]}>毎ターン</span>
          <span data-val={item.res[0]}>体力回復</span>
          <span data-val={item.res[1]}>知力回復</span>
          <span data-val={item.res[2]}>電力回復</span>
        </li>
      )
    });
    let carList = this.props.carlist.map((item, i)=> {
      let cls = 'city' + item.to;
      return (
        <li className={cls} key={i} onClick={e => this.rideCarHandleClick(e, item, i)}>
          <span data-val={item.to}>行き先</span>
          <span data-val={item.req}>必要電力</span>
        </li>
      )
    });
    let offerPlayerList = this.props.plist.map((item, i)=>{
      if (item.p.id !== this.props.player.id){
        return (
          <li key={i}>
            {item.p.name}
            <button onClick={e => this.makeOfferHandleClick(e, item, i)}>お願いする</button>
          </li>
        )
      }
    })
    let tradePlayerList = this.props.plist.map((item, i)=>{
      if (item.p.id !== this.props.player.id){
        return (
          <li key={i}>
            {item.p.name}
            <button onClick={e => this.makeTradeHandleClick(e, item, i)}>トレードする</button>
          </li>
        )
      }
    })
    return (
      <div className="app">
        <header className={'city'+this.props.lastPoscity} onClick={this.openCtrlModal.bind(this)}>
          <ul>
            <li><CountUp start={0} end={this.props.player.status.str} duration={3}/>/<CountUp start={0} end={this.props.player.max.str} duration={3}/></li>
            <li><CountUp start={0} end={this.props.player.status.int} duration={3}/>/<CountUp start={0} end={this.props.player.max.int} duration={3}/></li>
            <li><CountUp start={0} end={this.props.player.status.mov} duration={3}/></li>
            <li><CountUp start={0} end={this.props.player.status.val} duration={3}/></li>
            <li onClick={this.openCtrlModal.bind(this)}> </li>
          </ul>
        </header>
        <main className="container">
          <h1>{this.props.player.name}</h1>
          <div className="mission">
            <h2>ワークリスト</h2>
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
            <h2>トレードリスト</h2>
            <ul className="trade_list">
              {tradeList}
            </ul>
          </div>
          <div>
            <Modal
              isOpen={this.state.controlModalIsOpen}
              style={customStyles}
              contentLabel="Buttons"
            >
              <button onClick={this.openMapModal.bind(this)}>読み込み</button>
              <button onClick={this.openHomeModal.bind(this)}>家を借りる</button>
              <button onClick={this.openSalehomeModal.bind(this)}>家を返す</button>
              <button onClick={this.openCarModal.bind(this)}>シェアライド</button>
              <button onClick={this.openTradeModal.bind(this)}>トレード</button>
              <button onClick={this.closeCtrlModal.bind(this)}>閉じる</button>
              <button className="dangerous" onClick={this.resetDataHandleClick.bind(this)}>データリセット</button>
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
              <ul>
                {offerPlayerList}
              </ul>
              <button onClick={this.closeOfferModal.bind(this)}>閉じる</button>
            </Modal>
            <Modal
              isOpen={this.state.homeModalIsOpen} style={customStyles} contentLabel="Home"
            >
              <div className='homeModal'>
                <h1>現在借りることのできる家</h1>
                <ul>{homeList}</ul>
                <button onClick={this.closeHomeModal.bind(this)}>閉じる</button>
              </div>
            </Modal>
            <Modal
              isOpen={this.state.salehomeModalIsOpen} style={customStyles} contentLabel="Salehome"
            >
              <div className='homeModal'>
                <h1>借りている家</h1>
                <p>返したい家を選んでください</p>
                <ul>{myhomeList}</ul>
                <button onClick={this.closeSalehomeModal.bind(this)}>閉じる</button>
              </div>
            </Modal>
            <Modal
              isOpen={this.state.carModalIsOpen} style={customStyles} contentLabel="Car"
            >
              <div className='carModal'>
                <h1>シェアライド</h1>
                <p>現在他の人が行こうとしている街</p>
                <ul>{carList}</ul>
                <button onClick={this.closeCarModal.bind(this)}>閉じる</button>
              </div>
            </Modal>
            <Modal
              isOpen={this.state.tradeModalIsOpen} style={customStyles} contentLabel="Trade"
            >
              <div className='tradeModal'>
                <h1>トレード</h1>
                <p>誰とトレードしますか？</p>
                <ul>
                  {tradePlayerList}
                </ul>
                <button onClick={this.closeTradeModal.bind(this)}>閉じる</button>
              </div>
            </Modal>
          </div>
        </main>
      </div>
    );
  }
}

export default Index

// TODO: 自分の借りている家を貸し出す処理、借りている状態も保持する？ -> 難しいので後で
// TODO: カーシェアの処理

// TODO: 再ログイン・別アカウントへのログイン
// TODO: ミッション・ターン（納期）（持てる量の制限）の導入