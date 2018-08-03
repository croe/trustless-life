import React from 'react'
import styled from 'styled-components'
// import Const from '../../../const'

import Icon from '../../../components/atoms/Icon'
import {H2, Label} from '../../../components/atoms/Text'
import ListItem from "../../atoms/ListItem";

const ListContainer2= ({...props}) => {

  return (
    <Container>
      <Title>Total credit</Title>
      <div>
        <Item>
          <Mark bitcoin_blue />
          <Text>bitcoin</Text>
          <h4>30</h4>
        </Item>
        <Item>
          <Mark energy_blue />
          <Text>electric power</Text>
          <h4>278</h4>
        </Item>
      </div>
      <Title>Credit log</Title>
      <div>
        <Item>
          <Mark arrowdown />
          <Text>You have debt.</Text>
        </Item>
        <Item>
          <Mark arrowup />
          <Text>Results of the work has been added.</Text>
        </Item>
        <Item>
          <Mark arrowup />
          <Text>Sign a rental contract</Text>
        </Item>
        <Item>
          <Mark arrowdown />
          <Text>Canceled a rental contract</Text>
        </Item>
      </div>
    </Container>
  )

}

const Container = styled.div`
  background: linear-gradient(19deg, #0e2a3e 0%, #43607c 100%);
  padding: 20px;
`;

const Title = styled(H2)`
  padding: 12px 0 15px;
`;

const Item = styled(ListItem)`
  position: relative;
  &:last-child {
    border-bottom: none;
  }
  > h4 {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: 29px;
    font-weight: bold;
    color: #ffffff;
  }
`;

const Mark = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  display: inline-block;
`;

const Text = styled(Label)`
  font-size: 13.5px;
  color: #fff;
  padding: 11px 0 11px 22px;
  display: inline-block;
`;

export default ListContainer2;