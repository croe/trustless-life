import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Modal from "../../components/molecules/Modal"
import MenuButtons from "../../containers/organisms/MenuButtons"

class House extends Component {
  render() {
    return (
      <Container>
        <MenuButtons />
        <Modal />
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
)(House);

const Container = styled.div`
  > img {
    position: fixed;
    top: 62px;
    left: 0;
    width: 100%;
  }
`;
