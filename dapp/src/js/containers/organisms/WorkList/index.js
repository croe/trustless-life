import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { pure } from 'recompose'
import * as statusModule from '../../../redux/modules/status'

import WorkCard from '../../../components/molecules/WorkCard'
import HouseCard from '../../../components/molecules/HouseCard'
import { H2 } from '../../../components/atoms/Text'

const WorkListContainer = pure(props => {

  const contract = {
    req: {
      fee: 10,
      credit: 100
    },
    res: {
      strength: 5,
      intelligence: 3,
      energy: 1
    }
  }

  return (
    <Container>
      <ContainerTitle>Work List</ContainerTitle>
      <WorkCard
        name={`Remote Work`}
        district={'B'}
        strength={4}
        intelligence={10}
        reward={20}
        rate={60}
        duedate={6}
        button1={["Offer", button1OnClick]}
        button2={["Do", button2OnClick]}
      />
      <HouseCard
        name={`Elegant House`}
        district={'A'}
        contract={contract}
        status={props.status}
      />
      <WorkCard
        name={`Remote Work`}
        district={'D'}
        strength={4}
        intelligence={8}
        reward={10}
        rate={60}
        duedate={6}
        button1={["Offer", button1OnClick]}
        button2={["Do", button2OnClick]}
      />
      <WorkCard
        name={`Remote Work`}
        district={'E'}
        strength={4}
        intelligence={10}
        reward={20}
        rate={60}
        duedate={6}
        button1={["Offer", button1OnClick]}
        button2={["Do", button2OnClick]}
      />
      <WorkCard
        name={`Work`}
        district={'F'}
        strength={4}
        intelligence={10}
        reward={20}
        rate={60}
        duedate={6}
        button1={["Offer", button1OnClick]}
        button2={["Do", button2OnClick]}
      />
    </Container>
  )

})

const mapStateToProps = state => {
  return {
    status: state.status
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

const Container = styled.div`
  position: relative;
  padding: 0 20px;
  > div {
    margin: 10px 0 0;
  }
`;

const ContainerTitle = styled(H2)`
  padding: 22px 0 12px;
`;

const button1OnClick = (e) => {
  console.log(e)
}

const button2OnClick = (e) => {
  console.log(e)
  window.location.pathname = 'success'
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkListContainer)