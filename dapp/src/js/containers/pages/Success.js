import React, { Component } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components'
import Const from '../../const'

import Icon from '../../components/atoms/Icon'

class Success extends Component {
  render() {
    return (
      <Container>
        <div>
          <CheckIcon check />
          <h1>Success!</h1>
          <LoginButton onClick={()=> {window.location.pathname = 'list'}}
          >OK</LoginButton>
        </div>
      </Container>
    );
  }
}

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: ${Const.Color.DISTRICT.C};
  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 200px;
    height: auto;
    text-align: center;
    > h1 {
    font-size: 30px;
    font-weight: 700;
    text-align: center;
    line-height: 40px;
    display: block;
    width: 100%;
    color: #fff;
    }
    span {
      display: inline-block;
      color: #fff;
      margin: 0 0 10px;
    }
    input {
      width: 200px;
      height: 40px;
      padding: 15px 20px;
      border-radius: 40px;
      &:focus {
        outline: none;
      }
    }
  }
`;

const LoginButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #38454f;
  font-size: 20px;
  font-weight: 700;
  width: 200px;
  height: 40px;
  border-radius: 40px;
  background: #fff;
  text-decoration: none;
  margin: 20px 0;
`;

const CheckIcon = styled(Icon)`
  width: 50px;
  height: 50px;
  margin: 0 auto;
`;


function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Success);