import React, { Component } from "react"
import { connect } from 'react-redux'
import styled from 'styled-components'

import WorkListContainer from "../../containers/organisms/WorkList"
import WorkMarketContainer from "../../containers/organisms/WorkMarket"

class Home extends Component {
  render() {
    return (
      <div>
        <WorkList />
        <WorkMarket />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
  };
}

const mapDispatchToProps = dispatch => {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

const WorkList = styled(WorkListContainer)``;
const WorkMarket = styled(WorkMarketContainer)``;
