import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import MenuButtons from "../../containers/organisms/MenuButtons"

class Move extends Component {
  render() {
    return (
      <Container>
        <MenuButtons />
        <img src="/assets/images/modalr.png" alt="" onClick={()=>{window.location.pathname = 'menu'}}/>
      </Container>
    )

  }
}

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
)(Move);

const Container = styled.div`
  > img {
    position: fixed;
    top: 62px;
    left: 0;
    width: 100%;
  }
`;
