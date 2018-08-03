import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import WorkList from "../../containers/organisms/WorkList"

class List extends Component {
  render() {
    return (
      <PageContainer>
        <WorkList/>
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
)(List);

const PageContainer = styled.div`
  padding: 112px 0 0;
`;