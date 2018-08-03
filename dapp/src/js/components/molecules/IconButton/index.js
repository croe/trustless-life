import React from 'react'
import styled from 'styled-components'
import Const from '../../../const'

import Button from '../../../components/atoms/Button'
import Icon from '../../../components/atoms/Icon'
import {Label} from '../../../components/atoms/Text'

const IconButton = ({...props}) => {

  let {handle,linked} = props;

  return (
    <Container width={'157px'}
               height={'67.5px'}
               onClick={()=>{handle.push(linked)}}
    >
      <MainIcon {...props} />
      <Title>{props.label}</Title>
    </Container>
  )
}

const Container = styled(Button)`
  margin: 15px 0 0;
  position: relative;
  background: linear-gradient(19deg, #0e2a3e 0%, #43607c 100%);
  box-shadow: 1px 1px 6.2px rgba(0,0,0,.4);
`;

const MainIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  width: 37px;
  height: 33px;
`;

const Title = styled(Label)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50px;
  font-size: 15px;
  font-weight: bold;
  text-align: left;
  color: ${Const.Color.DEFAULT};
`;

export default IconButton;