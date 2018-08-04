import React, { Component } from "react"
import { createBrowserHistory } from "history"
import { Route } from "react-router-dom"
import { Provider, connect } from "react-redux"
import persistState from 'redux-localstorage'
import { createStore, combineReducers, applyMiddleware, compose} from 'redux';
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "./components/util/animated_switch"
import Swal from 'sweetalert2'
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  // push
} from "react-router-redux";

import {composeWithDevTools} from 'redux-devtools-extension';
import playerReducer from './redux/modules/player'
import statusReducer from './redux/modules/status'
import readerReducer from './redux/modules/reader'

import * as readerModule from './redux/modules/reader'
import * as playerModule from './redux/modules/player'

import db_works from "./const/db_mission"

import ReaderContainer from "./components/atoms/Reader"
import HeaderContainer from "./containers/organisms/HeaderContainer"
import ModalContainer from "./components/molecules/Modal"
import QRReader from "./components/molecules/QRReader"
import {H2} from "./components/atoms/Text"

import Login from "./containers/pages/Login"
import Menu from "./containers/pages/Menu"
import User from "./containers/pages/User"
import List from "./containers/pages/List"
import Market from "./containers/pages/Market"
import Chart from "./containers/pages/Chart"
import Success from "./containers/pages/Success"
import Move from "./containers/pages/Move"
import House from "./containers/pages/House"
import Missed from "./containers/pages/404"
import styled from 'styled-components'

const Header = styled(HeaderContainer)``;
const Modal = styled(ModalContainer)``;

const history = createBrowserHistory();

const enhancer = compose(persistState(/*paths, config*/))

const store = createStore(
  combineReducers({
    status: statusReducer,
    reader: readerReducer,
    player: playerReducer,
    routing: routerReducer
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history))),
  enhancer
);

class RootContainer extends Component {

  render(){
    return (
      <ConnectedRouter history={history}>
        <Route
          render={ (props) => (
            <TransitionGroup component="main" className="main">
              <Header />
              <Reader
                onClick={() => { this.props.readerModalOpen() }}
              />
              <Modal
                isOpen={this.props.reader.isOpen}
                onClose={this.props.readerModalClose}
                render={props => {
                  return (
                    <div {...props}>
                      <H2>QR Reader</H2>
                      <QRContainer>
                        <QRReader
                          delay={300}
                          onError={(err) => {console.log(err)}}
                          onScan={
                            data => {
                              console.log(this.props);
                              let json = JSON.parse(data);
                              // ほんとはここで別Actionを発行するとよい
                              // onScanから、読み込んだjson.xで振り分けて発行
                              if (json && this.props.player.turn_action > 0) {
                                if (json.x === 8) { determineAddWork(json, this.props) }
                              }
                              // 読み込み完了処理。

                            }
                          }
                        />
                      </QRContainer>
                    </div>
                  )
                }}
              />
              <AnimatedSwitch
                key={props.location.key}
                location={props.location}
              >
                <Route exact
                       path="/"
                       render={props => (
                         <Login {...props} />
                       )}
                />
                <Route exact
                       path="/menu"
                       render={props => (
                         <Menu {...props} />
                       )}
                />
                <Route exact
                       path="/user"
                       render={props => (
                         <User {...props} />
                       )}
                />
                <Route exact
                       path="/list"
                       render={props => (
                         <List {...props} />
                       )}
                />
                <Route exact
                       path="/market"
                       render={props => (
                         <Market {...props} />
                       )}
                />
                <Route exact
                       path="/chart"
                       render={props => (
                         <Chart {...props} />
                       )}
                />
                <Route exact
                       path="/success"
                       render={props => (
                         <Success {...props} />
                       )}
                />
                <Route exact
                       path="/move"
                       render={props => (
                         <Move {...props} />
                       )}
                />
                <Route exact
                       path="/house"
                       render={props => (
                         <House {...props} />
                       )}
                />
                <Route component={Missed} />
              </AnimatedSwitch>
            </TransitionGroup>
          )}
        />
      </ConnectedRouter>
    )
  }
}

const Reader = styled(ReaderContainer)`
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 100;
`;

const QRContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0 0;
`;

const determineAddWork = (data, props) => {
  // FIXME: これはReducerとかで対応した方が再利用性高い。
  let work = db_works[data.c - 1][Math.abs(data.d - 3)];
  // props.playerDecreaseAction();
  if (props.status.credit.value > work.req[2]) {
    Swal('Get Job!', 'You got a now work', 'success')
    props.readerModalClose();
    props.playerAddWork(work);
  } else {
    Swal('Oops...', 'Something went wrong!', 'error')
    props.readerModalClose();
    return false;
  }
}

const mapStateToProps = state => {
  return {
    player: state.player,
    status: state.status,
    reader: state.reader
  }
}

const mapDispatchToProps = dispatch => {
  return {
    readerModalOpen: () => dispatch(readerModule.isOpen()),
    readerModalClose: () => dispatch(readerModule.onClose()),
    playerAddWork: data => dispatch(playerModule.addWork(data)),
    playerDecreaseAction: () => dispatch(playerModule.decreaseAction())
  }
}

const ConnectedRootContainer =  connect(mapStateToProps, mapDispatchToProps)(RootContainer);

export default () => (
  <Provider store={store}>
    <ConnectedRootContainer />
  </Provider>
)