import React from 'react'
import styled from 'styled-components'
import { pure } from 'recompose'

import WorkCard from '../../../components/molecules/WorkCard'
import { H2 } from '../../../components/atoms/Text'

export default pure(function WorkMarket(props) {

  return (
    <Container>
      <ContainerTitle>Work Market</ContainerTitle>
      <WorkCard
        name={`Work`}
        district={'C'}
        strength={4}
        intelligence={10}
        reward={20}
        rate={60}
        duedate={6}
        button1={["Denied", button1OnClick]}
        button2={["Get", button2OnClick]}
      />
      <WorkCard
        name={`Remote Work`}
        district={'E'}
        strength={4}
        intelligence={10}
        reward={20}
        rate={60}
        duedate={6}
        button1={["Denied", button1OnClick]}
        button2={["Get", button2OnClick]}
      />
      <WorkCard
        name={`Work`}
        district={'D'}
        strength={4}
        intelligence={10}
        reward={20}
        rate={60}
        duedate={6}
        button1={["Denied", button1OnClick]}
        button2={["Get", button2OnClick]}
      />
    </Container>
  )

})

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