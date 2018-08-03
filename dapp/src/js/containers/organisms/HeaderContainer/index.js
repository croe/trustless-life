import React from 'react'
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import styled from 'styled-components'
// import * as menuModule from '../../../redux/modules/reader'
import * as statusModule from '../../../redux/modules/status'
import { withRouter } from 'react-router-dom'

import { pure } from 'recompose'

import Const from "../../../const/"
import Icon from "../../../components/atoms/Icon"
import UserNameContainer from "../../../components/molecules/UserNameContainer"
import StatusBarComponent from "../../../containers/organisms/StatusBar"

const HeaderContainer = pure(props => {

  let {history, status, player} = props;

  return (
    <Container>
      <Upper>
        <UserName
          name={player.name}
        />
        <MenuIcon menu
                  onClick={() => { history.push('/menu') }}
        />
      </Upper>
      <Lower>
        <StatusBar
          status={status}
        />
      </Lower>
    </Container>
  )
});

const mapStateToProps = state => {
  return {
    status: state.status,
    player: state.player
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setState: status => dispatch(statusModule.setStatus(status))
  }
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 112px;
  border-bottom: 1px solid ${Const.Color.BORDER.GRAY};
  background-color: ${Const.Color.DEFAULT};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  box-shadow: 0px 1px 5px rgba(0,0,0,0.2)
`;

const MenuIcon = styled(Icon)`
  position: absolute;
  top: 18px;
  right: 20px;
  display: block;
  width: 32px;
  height: 24.5px;
`;

const UserName = styled(UserNameContainer)`
  position: absolute;
  top: 16px;
  left: 20px;
`;

const Upper = styled.div`
  position: absolute;
  width: 100%;
  height: 62px;
  display: block;
  top: 0;
  left: 0;
`;

const Lower = styled.div`
  position: absolute;
  width: 100%;
  height: 52px;
  display: block;
  bottom: 0;
  left: 0;
`;

const StatusBar = styled(StatusBarComponent)`
`;

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer));