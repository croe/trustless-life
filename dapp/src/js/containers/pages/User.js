import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

// FIXME コンポーネントの定義が雑
import ListContainer from "../../components/molecules/CreditLog"
import IconButton from "../../components/molecules/IconButton"
import UserPhotoContainer from "../../components/molecules/UserPhotoContainer"

class User extends Component {
  render() {
    return (
      <PageContainer>
        <UserPhoto />
        <ButtonContainer>
          <IconButton label={`Rented house`}
                      house={true}
                      handle={()=>{return true}}
                      linked={'/list'}
          />
          <IconButton label={`Results of the work list`}
                      check={true}
                      handle={()=>{return true}}
                      linked={'/list'}
          />
        </ButtonContainer>
        <ListContainer />
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
)(User);

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 20px 20px;
`;

const UserPhoto = styled(UserPhotoContainer)`
`;

const PageContainer = styled.div`
  padding: 120px 0 0;
`;

