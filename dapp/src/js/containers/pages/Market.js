import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import WorkMarket from "../../containers/organisms/WorkMarket"

class Market extends Component {
  render() {
    return (
      <PageContainer>
        <WorkMarket />
      </PageContainer>
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
)(Market);

const PageContainer = styled.div`
  padding: 112px 0 0;
`;