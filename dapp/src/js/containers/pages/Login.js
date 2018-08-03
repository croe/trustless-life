import React, { Component } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components'

class Login extends Component {
  render() {
    return (
      <Container>
        <div>
          <h1>TRUSTLESS LIFE</h1>
          <p>
            <span>User Name</span>
            <input type="text"/>
          </p>
          <LoginButton onClick={()=> {window.location.pathname = 'menu'}}
          >Login</LoginButton>
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
  background: #38454f;
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
    position: absolute;
    display: block;
    width: 300px;
    left: -50px;
    top: -40px;
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
)(Login);