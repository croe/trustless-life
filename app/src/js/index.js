import React, {Component} from 'react'
import {Link} from 'react-router';
import {findDOMNode} from "react-dom"
import QRreader from 'react-qr-reader'
import Modal from 'react-modal'
import swal from 'sweetalert'
import store from 'store';
import _ from 'lodash';
import CountUp from 'react-countup';
import PerfectScrollbar from 'react-perfect-scrollbar'

import db_mission from './db_mission.json';
import db_homes from './db_homes.json';
import db_cars from './db_car.json';
import db_event from './db_event.json';

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
      selectPlayerModalIsOpen: false,
      scanFlg: true,
      nowSelectedItem: {}
    }
    this.componentHandleScan = this.componentHandleScan.bind(this)
  }

  componentHandleScan(data) {
    let it = this;
    let json = JSON.parse(data);
    if (data && it.state.scanFlg) {
      it.setState({scanFlg: false});

      if (json.x === 8) {
        /**
         * Job Card （ターンの開始・カードをプレイしなくても良い）
         * x: 8, i: id, c: city;
         * RED-1-A / ORANGE-2-B / GREEN-3-C / BLUE-4-D / PURPLE-5-E / GRAY-6-F
         */
        let arr = store.get('mission') ? store.get('mission') : [];

        let sel, selcp;
        json.c = parseInt(json.c);
        if (json.d === 3){ sel = 0;
        } else if (json.d === 2){ sel = 1;
        } else if (json.d === 1){ sel = 2; }
        selcp = db_mission[json.c - 1][sel];
        selcp.city = json.c;
        if (arr.length < 3) {
          if (selcp.req[2] <= it.props.player.status.trs) {
            arr.push(selcp);
            store.set('mission', arr);
            it.props._it.setState({mlist: arr});
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          } else {
            // 信用が足りなくて登録されなかった。
            let tx = {dir: 0, msg: '信用度が足りず受注できませんでした'};
            it.props._it.trustTransaction(tx);
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          }
        } else {
          swal({title: '3件以上仕事を受けることはできません！', icon: 'error'});
          it.closeMapModal();
          it.closeCtrlModal();
          it.setState({scanFlg: true});
        }
      }
      // Map Event reader
      /**
       * マップを読むたびにハプニングカードの判定が発生する -> 停止中
       * マップを読んだ時点でターン終了の判定、仕事の納期が短くなる、最後の位置を記録する、など
       */
      if (json.x === 3) {
        console.log(json)
        /**
         * Mapの地区を記録
         */
        it.props._it.setState({lastPoscity: json.c});
        store.set('poscity', json.c);
        /**
         * シェアライドのリストを更新
         */
        it.makeListCars();
        /**
         * 家のリストを更新
         */
        it.makeListHomes();
        /**
         * 仕事の納期を記録する
         */
        // 自分のミッション
        it.props.mlist.map((item, i) => {
          item.limit -= 1;
          if (item.limit < 1) {
            let pulled = _.pullAt(it.props.mlist, [i]);
            it.props._it.setState({mlist: it.props.mlist});
            store.set('mission', it.props.mlist);
            it.props.player.status.trs -= 10;
            let tx = {dir: -1, msg: '仕事の期限が過ぎたため信用度が減少しました。'};
            it.props._it.trustTransaction(tx);
            it.props._it.setPlayerStatus();
          }
        });
        // オファーのミッション
        it.props.oflist.map((item, i) => {
          if (item.c.of_f === it.props.player.id) {
            let _item = item.c;
            _item.limit -= 1;
            if (_item.limit < 1) {
              // TODO: 両方とも信用を少し失うようにする
              // TODO: マイナスになるとエラー
              it.props.player.status.trs -= 10;
              let tx = {dir: -1, msg: '仕事の期限が過ぎたため信用度が減少しました。'};
              it.props._it.trustTransaction(tx);
              it.props.setPlayerStatus();
            }
            // TODO: ここの処理怪しい
            it.props._it.updateOfferData(item._id, _item);
          }
        });
        store.set('mission', it.props.mlist);
        it.props._it.setState({mlist: it.props.mlist});
        /**
         * 体力の最大値が①上がる
         */
        if (json.s === 1) {
          it.props.player.max.str += (json.p - 1);
          let text = '少し体力がつきました';
          swal({title: text, icon: "success"});
          it.props._it.setPlayerStatus();
        }
        /**
         * 知力の最大値が①上がる
         */
        if (json.s === 2) {
          it.props.player.max.int += (json.p - 1);
          let text = '少しなにか知識を得たようです';
          swal({title: text, icon: "success"});
          it.props._it.setPlayerStatus();
        }
        /**
         * イベントタイル
         */
        if (json.s === 3) {
          let par = Math.floor(Math.random() * 100);
          if (par < 25 * (json.p - 1)) {
            let arr = store.get('mission') ? store.get('mission') : [];
            let sel2, selcp2;
            sel2 = Math.floor(Math.random() * db_event[0].length);
            selcp2 = db_event[0][sel2];
            // ボランティアに参加する
            if (selcp2.id === 1) {
              swal({title: 'ボランティアに参加しよう！'});
              selcp2.city = it.props.lastPoscity;
              arr.push(selcp2);
              store.set('mission', arr);
              it.props._it.setState({mlist: arr});
            } else if (selcp2.id === 2) {
              swal({title: 'クリエイティブなコンペに通った！'});
              selcp2.city = it.props.lastPoscity;
              arr.push(selcp2);
              store.set('mission', arr);
              it.props._it.setState({mlist: arr});
            } else if (selcp2.id === 3) {
              swal({title: '美味しいご飯を食べたので体力回復！'});
              it.props.player.status.str += 2;
              it.props._it.setPlayerStatus();
            } else if (selcp2.id === 4) {
              swal({title: 'いい本に出会った、知力が増えた'});
              it.props.player.max.int += 2;
              it.props._it.setPlayerStatus();
            } else if (selcp2.id === 5) {
              swal({title: '筋トレの効果が出てきたみたい'});
              it.props.player.max.str += 2;
              it.props._it.setPlayerStatus();
            } else if (selcp2.id === 6) {
              swal({title: '猫動画でリラックス'});
              it.props.player.status.int += 2;
              it.props._it.setPlayerStatus();
            }
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          } else {
            swal({title: '何も起こりませんでした...'});
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          }
        }
        /**
         * シェアライド
         */
        if (json.s === 4) {
          // シェアライド状態の確認
          if(it.props.rideFlg) {
            // 対象の地区に来ているかどうかの確認
            if (it.props.allowMove === json.c){
              swal({title: '長旅お疲れさまでした、目的地に到着です'});
              it.props._it.setState({allowMove: null});
              it.props._it.setState({rideFlg: false});
              store.set('arwmove', it.props.allowMove);
              store.set('rideFlg', it.props.rideFlg);
              it.closeMapModal();
              it.closeCtrlModal();
              it.setState({scanFlg: true});
            } else {
              swal({title: "場所が違うようです！", icon: "error"});
              it.props.player.status.trs -= 2;
              let tx = {dir: -1, msg: '不正な移動をしたため信用度が減少した'};
              it.props._it.trustTransaction(tx);
              it.props._it.setPlayerStatus();
              it.closeMapModal();
              it.closeCtrlModal();
              it.setState({scanFlg: true});
            }
          } else {
            it.closeMapModal();
            it.closeCtrlModal();
            it.setState({scanFlg: true});
          }
        }
        /**
         * ハプニング判定
         * 信用度100で20%、1ポイントあたり1%の上昇
         */
        /**
         * スラム街
         */
        // '何か起こったようです、ハプニングカードを引いてください'
        if (json.s === 5) {
          let parcent = Math.floor(1 + Math.random() * 100);
          let title = '事件に巻き込まれてしまった！次の仕事はできそうにない・・';
          if (parcent > parseInt(it.props.player.status.trs - 20)) {
            swal({title: title, icon: 'error'}).then((agree) => {
              if (agree) {
                it.props.mlist.map((item, i) => {
                  item.limit -= 1;
                  if (item.limit < 0) {
                    let pulled = _.pullAt(it.props.mlist, [i]);
                    it.props._it.setState({mlist: it.props.mlist});
                    store.set('mission', it.props.mlist);
                    it.props.player.status.trs -= 10;
                    let tx = {dir: -1, msg: '仕事の期限が過ぎたため信用度が減少しました'};
                    it.props._it.trustTransaction(tx);
                    it.props._it.setPlayerStatus();
                  }
                });
                store.set('mission', it.props.mlist);
                it.props._it.setState({mlist: it.props.mlist});
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
          it.closeMapModal();
          it.closeCtrlModal();
          it.setState({scanFlg: true});
        }

        /**
         * 移動権の消失
         **/
        it.props._it.setState({allowMove: null});
        it.props._it.setState({rideFlg: false});
        store.set('arwmove', it.props.allowMove);
        store.set('rideFlg', it.props.rideFlg);

        /**
         * 家での回復
         */
        it.props.myhomelist.map((item, i) => {
          it.props.player.status.val -= item.req[0];
          it.props.player.status.mov += item.res[2];
          if (item.city === it.props.lastPoscity) {
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
            it.props._it.setPlayerStatus();
          }
        });
        if (it.props.player.status.val < 0) {
          it.props.player.status.trs -= 5;
          let tx = {dir: -1, msg: '借金があるため信用度が減少しました'};
          it.props._it.trustTransaction(tx);
          it.props._it.setPlayerStatus();
        }

      }
    }
  }

  doMissionHandleClick(event, item, i) {
    let it = this;
    if (it.props.player.status.str >= item.req[0]
      && it.props.player.status.int >= item.req[1]
      && it.props.lastPoscity === item.city) {
      // 成否判定 ->
      if (100 - item.rate <= Math.floor(Math.random() * 100)) {
        // 成功ならコスト払って報酬と信用を獲る
        swal({text: "ミッション成功しました！", icon: "success"})
        it.props.player.status.str = it.props.player.status.str - item.req[0];
        it.props.player.status.int = it.props.player.status.int - item.req[1];
        it.props.player.status.trs = it.props.player.status.trs + item.req[2] / 10;
        it.props.player.status.val = it.props.player.status.val + item.res;
        store.set('player', it.props.player)
        let tx = {dir: 1, msg: '仕事の実績が追加され、信用度が上昇しました'};
        it.props._it.trustTransaction(tx);
        // ミッション完了で完了リストに保存される
        it.AddCompleteMission(item.gen, item.city);

      } else {
        // 失敗なら信用がなくなるだけ
        swal({text: "Failed..", icon: "error"})
        it.props.player.status.trs = it.props.player.status.trs - 5;
        store.set('player', it.props.player)
        let tx = {dir: -1, msg: '仕事に失敗したため信用度が減少しました'};
        it.props._it.trustTransaction(tx);
      }
      let pulled = _.pullAt(it.props.mlist, [i]);
      console.log(it.props.mlist);
      it.props._it.setState({mlist: it.props.mlist});
      store.set('mission', it.props.mlist);
      it.props._it.setPlayerStatus();
    } else {
      swal({title: "実行できる状態ではありません！", icon: "warning"});
    }
  }

  doOfferHandleClick(event, _item, i) {
    let it = this;
    let item = _item.c;
    if (it.props.player.status.str >= item.req[0]
      && it.props.player.status.int >= item.req[1]) {
      // 成否判定 ->
      console.log(item);
      // 同じ街でないと実行できない・相手から先にオファーをクリアする必要がある
      if (it.props.lastPoscity === item.city) {
        // 手伝い判定
        // 自分が発信元の場合
        if (item.of_f === it.props.player.id) {
          // of_tがnullの場合のみ完了できる
          // TODO: 相手が失敗した場合はどうなるの？
          if (item.of_t === null) {
            if (100 - item.rate < Math.floor(Math.random() * 100)) {
              // 成功ならコスト払って報酬と信用を獲る
              swal({text: "ミッション成功しました！", icon: "success"})
              it.props.player.status.str = it.props.player.status.str - item.req[0];
              it.props.player.status.int = it.props.player.status.int - item.req[1];
              it.props.player.status.trs = it.props.player.status.trs + Math.floor(item.req[2] / 10);
              it.props.player.status.val = it.props.player.status.val + item.res;
              let tx = {dir: 1, msg: '仕事の実績が追加され、信用度が上昇しました'};
              it.props._it.trustTransaction(tx);
              it.props._it.setPlayerStatus();
              // ミッション完了で完了リストに保存される
              it.AddCompleteMission(item.gen, item.city);
            } else {
              // 失敗なら信用がなくなるだけ
              swal({title: "仕事に失敗した..", icon: "error"})
              it.props.player.status.trs -= 5;
              let tx = {dir: -1, msg: '仕事に失敗したため信用度が減少しました'};
              it.props._it.trustTransaction(tx);
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
          if (100 - item.rate < Math.floor(Math.random() * 100)) {
            // 成功ならコスト払って報酬と信用を獲る
            swal({title: "仕事に成功しました！", icon: "success"})
            it.props.player.status.str = it.props.player.status.str - item.req[0];
            it.props.player.status.int = it.props.player.status.int - item.req[1];
            it.props.player.status.trs = it.props.player.status.trs + Math.floor(item.req[2] / 10);
            it.props.player.status.val = it.props.player.status.val + item.res;
            let tx = {dir: 1, msg: '仕事の実績が追加され、信用度が上昇しました'};
            it.props._it.trustTransaction(tx);
            it.props._it.setPlayerStatus();
            // ミッション完了で完了リストに保存される
            it.AddCompleteMission(item.gen, item.city);
          } else {
            // 失敗なら信用がなくなるだけ
            swal({title: "仕事に失敗した..", icon: "error"})
            it.props.player.status.trs -= 5;
            let tx = {dir: -1, msg: '仕事に失敗したため信用度が減少しました'};
            it.props._it.trustTransaction(tx);
            it.props._it.setPlayerStatus();
          }
          let obj = item;
          obj.of_t = null;
          it.props._it.updateOfferData(_item._id, obj);
          it.props._it.setPlayerStatus();
        }
      } else {
        swal({title: "同じ都市内のみ完了できます！", icon: "warning"})
      }
    } else {
      swal({title: "実行できる状態ではありません！", icon: "warning"})
    }
  }

  rejectOfferHandleClick(event, _item, i) {
    let it = this;

    swal({title: '拒否しますか？', icon: 'info', buttons: true}).then((agree) => {
      if (agree) {
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

  AddCompleteMission(_gene, _city) {
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

  offerMissionHandleClick(event, item, i) {
    let it = this;
    let selected = {item: item, i: i};
    it.setState({nowSelectedItem: selected})
    it.props._it.getPlayersList();
    store.set('plist', it.props.plist);
    it.openOfferModal();
  }

  makeOfferHandleClick(e, item, i) {
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

  makeListHomes() {
    let it = this;
    let r = [];
    do {
      let arr = db_homes[Math.floor(Math.random() * db_homes.length)];
      r.push(arr);
      r = _.uniq(r);
    } while (r.length < 6);
    store.set('homes', r);
    it.props._it.setState({homelist: r});
  }

  rentHomeHandleClick(e, item, i) {
    let it = this;
    swal({
      title: "この家を借りますか？",
      icon: "info",
      buttons: true
    }).then((agree) => {
      if (agree) {
        // homeListから削除して、自分のリストに追加する
        if (it.props.myhomelist.length  < 3){
          let pulled = _.pullAt(it.props.homelist, [i]);
          it.props._it.setState({homelist: it.props.homelist});
          store.set('homes', it.props.homelist);
          let arr = it.props.myhomelist;
          arr.push(item);
          it.props._it.setState({myhomelist: arr});
          store.set('myhome', arr);
          // 少し信用が上がる
          it.props.player.status.trs += 5 + Math.floor(Math.random() * 5);
          let tx = {dir: 1, msg: '家を契約したため信用度が上昇しました'};
          it.props._it.trustTransaction(tx);
          it.props._it.setPlayerStatus();
          swal({title: '契約完了しました', icon: "success"});
        } else {
          swal({title: '家はこれ以上借りられません', icon: "error"});
        }
        it.closeHomeModal();
        it.closeCtrlModal();
      } else {
        swal({title: 'キャンセルしました', icon: 'error'});
      }
    })
  }

  saleHomeHandleClick(e, item, i) {
    // 家の契約を解除する
    let it = this;
    swal({
      title: "この家を返しますか？",
      icon: "info",
      buttons: true
    }).then((agree) => {
      if (agree) {
        // myhomeListから削除する
        // homeListを更新される
        let pulled = _.pullAt(it.props.myhomelist, [i]);
        it.props._it.setState({myhomelist: it.props.myhomelist});
        store.set('myhome', it.props.myhomelist);
        swal({title: '契約解除しました', icon: "success"});
        // 少し信用が下がる
        it.props.player.status.trs -= 7 + Math.floor(Math.random() * 7);
        let tx = {dir: -1, msg: '家を解約したため信用度が減少しました'};
        it.props._it.trustTransaction(tx);
        it.props._it.setPlayerStatus();
        it.closeHomeModal();
        it.closeCtrlModal();
      } else {
        swal({title: 'Cancel', icon: 'error'});
      }
    })

  }

  makeTradeHandleClick(e, item, i) {
    let it = this;
    console.log(item);

    swal({title: "エネルギーいくつを送りますか", icon: "info", content: 'input'}).then((amount) => {
      if (amount > 0 && it.props.player.status.mov >= amount) {
        swal({title: "欲しい₿の量を入力してください", icon: "info", content: 'input'}).then((value) => {
          if (value > 0) {
            swal({title: 'トレードを提案しますか？', icon: "info", buttons: true}).then((agree) => {
              if (agree) {
                // 電力消費
                it.props.player.status.mov -= amount;
                it.props._it.setPlayerStatus();
                // ブロードキャスト用データ整形・通信・追加
                let obj = {
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
                swal({title: "Cancel", icon: "info"}).then((agree) => {
                  it.closeCtrlModal();
                  it.closeTradeModal();
                });
              }
            })
          }
        });
      }
    });
  }

  doTradeHandleClick(e, _item, i) {
    let it = this;
    let item = _item.t;
    let title;
    if (it.props.player.id === item.fr) {
      title = 'このトレードをキャンセルしますか？';
    } else {
      title = '購入しますか？';
    }
    swal({
      title: title,
      icon: 'info',
      buttons: true
    }).then((agree) => {
      if (agree) {
        // 購入処理
        if (it.props.player.id === item.fr) {
          // 自分の場合・キャンセル処理
          // 電力を受け取る処理
          it.props.player.status.mov += parseInt(item.a);
          item.to = null;
          item.fr = null;
          it.props._it.setPlayerStatus();
          it.props._it.updateTradeData(_item._id, item);
          swal({title: "Success", icon: "success"});
        } else if (it.props.player.status.val >= item.v) {
          // お金を支払う処理
          it.props.player.status.val -= parseInt(item.v);
          // 電力を受け取る処理
          it.props.player.status.mov += parseInt(item.a);
          // 提供者にお金を渡す処理 -> player状態の更新
          let tx = [item.to, 'val', item.v]; // [0]:誰に [1]:何を [2]:どれだけ ([3]:誰から）
          it.props._it.setTransaction(tx);
          // 配列から削除
          item.to = null;
          item.fr = null;
          it.props._it.setPlayerStatus();
          it.props._it.updateTradeData(_item._id, item);
          swal({title: "Success", icon: "success"});
        }
      } else {
        swal({title: "Cancel", icon: "warning"});
      }
    })
  }

  rideCarHandleClick(e, item, i) {
    let it = this;
    // 電力を払って許可を得る。たどり着いた街で成否判定して、不正状態なら信用が減る。
    swal({
      title: "この街にいきますか？",
      icon: "info",
      buttons: true
    }).then((agree) => {
      if (agree) {
        // 信用判定・電力判定
        if (it.props.player.status.mov - item.req[0] >= 0) {
          it.props.player.status.mov -= item.req[0];
          it.props._it.setState({
            player: it.props.player,
            allowMove: item.to,
            rideFlg: true
          });
          swal({title: "移動権を獲得しました", icon: "success"});
          it.closeCarModal();
          it.closeCtrlModal();
        } else {
          swal({title: "電力が足りません", icon: "error"});
        }
      } else {
        swal({title: "Cancel", icon: "error"});
      }
    })

  }

  makeListCars() {
    let it = this;
    let r = [];
    do {
      let arr = db_cars[Math.floor(Math.random() * db_cars.length)];
      r.push(arr);
      r = _.uniq(r);
    } while (r.length < 6);
    it.props._it.setState({carlist: r});
    store.set('cars', r)
  }

  openCtrlModal() {
    this.setState({controlModalIsOpen: true})
  }

  closeCtrlModal() {
    this.setState({controlModalIsOpen: false})
  }

  openMapModal() {
    this.setState({mapModalIsOpen: true})
  }

  closeMapModal() {
    this.setState({mapModalIsOpen: false})
  }

  openOfferModal() {
    this.setState({offerModalIsOpen: true})
  }

  closeOfferModal() {
    this.setState({offerModalIsOpen: false})
  }

  openHomeModal() {
    let it = this;
    this.setState({homeModalIsOpen: true})
    // 初期値としての借りられる家リストを生成・ブロードキャスト
    let arr = store.get('homes');
    if (arr !== undefined && arr.length > 0) {
      it.props._it.setState({homelist: store.get('homes')});
    } else {
      it.makeListHomes();
    }
  }

  closeHomeModal() {
    this.setState({homeModalIsOpen: false})
  }

  openSalehomeModal() {
    this.setState({salehomeModalIsOpen: true})
  }

  closeSalehomeModal() {
    this.setState({salehomeModalIsOpen: false})
  }

  openCarModal() {
    let it = this;
    this.setState({carModalIsOpen: true})
    let arr = store.get('cars');
    if (arr !== undefined && arr.length > 0) {
      it.props._it.setState({carlist: store.get('cars')});
    } else {
      it.makeListCars();
    }
  }

  closeCarModal() {
    this.setState({carModalIsOpen: false})
  }

  openTradeModal() {
    let it = this;
    it.setState({tradeModalIsOpen: true})
    it.props._it.getPlayersList();
    store.set('plist', it.props.plist);
  }

  closeTradeModal() {
    this.setState({tradeModalIsOpen: false})
  }

  handleError(err) {
    console.log(err)
  }

  resetDataHandleClick() {
    let it = this;
    swal({
      text: 'データをリセットしますか？',
      icon: "warning",
      buttons: true
    }).then((agree) => {
      if (agree) {
        it.closeCtrlModal();
        store.clearAll();
      } else {
        swal("キャンセルしました");
      }
    });
  }

  changePlayerHandleClick() {
    let it = this;
    it.props._it.getPlayersList();
    store.set('plist', it.props.plist);
    swal({
      text: '別ユーザーでログイン',
      content: 'input',
      icon: "warning"
    }).then((value) => {
      if (value) {
        it.props._it.setState({player: it.props.plist[value].p});
        // 更新
        location.pathname = '/';
      }
    });
  }

  render() {
    const previewStyle = {
      heigth: 240,
      width: 320
    };
    const customStyles = {
      overlay: {background: 'rgba(0,0,0, .4)'},
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '72%',//openしているコンテンツの幅を変える,
        zIndex: '100'
      }
    };
    let navHeight = {
      height: window.innerHeight
    };
    let missionList = this.props.mlist.map((item, i) => {
      let cls = 'city' + item.city;
      // TODO: 納期ではなく「仕事の期限」・そこまでに実行するという意
      return (
        <li className={cls} key={i}>
          <div className="column">
            <div className="left">
              <span>必要：</span>
              <span>{item.req[0]}</span>
              <span>{item.req[1]}</span>
            </div>
            <div className="right">
              <span>報酬：</span>
              <span>{item.res}</span>
            </div>
            <div className="rate">
              <span>成功率：</span>
              <span>{item.rate}</span>
            </div>
          </div>
          <p className="limit">期限：残り<span>{item.limit - 1}</span>ターン</p>
          <div className="box_btn">
            <button onClick={e => this.offerMissionHandleClick(e, item, i)}>オファー</button>
            <button onClick={e => this.doMissionHandleClick(e, item, i)}>遂行</button>
          </div>
        </li>
      )
    });
    let offerList = this.props.oflist.map((_item, i) => {
      let item = _item.c;
      if (item.of_f === this.props.player.id || item.of_t === this.props.player.id) {
        let cls = 'city' + item.city;
        let rate = item.rate;
        if (item.rate > 100){
          rate = 100;
        }
        if (this.props.player.id === item.of_f) {
          return (
            <li className={cls} key={i}>
              <div className="column">
                <div className="left">
                  <span>必要：</span>
                  <span>{item.req[0]}</span>
                  <span>{item.req[1]}</span>
                </div>
                <div className="right">
                  <span>報酬：</span>
                  <span>{item.res}</span>
                </div>
                <div className="rate">
                  <span>成功率：</span>
                  <span>{rate}</span>
                </div>
              </div>
              <p className="limit">期限：残り<span>{item.limit - 1}</span>ターン</p>
              <div className="box_btn">
                <button onClick={e => this.doOfferHandleClick(e, _item, i)}>仕事する</button>
              </div>
            </li>
          )
        } else {
          return (
            <li className={cls} key={i}>
              <div className="column">
                <div className="left">
                  <span>必要：</span>
                  <span>{item.req[0]}</span>
                  <span>{item.req[1]}</span>
                </div>
                <div className="right">
                  <span>報酬：</span>
                  <span>{item.res}</span>
                </div>
                <div className="rate">
                  <span>成功率：</span>
                  <span>{rate}</span>
                </div>
              </div>
              <p className="limit">期限：残り<span>{item.limit - 1}</span>ターン</p>
              <div className="box_btn">
                <button onClick={e => this.rejectOfferHandleClick(e, _item, i)}>拒否する</button>
                <button onClick={e => this.doOfferHandleClick(e, _item, i)}>仕事する</button>
              </div>
            </li>
          )
        }
      }
    });
    let compList = this.props.complist.map((item, i) => {
      let cls = 'city' + item.city;
      return (
        <li className={cls} key={i}/>
      )
    });
    let tradeList = this.props.tradelist.map((_item, i) => {
      let item = _item.t;
      if (item.to === this.props.player.id || item.fr === this.props.player.id) {
        let cls = '';
        if (item.fr === this.props.player.id) {
          cls = 'self';
        }
        let _from = this.props.player.name;
        let _to;
        this.props.plist.map((_p, _i) => {
          if (_p.p.id === item.to) {
            _to = _p.p.name;
          }
        });
        let plyr = _from + " → " + _to;
        let val = 'エネルギー' + item.a + "⇆" + item.v + 'コイン';
        let text = plyr + " " + val;
        return (
          <li className={cls} key={i} onClick={e => this.doTradeHandleClick(e, _item, i)}>{text}</li>
        )
      }
    })
    let homeList = this.props.homelist.map((item, i) => {
      let cls = 'city' + item.city;
      let dist;
      if (item.city === 1) { dist = 'A';
      } else if(item.city === 2){ dist = 'B';
      } else if(item.city === 3){ dist = 'C';
      } else if(item.city === 4){ dist = 'D';
      } else if(item.city === 5){ dist = 'E';
      } else if(item.city === 6){ dist = 'F'; }
      if (item.req[1] <= this.props.player.status.trs) {
        return (
          <li className={cls} key={i}>
            <div className="key_dist">
              <span>家の場所：</span>
              <span>{dist}</span>
            </div>
            <div className="key_require">
              <span>必要：</span>
              <span>{item.req[0]}</span>
              <span>/ターン</span>
            </div>
            <div className="key_recover">
              <span>回復：</span>
              <span>{item.res[0]}</span>
              <span>{item.res[1]}</span>
              <span>{item.res[2]}</span>
            </div>
            <div className="box_btn">
              <button onClick={e => this.rentHomeHandleClick(e, item, i)}>契約</button>
            </div>
          </li>
        )
      } else {
        return (
          <li className={cls + ' disabled'} key={i}>
            <div className="key_dist">
              <span>家の場所：</span>
              <span>{dist}</span>
            </div>
            <div className="key_require">
              <span>必要：</span>
              <span>{item.req[0]}</span>
              <span>/ターン</span>
            </div>
            <div className="key_recover">
              <span>回復：</span>
              <span>{item.res[0]}</span>
              <span>{item.res[1]}</span>
              <span>{item.res[2]}</span>
            </div>
            <div className="box_btn">
              <button>信用が足りません</button>
            </div>
          </li>
        )
      }
    });
    let myhomeList = this.props.myhomelist.map((item, i) => {
      let cls = 'city' + item.city;
      let dist;
      if (item.city === 1) { dist = 'A';
      } else if(item.city === 2){ dist = 'B';
      } else if(item.city === 3){ dist = 'C';
      } else if(item.city === 4){ dist = 'D';
      } else if(item.city === 5){ dist = 'E';
      } else if(item.city === 6){ dist = 'F'; }
      return (
        <li className={cls} key={i} onClick={e => this.saleHomeHandleClick(e, item, i)}>
          <div className="key_dist">
            <span>家の場所：</span>
            <span>{dist}</span>
          </div>
          <div className="key_require">
            <span>必要：</span>
            <span>{item.req[0]}</span>
          </div>
          <div className="key_recover">
            <span>回復：</span>
            <span>{item.res[0]}</span>
            <span>{item.res[1]}</span>
            <span>{item.res[2]}</span>
          </div>
          <div className="box_btn">
            <button onClick={e => this.rentHomeHandleClick(e, item, i)}>解約</button>
          </div>
        </li>
      )
    });
    let carList = this.props.carlist.map((item, i) => {
      let cls = 'city' + item.to;
      let dist;
      if (item.to === 1) { dist = 'A';
      } else if(item.to === 2){ dist = 'B';
      } else if(item.to === 3){ dist = 'C';
      } else if(item.to === 4){ dist = 'D';
      } else if(item.to === 5){ dist = 'E';
      } else if(item.to === 6){ dist = 'F'; }
      if (item.req[1] <= this.props.player.status.trs) {
        return (
          <li className={cls} key={i}>
            <div>
              <span>行き先：</span>
              <span>{dist}</span>
            </div>
            <div className="key_require">
              <span>必要：</span>
              <span>{item.req[0]}</span>
            </div>
            <div className="box_btn">
              <button onClick={e => this.rideCarHandleClick(e, item, i)}>乗車</button>
            </div>
          </li>
        )
      } else {
        return (
          <li className={cls + ' disabled'} key={i}>
            <div>
              <span>行き先：</span>
              <span>{dist}</span>
            </div>
            <div className="key_require">
              <span>必要：</span>
              <span>{item.req[0]}</span>
            </div>
            <div className="box_btn">
              <button>信用が足りません</button>
            </div>
          </li>
        )
      }
    });
    let offerPlayerList = this.props.plist.map((item, i) => {
      if (item.p.id !== this.props.player.id) {
        return (
          <li key={i}>
            {item.p.name}
            <button onClick={e => this.makeOfferHandleClick(e, item, i)}>お願いする</button>
          </li>
        )
      }
    })
    let tradePlayerList = this.props.plist.map((item, i) => {
      if (item.p.id !== this.props.player.id) {
        return (
          <li key={i}>
            {item.p.name}
            <button onClick={e => this.makeTradeHandleClick(e, item, i)}>トレードする</button>
          </li>
        )
      }
    })
    let trustList = this.props.trustlist.map((item, i) => {
      let cls;
      if (item.dir === 1) {
        cls = 'p';
      } else if (item.dir === 0) {
        cls = 's';
      } else if (item.dir === -1) {
        cls = 'm';
      }
      return (
        <li key={i} className={cls}>{item.msg}</li>
      )
    })
    let strcls = {width: ((this.props.player.status.str / this.props.player.max.str ) * 60) + "px"};
    let intcls = {width: ((this.props.player.status.int / this.props.player.max.int ) * 60) + "px"};
    return (
      <div className="app">
        <header>
          <h1>{this.props.player.name}</h1>
          <div className="state state_str">
            <div className="bar"><span style={strcls} /></div>
            <CountUp start={0} end={this.props.player.status.str} duration={3}/>/<CountUp start={0}
                                                                                          end={this.props.player.max.str}
                                                                                          duration={3}/>
          </div>
          <div className="state state_int">
            <div className="bar"><span style={intcls} /></div>
            <CountUp start={0} end={this.props.player.status.int} duration={3}/>/<CountUp start={0}
                                                                                          end={this.props.player.max.int}
                                                                                          duration={3}/>
          </div>
          <div className="state state_mov">
            <CountUp start={0} end={this.props.player.status.mov} duration={3}/>
          </div>
          <div className="state state_val">
            <CountUp start={0} end={this.props.player.status.val} duration={3}/>
          </div>
          <button onClick={this.openCtrlModal.bind(this)} className="btn_menu"><img src="./images/button_menu.png"/>
          </button>
        </header>
        <main className="container">
          <div className="box left" style={navHeight}>
            <h2 className={this.props.markerTrust}>信用度ログ</h2>
            <PerfectScrollbar>
              <ul className="trust_list">
                {trustList}
              </ul>
            </PerfectScrollbar>
          </div>
          <div className="box right">
            <div className="mission">
              <h2>ワークリスト</h2>
              <ul className="mission_list">
                {missionList}
              </ul>
              <h2>オファーリスト</h2>
              <ul className="mission_list">
                {offerList}
              </ul>
              <h2>成功したワーク</h2>
              <ul className="complete_list">
                {compList}
              </ul>
              {/*<h2>トレードリスト</h2>*/}
              {/*<ul className="trade_list">*/}
                {/*{tradeList}*/}
              {/*</ul>*/}
            </div>
            <button onClick={this.openMapModal.bind(this)} className="btn_camera">
              <img src="./images/camera.png"/>
            </button>
            <button onClick={this.openHomeModal.bind(this)} className="btn_buy">
              <img src="./images/button_buyhome.png"/>
            </button>
            <button onClick={this.openSalehomeModal.bind(this)} className="btn_sale">
              <img src="./images/button_salehome.png"/>
            </button>
            <button onClick={this.openCarModal.bind(this)} className="btn_car">
              <img src="./images/button_car.png"/>
            </button>
            {/*<button onClick={this.openTradeModal.bind(this)} className="btn_trade">*/}
              {/*<img src="./images/button_trade.png"/>*/}
            {/*</button>*/}
          </div>
        </main>
        <div>
          <Modal
            isOpen={this.state.controlModalIsOpen}
            style={customStyles}
            contentLabel="Buttons"
          >
            <button onClick={this.closeCtrlModal.bind(this)}>閉じる</button>
            <button className="dangerous" onClick={this.resetDataHandleClick.bind(this)}>データリセット</button>
            <button className="dangerous" onClick={this.changePlayerHandleClick.bind(this)}>プレイヤーを登録する</button>
          </Modal>
          <Modal
            isOpen={this.state.mapModalIsOpen}
            style={customStyles}
            contentLabel="Map"
          >
            <h1>読み込み</h1>
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
              <h1>他の地区に行く</h1>
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
          <Modal isOpen={this.state.selectPlayerModalIsOpen} style={customStyles} contentLabel="SelectPlayer">
            <div className='tradeModal'>
              <h1>プレイヤー選択</h1>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Index

// TODO: レート100%で失敗する問題・・・ -> 解決
// TODO: 移動権が見えない問題 -> UIのアップデート
// TODO: 移動権は1ターンで消える

// TODO: オファーの期限切れ処理を改善する
// TODO: 信用度動作ランプ処理

// TODO: 家の最大借りられる数　三軒に固定
