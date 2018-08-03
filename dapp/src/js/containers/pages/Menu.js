import React, { Component } from 'react'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as statusModule from '../../redux/modules/status'
import * as readerModule from "../../redux/modules/reader";
import { withRouter } from 'react-router-dom'

import MenuButtons from "../../containers/organisms/MenuButtons"
// import Modal from "../../components/molecules/Modal"

class Menu extends Component {

  componentDidMount(){
    setTimeout(()=>{
      // history.push('/list')
      let newState = Object.assign({},this.props.status);
      newState.strength.max = 10;
      newState.strength.value = 7;
      this.props.setStatus(newState)
    }, 2000)

    console.log(this.props)

  }

  render() {
    return (
      <PageContainer>
        <MenuButtons history={this.props.history} />
      </PageContainer>
    )

  }
}

const mapStateToProps = state => {
  return {
    status: state.status,
    reader: state.reader
  };
}

const mapDispatchToProps = dispatch => {
  // return bindActionCreators({updateStatus}, dispatch)
  return {
    setStatus: status => dispatch(statusModule.setStatus(status)),
    readerModalClose: () => dispatch(readerModule.onClose())
  }
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu));


const PageContainer = styled.div`
  padding: 120px 0 0;
`;