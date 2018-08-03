import React from 'react'
import styled from 'styled-components'
import { pure } from 'recompose'

import MenuButtonComponent from '../../../components/molecules/MenuButton'

export default pure(function MenuButtons(props) {

  let {history} = props;

  return (
    <Container>
      <MenuButton label={`Work List`}
                  listed={true}
                  handle={history}
                  linked={'/list'}
      />
      <MenuButton label={`Work Market`}
                  market={true}
                  handle={history}
                  linked={'/market'}
      />
      <MenuButton label={`Rent a house`}
                  house={true}
                  handle={history}
                  linked={'/house'}
      />
      <MenuButton label={`Move`}
                  car={true}
                  handle={history}
                  linked={'/move'}
      />
      <MenuButton label={`Chart`}
                  chart={true}
                  handle={history}
                  linked={'/chart'}
      />
      <MenuButton label={`My page`}
                  user_white={true}
                  handle={history}
                  linked={'/user'}
      />
    </Container>
  )

})

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 0 20px 20px;
`;

const MenuButton = styled(MenuButtonComponent)`
  display: block;
`;