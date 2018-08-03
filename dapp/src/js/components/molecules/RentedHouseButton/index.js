import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import {Label} from '../../../components/atoms/Text'

const RentedHouseButton = ({...props}) => {

  let {handle,linked} = props;

  return (
    <Container width={'157px'}
               height={'107.5px'}
               onClick={()=>{handle.push(linked)}}
    >
      <MenuIcon {...props} />
      <Title>{props.label}</Title>
    </Container>
  )
}

const Container = styled(Button)`
  margin: 15px 0 0;
  position: relative;
  background: linear-gradient(19deg, #1d6ea9 0%, #3adee8 100%);
  box-shadow: 1px 1px 6.2px rgba(0,0,0,.4);
`;

const MenuIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 70px;
  height: 60px;
`;

const Title = styled(Label)`
  position: absolute;
  bottom: 16px;
  left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: ${Const.Color.DEFAULT};
`;

export default RentedHouseButton;