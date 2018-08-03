import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

// FIXME コンポーネントの定義が雑
import ListContainer2 from "../../components/molecules/ListContainer2"

class User extends Component {
  render() {
    return (
      <div>
        <Image>
          <img src="/assets/images/chart.png" alt=""/>
        </Image>
        <ListContainer2 />
      </div>
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
)(User);


const Image = styled.div`
  padding-top: 62px;
  width: 100%;
  img {
    width: 100%;
  }
`;

